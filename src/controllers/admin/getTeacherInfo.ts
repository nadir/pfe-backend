import { RouteHandler } from "fastify";

export const getTeacher: RouteHandler<{
    Params: { userId: string };
}> = async function (req, res) {
    const { userId } = req.params;

    // Retrieve the teacher information
    const teacher = await this.pg.query(
        `SELECT user_id, username, first_name, last_name, email, phone_number, user_type
         FROM users
         WHERE user_id = $1`,
        [userId]
    );

    if (teacher.rowCount === 0) {
        return res.status(404).send({
            error: "Teacher not found",
        });
    }

    // Retrieve the classes and modules taught by the teacher
    const classesAndModules = await this.pg.query(
        `SELECT c.class_id as id, cl.name , c.module_id, m.name as module_name, m.level as module_level, m.id as module_id
         FROM modules_teacher AS c
         INNER JOIN modules AS m ON c.module_id = m.id
         INNER JOIN classes AS cl ON c.class_id = cl.id
         WHERE c.teacher_id = $1`,
        [teacher.rows[0].user_id]
    );

    const result = {
        user: teacher.rows[0],
        classes: classesAndModules.rows,
    };

    return res.status(200).send({
        message: "Teacher information retrieved successfully",
        result: result,
    });
};
