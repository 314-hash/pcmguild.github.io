const Queue = require('bull');
const Redis = require('redis');

// Create Redis client for caching
const cache = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
cache.connect().catch(console.error);

// Create request queue
const requestQueue = new Queue('request-queue', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  },
  limiter: {
    max: 100,
    duration: 60000 // 1 minute
  }
});

// Process queue items
requestQueue.process(async (job) => {
  const { type, data } = job.data;
  
  try {
    // Check cache first
    const cachedResult = await cache.get(`${type}:${JSON.stringify(data)}`);
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    // Process request based on type
    let result;
    switch (type) {
      case 'auth':
        result = await processAuthRequest(data);
        break;
      case 'stake':
        result = await processStakeRequest(data);
        break;
      default:
        throw new Error('Invalid request type');
    }

    // Cache the result
    await cache.set(
      `${type}:${JSON.stringify(data)}`,
      JSON.stringify(result),
      'EX',
      300 // 5 minutes cache
    );

    return result;
  } catch (error) {
    console.error(`Queue processing error: ${error}`);
    throw error;
  }
});

// Queue error handling
requestQueue.on('error', (error) => {
  console.error('Queue error:', error);
});

requestQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
});

module.exports = {
  addToQueue: async (type, data) => {
    return await requestQueue.add({ type, data });
  },
  getQueue: () => requestQueue,
  getCache: () => cache
};
