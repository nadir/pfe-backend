import { FastifyPluginAsync } from "fastify";
import { listModules } from "../../controllers/modules/listModules";
import { addResource } from "../../controllers/modules/addResource";
import multipart from "@fastify/multipart";
import { listResources } from "../../controllers/modules/listResources";
import { deleteResource } from "../../controllers/modules/deleteResource";
import { listHomeworks } from "../../controllers/homework/listHomeworks";
import { deleteHomework } from "../../controllers/homework/deleteHomework";
import { createQuestion } from "../../controllers/questions/createQuestion";
import { answerQuestion } from "../../controllers/questions/answerQuestion";
import { listQuestions } from "../../controllers/questions/listQuestions";

const modules: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.register(multipart, {
        limits: {
            files: 1,

            // 20MB
            fileSize: 20 * 1024 * 1024,
        },
        attachFieldsToBody: "keyValues",
        async onFile(part) {
            const buff = await part.toBuffer();
            const data = buff.toString("base64");
            // @ts-ignore
            part.value = {
                data,
                filename: part.filename,
                mimetype: part.mimetype,
            };
        },
    });
    fastify.route({
        method: "GET",
        url: "/:classId?",
        handler: listModules,
        preHandler: [fastify.authenticate],
    });

    fastify.route({
        method: "POST",
        url: "/:moduleId/resource",
        handler: addResource,
        preHandler: [fastify.authenticate],
    });

    fastify.route({
        method: "GET",
        url: "/:moduleId/resources",
        handler: listResources,
        preHandler: [fastify.authenticate],
    });

    fastify.route({
        method: "DELETE",
        url: "/resources/:resourceId",
        handler: deleteResource,
        preHandler: [fastify.authenticate],
    });

    fastify.route({
        method: "GET",
        url: "/:moduleId/:classId/homeworks",
        handler: listHomeworks,
        preHandler: [fastify.authenticate],
    });

    fastify.route({
        method: "DELETE",
        url: "/homeworks/:homeworkId",
        handler: deleteHomework,
        preHandler: [fastify.authenticate],
    });

    fastify.route({
        method: "POST",
        url: "/:moduleId/question",
        handler: createQuestion,
        preHandler: [fastify.authenticate],
        schema: {
            body: {
                type: "object",
                required: ["question"],
                properties: {
                    question: {
                        type: "string",
                    },
                },
            },
        },
    });

    fastify.route({
        method: "POST",
        url: "/questions/:questionId/answer",
        handler: answerQuestion,
        preHandler: [fastify.authenticate],
        schema: {
            body: {
                type: "object",
                required: ["answer"],
                properties: {
                    answer: {
                        type: "string",
                    },
                },
            },
        },
    });

    fastify.route({
        method: "GET",
        url: "/:moduleId/questions",
        handler: listQuestions,
        preHandler: [fastify.authenticate],
    });
};

export default modules;
