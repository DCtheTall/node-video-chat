import { RedisPubSub } from 'graphql-redis-subscriptions';

export * from './constants';

export default new RedisPubSub({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retry_strategy: options => Math.max(options.attempt * 100, 3000),
});
