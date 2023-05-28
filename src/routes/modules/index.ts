import { FastifyPluginAsync } from "fastify";
import { listModules } from "../../controllers/modules/listModules";

const modules: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.route({
        method: "GET",
        url: "/",
        handler: listModules,
        preHandler: [fastify.authenticate],
    });
};

export default modules;
