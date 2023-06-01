import { FastifyPluginAsync } from "fastify";
import { listStudents } from "../controllers/students/listStudents";
import { AddStudentBody, addStudent } from "../controllers/students/addStudent";
import multipart from "@fastify/multipart";

const modules: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
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
    fastify.route({
        method: "GET",
        url: "/students",
        handler: listStudents,
        preHandler: [fastify.authenticate],
    });

    fastify.route({
        method: "POST",
        url: "/students",
        handler: addStudent,
        preHandler: [fastify.authenticate],
        schema: {
            body: AddStudentBody,
        },
    });
};

export default modules;
