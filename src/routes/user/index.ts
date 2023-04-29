import { FastifyPluginAsync } from "fastify";
import { checkDetails } from "../../controllers/user/check.controller";

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
};

export default example;
