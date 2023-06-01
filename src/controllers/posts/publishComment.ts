import { RouteHandler } from "fastify";

export const publishComment: RouteHandler<{
    Params: { postId: string };
    Body: { content: string };
}> = async function (req, res) {
    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    const comment = await this.pg.query(
        `
        INSERT INTO post_comments (post_id, user_id, content)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [postId, userId, content]
    );

    return comment.rows[0];
};
