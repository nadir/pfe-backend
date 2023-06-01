import { RouteHandler } from "fastify";

export const listModules: RouteHandler<{
    Params: { classId?: string };
}> = async function (request, reply) {
    const { userId } = request.user;

    // get user
    let user = await this.pg.query("SELECT * FROM users WHERE user_id = $1", [
        userId,
    ]);

    const userType = user.rows[0].user_type;

    if (userType === "teacher") {
        // and join with module table to get module name
        const modules = await this.pg.query(
            "SELECT m.*, c.name as class_name, c.id as class_id FROM modules AS m JOIN modules_teacher AS mt ON m.id = mt.module_id JOIN classes AS c ON mt.class_id = c.id WHERE mt.teacher_id = $1",
            [userId]
        );

        return reply.code(200).send({
            statusCode: 200,
            results: modules.rows,
        });
    } else {
        if (!request.params.classId) {
            return reply.code(400).send({
                statusCode: 400,
                error: "Missing classId",
            });
        }

        const modules = await this.pg.query(
            `
            SELECT * FROM modules WHERE level = (SELECT level from classes WHERE id = $1)`,
            [request.params.classId]
        );

        return reply.code(200).send({
            statusCode: 200,
            results: modules.rows,
        });
    }
};
