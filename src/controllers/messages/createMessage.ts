import { RouteHandler } from "fastify";
import {
    CreateMessageBody,
    CreateMessageParams,
} from "../../schemas/messages.schema";

export const createMessage: RouteHandler<{
    Params: CreateMessageParams;
    Body: CreateMessageBody;
}> = async function (request, reply) {
    const { content } = request.body;
    const { conversation_id } = request.params;
    const { userId } = request.user;

    // check if conversation exists
    const conversation = await this.pg.query(
        "SELECT * FROM conversations WHERE id = $1",
        [conversation_id]
    );

    if (conversation.rowCount === 0) {
        reply.code(404);
        return {
            error: "Conversation not found",
        };
    }

    // check if user is part of conversation
    const isUserInConversation = await this.pg.query(
        "SELECT * FROM conversations WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)",
        [conversation_id, userId]
    );

    if (isUserInConversation.rowCount === 0) {
        reply.code(403);
        return {
            error: "You are not part of this conversation",
        };
    }

    const newMessage = await this.pg.query(
        "INSERT INTO messages (conversation_id, sender_id, recipient_id, message) VALUES ($1, $2, $3, $4) RETURNING *",
        [conversation_id, userId, userId, content]
    );

    return {
        id: newMessage.rows[0].id,
        content: newMessage.rows[0].message,
        sender_id: newMessage.rows[0].sender_id,
        conversation_id: newMessage.rows[0].conversation_id,
        file: newMessage.rows[0].file,
        created_at: newMessage.rows[0].created_at,
    };
    
};
