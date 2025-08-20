const Redis = require("ioredis");

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

client.on("error", (error) => console.log("Redis Client Error", error));

async function connectRedis() {
  try {
    await client.ping();
    console.log("Redis connection successful!");
  } catch (error) {
    console.error("Unable to connect to Redis:", error);
  }
}

module.exports = { client, connectRedis };
