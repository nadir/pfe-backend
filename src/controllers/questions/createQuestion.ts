import { RouteHandler } from "fastify";

export const createQuestion: RouteHandler<{
    Params: { moduleId: string };
    Body: {
        question: string;
    };
}> = async function (req, res) {
    const { moduleId } = req.params;
    const { userId } = req.user;
    const { question } = req.body;

    const module = await this.pg.query(`SELECT * FROM modules WHERE id = $1`, [
        moduleId,
    ]);

    if (module.rows.length === 0) {
        return res.code(404).send({
            error: "Module not found",
        });
    }

    await this.pg.query(
        `INSERT INTO questions (module_id, question, asked_by ) VALUES ($1, $2, $3)`,
        [moduleId, question, userId]
    );

    return res.code(200).send({
        message: "Question added",
    });
};
