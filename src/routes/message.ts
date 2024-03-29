// import { FastifyPluginAsync } from "fastify";
// import { getMessages } from "../controllers/messages/getMessages";

// const message: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
//     // socketio middelware to check if use is authenticated and save user_id from jwt
//     fastify.io.use((socket, next) => {
//         const token = socket.handshake.auth.token;

//         if (!token) {
//             return next(new Error("Please provide a token"));
//         }

//         try {
//             const decoded = fastify.jwt.verify<{ userId: string }>(token);
//             fastify.activeUsers.set(decoded.userId, socket.id);
//         } catch (error) {
//             return next(new Error("Invalid token"));
//         }
//         return next();
//     });

//     fastify.io.on("connection", (socket) => {
//         socket.on("message", (message) => {
//             console.log([...fastify.activeUsers.entries()]);
//         });
//         socket.on("disconnect", () => {
//             fastify.activeUsers.inverse.delete(socket.id);
//         });
//     });

//     fastify.route({
//         method: "GET",
//         url: "/messaging/conversations",
//         handler: getConversations,
//         onRequest: [fastify.authenticate],
//     });

//     fastify.route({
//         method: "GET",
//         url: "/messaging/conversations/:conversationId",
//         handler: getMessages,
//         onRequest: [fastify.authenticate],
//         schema: {
//             params: { conversationId: { type: "string" } },
//         },
//     });
// };

// export default message;
