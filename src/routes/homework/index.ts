import multipart from "@fastify/multipart";
import { FastifyPluginAsync } from "fastify";
import { CreateHomeworkBody } from "../../schemas/homework.schema";
import { createHomework } from "../../controllers/homework/createHomework";

const homework: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.register(multipart, {
        attachFieldsToBody: "keyValues",
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
    fastify.route({
        method: "POST",
        url: "/",
        handler: createHomework,
        preHandler: [fastify.authenticate],
        schema: {
            body: CreateHomeworkBody,
        },
    });
};

export default homework;
