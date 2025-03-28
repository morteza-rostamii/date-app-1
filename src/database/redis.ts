import { REDIS_URI } from "@/configs/config";
import { createClient } from "redis";

const redisClient = createClient({
  url: REDIS_URI,
});

redisClient.on("error", (err: any) => console.log("Redis Client Error", err));

redisClient.on("connect", () => console.log(`redis connected!`));

export default redisClient;
