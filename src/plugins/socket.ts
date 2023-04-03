import fp from "fastify-plugin";
import socketioServer from "fastify-socket.io";

export default fp(async (fastify) => {
    fastify.register(socketioServer, {
        path: "/ws/",
    });
});
