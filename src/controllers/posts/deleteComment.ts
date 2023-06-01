import { RouteHandler } from "fastify";

export const deleteComment: RouteHandler<{ Params: { commentId: string } }> =
    async function (req, res) {
        const { commentId } = req.params;
        const { userId } = req.user;

        const comment = await this.pg.query(
            `SELECT * FROM post_comments WHERE id = $1`,
            [commentId]
        );

        if (comment.rows.length === 0) {
            return res.code(404).send({
                error: "Comment not found",
            });
        }

        if (comment.rows[0].user_id !== userId) {
            return res.code(403).send({
                error: "You are not allowed to delete this comment",
            });
        }

        await this.pg.query(`DELETE FROM post_comments WHERE id = $1`, [
            commentId,
        ]);

        return res.code(200).send({
            message: "Comment deleted",
        });
    };
