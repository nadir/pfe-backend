import { RouteHandler } from "fastify";
import { UpdateNotesBody } from "../../schemas/notes.schema";

export const updateNotes: RouteHandler<{
    Params: {
        moduleId: string;
        classId: string;
    };
    Body: UpdateNotesBody;
}> = async function (request, reply) {
    const { moduleId, classId } = request.params;
    const { notes } = request.body;

    for (const note of notes) {
        const { id, evaluation, test, exam } = note;

        this.log.info(
            `Updating notes for student ${id} in module ${moduleId} and class ${classId}`
        );

        await this.pg.query(
            `
            INSERT INTO notes (student_id, module_id, evaluation, test, exam)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (student_id, module_id)
            DO UPDATE SET evaluation = excluded.evaluation, test = excluded.test, exam = excluded.exam, updated_at = excluded.updated_at`,
            [id, moduleId, evaluation, test, exam]
        );

        this.log.info(`Notes for student ${id} updated`);
    }

    return { message: "Notes updated" };
};
