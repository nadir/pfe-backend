import { RouteHandler } from "fastify";

export const createMessage: RouteHandler<{
    Params: { conversation_id: string };
    Body: { message: string };
}> = async function (request, reply) {
    const { message } = request.body;
    const { conversation_id } = request.params;
    const userId = request.user;

    const newMessage = await this.pg.query(
        "INSERT INTO messages (conversation_id, sender_id, recipient_id, message) VALUES ($1, $2, $3, $4) RETURNING *",
        [conversation_id, userId, userId, message]
    );

    return newMessage.rows[0];
};
