import { RouteHandler } from "fastify";
import { LikePostQueryParams } from "../../schemas/posts.schema";

export const likePost: RouteHandler<{
    Params: LikePostQueryParams;
}> = async function (request, reply) {
    // if user has already liked post, unlike it
    let likedPost = await this.pg.query(
        "SELECT * FROM post_likes WHERE user_id = $1 AND post_id = $2",
        [request.user.userId, request.params.postId]
    );

    if (likedPost.rows.length !== 0) {
        await this.pg.query("DELETE FROM post_likes WHERE id = $1", [
            likedPost.rows[0].id,
        ]);

        return reply.code(200).send({
            statusCode: 200,
            message: "Post unliked",
        });
    }

    // if user has not liked post, like it
    await this.pg.query(
        "INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)",
        [request.user.userId, request.params.postId]
    );

    return reply.code(200).send({
        statusCode: 200,
        message: "Post liked",
    });
};
