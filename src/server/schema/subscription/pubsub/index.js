import { RedisPubSub } from 'graphql-redis-subscriptions';
import url from 'url';

export * from './constants';

const redisUrl = url.parse(process.env.REDISCLOUD_URL);

export default new RedisPubSub({
  connection: {
    host: redisUrl.hostname,
    port: redisUrl.port,
    password: redisUrl.auth.split(':')[1],
  },
  retry_strategy: options => Math.max(options.attempt * 100, 3000),
});
