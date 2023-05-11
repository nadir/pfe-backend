import fp from "fastify-plugin";
import redis, { FastifyRedisPluginOptions } from "@fastify/redis";

export default fp<FastifyRedisPluginOptions>(async (fastify) => {
    fastify.register(redis, {
        url: process.env.REDISCLOUD_URL,
    });
});
