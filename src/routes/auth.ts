import { FastifyPluginAsync, FastifyRequest } from "fastify";
import authController from "../controllers/auth.controller";
import { LoginBody, SignupBody } from "../schemas/auth.schema";
import multipart from "@fastify/multipart";
import { promisify } from "util";
import { pipeline } from "stream";
import { v4 as uuidv4 } from "uuid";

const pump = promisify(pipeline);

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.register(multipart, {
        attachFieldsToBody: "keyValues",
        limits: {
            files: 1,
        },
        onFile: async function onFile(this: FastifyRequest, part) {
            const userId = this.userId;
            const filename = `/users/${userId}/${part.filename}`;
            const fileWriteSream = fastify.firebase.bucket
                .file(filename)
                .createWriteStream();
            await pump(part.file, fileWriteSream);

            //@ts-ignore
            part.value = filename;
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
