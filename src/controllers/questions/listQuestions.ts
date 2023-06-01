import { RouteHandler } from "fastify";

export const listQuestions: RouteHandler<{
    Params: { moduleId: string };
}> = async function (req, res) {
    const questions = await this.pg.query(
        `SELECT
        q.id AS question_id,
        q.question,
        q.answer,
        q.answered_at,
        q.created_at,
        q.module_id,
        CONCAT(u1.first_name, ' ', u1.last_name) AS asked_by_full_name,
        CONCAT(u2.first_name, ' ', u2.last_name) AS answered_by_full_name
      FROM
        public.questions q
        JOIN public.users u1 ON q.asked_by = u1.user_id
        LEFT JOIN public.users u2 ON q.answered_by = u2.user_id
      WHERE
        q.module_id = $1
        ORDER BY q.created_at DESC`,
        [req.params.moduleId]
    );

    return res.code(200).send({
        results: questions.rows,
    });
};
