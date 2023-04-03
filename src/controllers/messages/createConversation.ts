import { RouteHandler } from "fastify";

export const createConversation: RouteHandler<{
    Body: { reciever_id: string };
}> = async function (request, reply) {
    const { reciever_id } = request.body;
    const sender_id = request.user;

    const conversation = await this.pg.query(
        "INSERT INTO conversations (sender_id, reciever_id) VALUES ($1, $2) RETURNING *",
        [sender_id, reciever_id]
    );

    return conversation.rows[0];
};
