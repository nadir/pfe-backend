import { RouteHandler } from "fastify";
import { Message } from "../../models/Message";
import {
    ListMessageQuerystring,
    ListMessagesParams,
} from "../../schemas/messages.schema";
import { validate } from "uuid";

export const getMessages: RouteHandler<{
    Params: ListMessagesParams;
    Querystring: ListMessageQuerystring;
}> = async function (request, reply) {
    // list all messages between two users
    const { userId } = request.user;
    const { userId: recieverId } = request.params;
    const { page } = request.query;

    const validUserId = validate(recieverId);
    if (!validUserId) reply.status(400).send({ message: "Invalid recieverId" });

    // if (userId === recieverId)
    //     reply.status(400).send({ message: "Cannot message yourself" });

    const limit = 20;
    const offset = page ? page * limit : 0;

    const messages = await this.pg.query<Message>({
        text: `SELECT * from messages WHERE sender_id = $1 AND receiver_id = $2 OR sender_id = $2 AND receiver_id = $1 ORDER BY created_at DESC LIMIT $3 OFFSET $4;`,
        values: [userId, recieverId, limit, offset],
    });

    return messages.rows;
};
