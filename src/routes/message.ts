import { FastifyPluginAsync } from "fastify";

const message: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // socketio middelware to check if use is authenticated and save user_id from jwt
    fastify.io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Please provide a token"));
        }

        try {
            const decoded = fastify.jwt.verify<{ userId: string }>(token);
            fastify.activeUsers.set(socket.id, decoded.userId);
        } catch (error) {
            return next(new Error("Invalid token"));
        }
        return next();
    });

    fastify.io.on("connection", (socket) => {
        socket.on("message", (message) => {
            console.log([...fastify.activeUsers.entries()]);
            socket.emit("message", "I got a message");
        });
        socket.on("disconnect", () => {
            fastify.activeUsers.delete(socket.id);
        });
    });
};

export default message;
