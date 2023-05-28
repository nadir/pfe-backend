import { RouteHandler } from "fastify";

export const listModules: RouteHandler = async function (request, reply) {
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
        return reply.code(403).send({
            statusCode: 403,
            error: "Forbidden",
            message: "You must be a teacher to list modules",
        });
    }
};
