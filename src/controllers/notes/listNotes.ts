import { RouteHandler } from "fastify";

export const listNotes: RouteHandler<{
    Params: {
        moduleId: string;
        classId: string;
    };
}> = async function (request, reply) {
    const { moduleId, classId } = request.params;

    this.log.info(`Getting notes for module ${moduleId} and class ${classId}`);

    const notes = await this.pg.query(
        `
    SELECT
  s.id AS id,
  CONCAT(s.last_name, ' ', s.first_name) AS name,
  n.evaluation,
  n.test,
  n.exam,
  n.updated_at
FROM
  students s
LEFT JOIN
  notes n ON s.id = n.student_id AND n.module_id = $1
WHERE
  s.class_id = $2`,
        [moduleId, classId]
    );

    this.log.info(notes.rows);
    return notes.rows;
};
