import IORedis from 'ioredis';

// This client will automatically use the REDIS_URL from your .env file
const redisClient = new IORedis(process.env.REDIS_URL);

redisClient.on('connect', () => {
  console.log('Connected to Redis successfully!');
});

redisClient.on('error', (err) => {
  console.error(' Could not establish a connection to Redis:', err);
});

export default redisClient;