import { GraphQLString } from 'graphql';
import { MutationResponse } from '../../types';
import { uploadImage } from '../../../lib/aws';
import pubsub, { USER_UPDATE } from '../../subscription/pubsub';

export default {
  name: 'UpdatePicture',
  type: MutationResponse,
  args: {
    fileUrl: { type: GraphQLString },
    extension: { type: GraphQLString },
  },
  async resolve(parent, { fileUrl, extension }, req) {
    try {
      const filename = await uploadImage(fileUrl, extension);
      req.user.pictureUrl = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${filename}`;
      await req.user.save();
      pubsub.publish(USER_UPDATE, { userId: req.user.id });
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  },
};
