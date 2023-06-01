import { RouteHandler } from "fastify";

export const answerQuestion: RouteHandler<{
    Params: { questionId: string };
    Body: {
        answer: string;
    };
}> = async function (req, res) {
    const { questionId } = req.params;
    const { userId } = req.user;
    const { answer } = req.body;

    const question = await this.pg.query(
        `SELECT * FROM questions WHERE id = $1`,
        [questionId]
    );

    if (question.rows.length === 0) {
        return res.code(404).send({
            error: "Question not found",
        });
    }

    const { module_id } = question.rows[0];

    const moduleTeacher = await this.pg.query(
        `SELECT * FROM modules_teacher WHERE module_id = $1 AND teacher_id = $2`,
        [module_id, userId]
    );

    if (moduleTeacher.rows.length === 0) {
        return res.code(403).send({
            error: "You are not allowed to answer this question",
        });
    }

    // update question
    await this.pg.query(
        `UPDATE questions SET answer = $1, answered_by = $2, answered_at = $3 WHERE id = $4`,
        [answer, userId, new Date(), questionId]
    );

    return res.code(200).send({
        message: "Question answered",
    });
};
