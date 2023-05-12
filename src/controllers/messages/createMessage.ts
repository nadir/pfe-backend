import { RouteHandler } from "fastify";
import { CreateMessageBody } from "../../schemas/messages.schema";

export const createMessage: RouteHandler<{
    Body: CreateMessageBody;
}> = async function (request, reply) {
    const { content, receiver_id } = request.body;
    const { userId } = request.user;

    if (userId === receiver_id)
        reply.status(400).send({ message: "Cannot message yourself" });

    if (!content)
        reply.status(400).send({ message: "Message content cannot be empty" });

    const newMessage = await this.pg.query(
        `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *`,
        [userId, receiver_id, content]
    );

    const sender = await this.pg.query(
        `SELECT first_name, last_name FROM users WHERE user_id = $1`,
        [userId]
    );

    let socketId;
    let firebaseToken;

    if (process.env.NODE_ENV === "production") {
        // todo broadcast to all sockets
        const sockets = await this.redis.smembers(
            `user:${receiver_id}:sockets`
        );
        socketId = sockets[0];

        firebaseToken = await this.redis.hget(
            `user:${receiver_id}`,
            "firebaseToken"
        );
    } else {
        socketId = this.activeUsers.get(receiver_id);
        firebaseToken = this.firebaseTokens.get(receiver_id);
    }

    if (socketId) {
        this.io.to(socketId).emit("message", newMessage.rows[0]);
    }

    if (firebaseToken) {
        this.firebase.messaging.send({
            notification: {
                title: "New Message",
                body: content,
            },

            token: firebaseToken,
            data: {
                link: `pfeapp://account/chat/${userId}?name=${sender.rows[0].first_name}%20${sender.rows[0].last_name}`,
            },
        });
    }

    return newMessage.rows[0];
};
