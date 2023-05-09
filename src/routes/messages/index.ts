import { FastifyPluginAsync } from "fastify";
import {
    CreateMessageBody,
    ListMessagesParams,
} from "../../schemas/messages.schema";

import { createMessage } from "../../controllers/messages/createMessage";
import { getMessages } from "../../controllers/messages/getMessages";
import { listConversations } from "../../controllers/messages/listConversations";
import { listContacts } from "../../controllers/messages/listContacts";

const message: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Please provide a token"));
        }
        try {
            const decoded = fastify.jwt.verify<{ userId: string }>(token);
            fastify.activeUsers.set(decoded.userId, socket.id);
        } catch (error) {
            return next(new Error("Invalid token"));
        }
        return next();
    });
    fastify.io.on("connection", (socket) => {
        socket.on("message", (message) => {
            console.log([...fastify.activeUsers.entries()]);
        });
        socket.on("disconnect", () => {
            fastify.activeUsers.inverse.delete(socket.id);
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
};

export default message;
