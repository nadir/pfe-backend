import { FastifyPluginAsync } from "fastify";
import { checkDetails } from "../../controllers/user/check.controller";
import { getUserInfo } from "../../controllers/user/getUserInfo";
import { RegisterFCMTokenBody } from "../../schemas/messages.schema";
import { registerFCMtoken } from "../../controllers/user/registerFCMtoken";

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.route({
        method: "GET",
        url: "/check",
        handler: checkDetails,
        schema: {
            querystring: {
                type: "object",
                properties: {
                    username: { type: "string" },
                    email: { type: "string", format: "email" },
                    phone_number: { type: "string" },
                },
                anyOf: [
                    { required: ["username"] },
                    { required: ["email"] },
                    { required: ["phone_number"] },
                ],
            },
        },
    });

    fastify.route({
        method: "GET",
        url: "/me",
        handler: getUserInfo,
        preHandler: [fastify.authenticate],
    });

    fastify.route({
        method: "POST",
        url: "/firebase/token",
        handler: registerFCMtoken,
        preHandler: [fastify.authenticate],
        schema: {
            body: RegisterFCMTokenBody,
        },
    });
};

export default example;
