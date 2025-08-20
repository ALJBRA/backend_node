const { createClient } = require('redis');

const client = createClient({
    url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

client.on('error', (error) => console.log('Redis Client Error', error));

async function connectRedis() {
    try {
        await client.connect();
        console.log('Redis connection successful!');
    } catch (error) {
        console.error('Unable to connect to Redis:', error);
    }
}

module.exports = { client, connectRedis };
