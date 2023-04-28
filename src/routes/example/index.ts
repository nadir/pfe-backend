import { FastifyPluginAsync } from "fastify";

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.register(import("@fastify/multipart"), {
        limits: {
            files: 1,
        },
    });

    fastify.get("/", async function (request, reply) {
        return "this is example";
    });
    fastify.post("/test", async function (request, reply) {
        const data = await request.file();
        return data?.fields;
    });
};

export default example;
