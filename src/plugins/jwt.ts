import fp from "fastify-plugin";
import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";

export default fp<FastifyJWTOptions>(async (fastify) => {
    fastify.register(fastifyJwt, { secret: String(process.env.JWT_SECRET) });
});
