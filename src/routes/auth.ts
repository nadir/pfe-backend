import { FastifyPluginAsync } from "fastify";
import authController from "../controllers/auth.controller";
import { LoginBody, SignupBody } from "../schemas/auth.schema";
import multipart from "@fastify/multipart";
import { v4 as uuidv4 } from "uuid";

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.register(multipart, {
        attachFieldsToBody: "keyValues",
        limits: {
            // 50MB
            fileSize: 50 * 1024 * 1024,
        },
        async onFile(part) {
            const buff = await part.toBuffer();
            const data = buff.toString("base64");
            // @ts-ignore
            part.value = {
                data,
                filename: part.filename,
                mimetype: part.mimetype,
            }; // set `part.value` to specify the request body value
        },
    });

    fastify.decorateRequest("userId", "");

    fastify.route({
        method: "POST",
        url: "/auth/login",
        handler: authController.login,
        schema: { body: LoginBody },
    });

    fastify.route({
        method: "POST",
        url: "/auth/signup",
        handler: authController.signup,
        schema: { body: SignupBody },
        onRequest: (request, reply, done) => {
            const userId = uuidv4();
            request.userId = userId;
            done();
        },
    });
};

export default auth;

declare module "fastify" {
    interface FastifyRequest {
        userId: string;
    }
}
