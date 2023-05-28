import { FastifyPluginAsync } from "fastify";
import { listStudents } from "../controllers/students/listStudents";

const modules: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.route({
        method: "GET",
        url: "/students",
        handler: listStudents,
        preHandler: [fastify.authenticate],
    });
};

export default modules;
