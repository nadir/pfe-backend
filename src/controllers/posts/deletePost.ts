import { RouteHandler } from "fastify";

export const deletePost: RouteHandler<{
    Params: {
        postId: string;
    };
}> = async function (request, reply) {
    const { userId } = request.user;
    const { postId } = request.params;

    // check if user is author
    let post = await this.pg.query("SELECT * FROM posts WHERE id = $1", [
        postId,
    ]);

    if (post.rows[0].author_id !== userId) {
        return reply.code(403).send({
            statusCode: 403,
            error: "Forbidden",
            message: "You must be the author of the post to delete it",
        });
    }

    // delete post
    try {
        await this.pg.query("DELETE FROM posts WHERE id = $1", [postId]);
        return reply.code(200).send({
            statusCode: 200,
            message: "Post deleted successfully",
        });
    } catch (err) {
        this.log.error(err);
        return reply.code(500).send({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Error deleting post",
        });
    }
};
