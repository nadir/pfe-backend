import { FastifyPluginAsync } from "fastify";
import { listNotes } from "../controllers/notes/listNotes";
import { updateNotes } from "../controllers/notes/updateNotes";
import { UpdateNotesBody } from "../schemas/notes.schema";
import { listStudentNotes } from "../controllers/notes/listStudentNotes";

const modules: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.route({
        method: "GET",
        url: "/notes/:moduleId/:classId",
        handler: listNotes,
        preHandler: [fastify.authenticate],
    });

    fastify.route({
        method: "PUT",
        url: "/notes/:moduleId/:classId",
        handler: updateNotes,
        preHandler: [fastify.authenticate],
        schema: {
            body: UpdateNotesBody,
        },
    });

    fastify.route({
        method: "GET",
        url: "/student/:studentId/notes",
        handler: listStudentNotes,
        preHandler: [fastify.authenticate],
    });
};

export default modules;
