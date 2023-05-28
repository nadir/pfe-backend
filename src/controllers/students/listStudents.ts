import { RouteHandler } from "fastify";

export const listStudents: RouteHandler = async function (request, reply) {
    const { userId } = request.user;

    const students = await this.pg.query(
        "SELECT * FROM students WHERE parent_id = $1",
        [userId]
    );

    if (students.rowCount === 0) {
        reply.code(404);
        return {
            success: false,
            error: "No students found",
        };
    }

    return {
        success: true,
        data: students.rows,
    };
};
