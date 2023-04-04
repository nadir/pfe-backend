import { RouteHandler } from "fastify";
import { Message } from "../../models/Message";

export const getMessages: RouteHandler<{ Params: { conversationId: string } }> =
    async function (request, reply) {
        const { conversationId } = request.params;

        // get messages list and join with users table to get first name and last name of sender
        const messages = await this.pg.query<
            {
                author_id: string;
                first_name: string;
                last_name: string;
            } & Message
        >(
            "SELECT messages.*, users.user_id AS author_id, users.first_name, users.last_name FROM messages JOIN users ON users.user_id = messages.sender_id WHERE messages.conversation_id = $1 ORDER BY messages.created_at ASC",
            [conversationId]
        );

        let response = messages.rows.map((message) => {
            return {
                id: message.id,
                content: message.content,
                author: {
                    id: message.author_id,
                    first_name: message.first_name,
                    last_name: message.last_name,
                },
                created_at: message.created_at,
            };
        });
        return response;
    };
