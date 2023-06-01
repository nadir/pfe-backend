import { RouteHandler } from "fastify";

export const deleteTeacher: RouteHandler<{
    Params: {
        teacher_id: string;
    };
}> = async function (req, res) {
    const { teacher_id } = req.params;

    // check if teacher exists
    const teacher = await this.pg.query(
        `SELECT * FROM users WHERE user_id = $1 AND user_type = 'teacher'`,
        [teacher_id]
    );

    if (teacher.rowCount === 0) {
        return res.status(404).send({
            error: "Teacher not found",
        });
    }

    // delete teacher
    await this.pg.query(`DELETE FROM users WHERE user_id = $1`, [teacher_id]);

    return res.status(200).send({
        message: "Teacher deleted successfully",
    });
};
