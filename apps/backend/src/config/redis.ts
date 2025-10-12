import Redis from 'ioredis';

class RedisClient {
    private static instance: Redis;
    private constructor() { }

    public static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = process.env.PRODUCTION === 'true'
                ? new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
                : new Redis({
                    host: process.env.REDIS_CLOUD_HOST,
                    port: 17873,
                    password: process.env.REDIS_CLOUD_PASS,
                    username: 'default',
                    maxRetriesPerRequest: null,
                })

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
