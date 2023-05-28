import { RouteHandler } from "fastify";

export const listStudentNotes: RouteHandler<{
    Params: { studentId: string };
}> = async function (request, reply) {
    const { studentId } = request.params;

    const notes = await this.pg.query(
        `SELECT m.name AS module_name, m.icon as module_icon, COALESCE(n.evaluation, 0) AS evaluation, COALESCE(n.test, 0) AS test, COALESCE(n.exam, 0) AS exam
        FROM modules m
        LEFT JOIN notes n ON m.id = n.module_id AND n.student_id = $1
        INNER JOIN students s ON s.id = $1
        WHERE m.level = (
          SELECT level
          FROM classes
          WHERE id = s.class_id
        )
        ORDER BY m.name ASC
        `,
        [studentId]
    );

    let newNotes = [];

    let total = 0;
    for (const note of notes.rows) {
        let evaluation = parseFloat(note.evaluation);
        let test = parseFloat(note.test);
        let exam = parseFloat(note.exam);

        let avg = ((evaluation + test) / 2) * 0.4 + exam * 0.6;
        newNotes.push({
            module_icon: note.module_icon,
            module_name: note.module_name,
            evaluation: evaluation,
            test: test,
            exam: exam,
            average: avg,
        });
        total += avg;
    }
    let average = total / newNotes.length;

    return {
        success: true,
        notes: newNotes,
        average: parseFloat(average.toFixed(2)),
    };
};
