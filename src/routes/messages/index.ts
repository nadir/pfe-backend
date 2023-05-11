import { FastifyPluginAsync } from "fastify";
import {
    CreateMessageBody,
    DeleteMessageParams,
    ListMessagesParams,
} from "../../schemas/messages.schema";

import { createMessage } from "../../controllers/messages/createMessage";
import { getMessages } from "../../controllers/messages/getMessages";
import { listConversations } from "../../controllers/messages/listConversations";
import { listContacts } from "../../controllers/messages/listContacts";
import { deleteMessageById } from "../../controllers/messages/deleteMessageById";

const message: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Please provide a token"));
        }
        try {
            const decoded = fastify.jwt.verify<{ userId: string }>(token);

            if (process.env.NODE_ENV === "production") {
                fastify.redis.hset("user_sockets", socket.id, decoded.userId);
                fastify.redis.sadd(`user:${decoded.userId}:sockets`, socket.id);
            } else {
                fastify.activeUsers.set(decoded.userId, socket.id);
            }
        } catch (error) {
            return next(new Error("Invalid token"));
        }
        return next();
    });
    fastify.io.on("connection", (socket) => {
        socket.on("message", (message) => {
            console.log([...fastify.activeUsers.entries()]);
        });
        socket.on("disconnect", async () => {
            if (process.env.NODE_ENV === "production") {
                const userId = await fastify.redis.hget(
                    "user_sockets",
                    socket.id
                );
                if (!userId) return;
                fastify.redis.hdel("user_sockets", socket.id);
                fastify.redis.srem(`user:${userId}:sockets`, socket.id);
            } else {
                fastify.activeUsers.inverse.delete(socket.id);
            }
        });
    });

    fastify.route({
        method: "POST",
        url: "/",
        handler: createMessage,
        schema: {
            body: CreateMessageBody,
        },
        preHandler: [fastify.authenticate],
    });
    fastify.route({
        method: "GET",
        url: "/user/:userId",
        schema: {
            params: ListMessagesParams,
        },
        handler: getMessages,

        preHandler: [fastify.authenticate],
    });

    fastify.route({
        method: "GET",
        url: "/conversations",
        handler: listConversations,
        preHandler: [fastify.authenticate],
    });

    fastify.route({
        method: "GET",
        url: "/contacts",
        handler: listContacts,
        preHandler: [fastify.authenticate],
    });

    fastify.route({
        method: "DELETE",
        url: "/:messageId",
        preHandler: [fastify.authenticate],
        schema: {
            params: DeleteMessageParams,
        },
        handler: deleteMessageById,
    });
};

export default message;
