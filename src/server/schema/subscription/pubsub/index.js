import { RedisPubSub } from 'graphql-redis-subscriptions';

export default new RedisPubSub({
  host: 'localhost',
  port: 6379,
  retry_strategy: options => Math.max(options.attempt * 100, 3000),
});
