import { RouteHandler } from "fastify";
import { Conversation } from "../../models/Conversation";

export const getConversations: RouteHandler = async function (request, reply) {
    const { userId } = request.user;

    // get conversations list and join with users table to get first name and last name of other user
    const conversations = await this.pg.query<
        {
            sender_id: string;
            first_name: string;
            last_name: string;
        } & Conversation
    >(
        "SELECT conversations.*, users.user_id AS sender_id, users.first_name, users.last_name FROM conversations JOIN users ON users.user_id = CASE WHEN conversations.user1_id = $1 THEN conversations.user2_id ELSE conversations.user1_id END WHERE conversations.user1_id = $1 OR conversations.user2_id = $1 ORDER BY conversations.created_at DESC",
        [userId]
    );

    let response = conversations.rows.map((conversation) => {
        return {
            conversation_id: conversation.id,
            last_message: conversation.last_message,
            contact: {
                id: conversation.sender_id,
                first_name: conversation.first_name,
                last_name: conversation.last_name,
            },
        };
    });
    return response;
};
