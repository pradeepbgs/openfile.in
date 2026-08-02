import Redis from 'ioredis';

class RedisClient {
    private static instance: Redis;
    private constructor() { }

    public static getInstance() {
        if (!RedisClient.instance) {
            if (process.env.REDIS_URL) {
                RedisClient.instance = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
            } else {
                RedisClient.instance = new Redis({
                    host: process.env.REDIS_HOST || '127.0.0.1',
                    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
                    password: process.env.REDIS_PASS || process.env.REDIS_PASSWORD || undefined,
                    maxRetriesPerRequest: null,
                });
            }

            RedisClient.instance.set('animal', 'cat');
            RedisClient.instance.get('animal').then((result) => {
                console.log('Test value:', result);
            });

            RedisClient.instance.once('connect', () => console.log('Redis connected'));
            RedisClient.instance.once('error', (err) => console.error('Redis Error:', err));
        }

        return RedisClient.instance;
    }
}

export const redis = RedisClient.getInstance();
