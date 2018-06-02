import AWS from 'aws-sdk';
import Promise from 'bluebird';
import crypto from 'crypto';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new AWS.S3();
const putObject = Promise.promisify(s3.putObject, { context: s3 });

/**
 * @param {string} imgUrl url encoded image
 * @param {string} extension of image
 * @returns {string} filename in AWS bucket
 */
export async function uploadImage(imgUrl, extension) {
  const data = imgUrl.replace(/^data:image\/\w+;base64,/, '');
  const buffer = new Buffer(data, 'base64');
  const filename = `${crypto.createHash('sha1').update(String(Date.now() * Math.random())).digest('hex')}.${extension}`;
  await putObject({
    Bucket: process.env.AWS_BUCKET,
    Body: buffer,
    ACL: 'public-read',
    Key: filename,
  });
  return filename;
}
