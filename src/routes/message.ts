import { FastifyPluginAsync } from "fastify";

const message: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // socketio middelware to check if use is authenticated and save user_id from jwt
    fastify.io.use((socket, next) => {
        console.log("middleware test");
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
    });

    fastify.io.of("/message").on("connection", (socket) => {
        socket.on("message", (message) => {
            console.log(message);

            socket.emit("message", "test");
        });
    });
};

export default message;
