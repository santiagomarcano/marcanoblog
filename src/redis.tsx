import redis, { RedisClient } from "redis";
import { promisify } from "util";

const client: RedisClient = redis.createClient();

interface SetParams {
    key: string,
    value: string,
    expire: number,
}

const get = promisify(client.get).bind(client);
const set = async ({ key, value, expire }: SetParams) => {
  const sP = promisify(client.set).bind(client);
  await sP(key, value);
  client.EXPIRE(key, expire);
};

client.on("connect", function () {
  console.info("[+] Connected to Redis");
});

client.on("error", function (error: any) {
  console.error(error);
});

export { get, set };
