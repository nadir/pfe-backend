import fp from "fastify-plugin";
import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.send(err);
    }
}

export default fp<FastifyJWTOptions>(async (fastify) => {
    fastify.register(fastifyJwt, { secret: String(process.env.JWT_SECRET) });
    fastify.decorate("authenticate", authenticate);
});

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: { userId: string };
        user: {
            userId: string;
        };
    }
}
declare module "fastify" {
    export interface FastifyInstance {
        authenticate: typeof authenticate;
    }
}
