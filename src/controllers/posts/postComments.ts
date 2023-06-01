import { RouteHandler } from "fastify";

export const getPostComments: RouteHandler<{
    Params: { postId: string };
}> = async function (req, res) {
    const { postId } = req.params;

    // join it with comments
    const comments = await this.pg.query(
        `
        SELECT post_comments.*, users.first_name, users.last_name, users.profile_pic
        FROM post_comments
        LEFT JOIN users ON post_comments.user_id = users.user_id
        WHERE post_comments.post_id = $1
        ORDER BY created_at DESC
        `,
        [postId]
    );

    return comments.rows;
};
