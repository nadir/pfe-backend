import { RouteHandler } from "fastify";

export const deleteHomework: RouteHandler<{
    Params: { homeworkId: string };
}> = async function (req, res) {
    const { homeworkId } = req.params;

    const homework = await this.pg.query(
        `SELECT * FROM homeworks WHERE id = $1`,
        [homeworkId]
    );

    if (homework.rows.length === 0) {
        return res.code(404).send({
            error: "Homework not found",
        });
    }

    await this.pg.query(`DELETE FROM homeworks WHERE id = $1`, [homeworkId]);

    return res.code(200).send({
        message: "Homework deleted",
    });
};
