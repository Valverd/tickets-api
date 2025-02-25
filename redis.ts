import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: 6379,
    db: 1
});

redis.on("connect", () => console.log("connected to Redis!"))
redis.on("error", (error) => console.log("error on Redis: ", error))



export default redis