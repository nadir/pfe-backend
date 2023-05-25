import { RouteHandler } from "fastify";
import { VotePollBody, VotePollQueryParams } from "../../schemas/posts.schema";

export const votePoll: RouteHandler<{
    Params: VotePollQueryParams;
    Body: VotePollBody;
}> = async function (request, reply) {
    await this.pg.query(
        "INSERT INTO poll_votes (user_id, poll_id, poll_option_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;",
        [request.user.userId, request.params.pollId, request.body.optionId]
    );

    return reply.code(200).send({
        statusCode: 200,
        message: "Voted",
    });
};
