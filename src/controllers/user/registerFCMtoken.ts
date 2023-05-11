import { RouteHandler } from "fastify";
import { RegisterFCMTokenBody } from "../../schemas/messages.schema";

export const registerFCMtoken: RouteHandler<{
    Body: RegisterFCMTokenBody;
}> = async function (request, reply) {
    const { userId } = request.user;
    const { token } = request.body;

    if (process.env.NODE_ENV === "production") {
        await this.redis.hset(`user:${userId}`, "firebaseToken", token);
    } else {
        this.firebaseTokens.set(userId, token);
    }

    return { message: "Token registered" };
};
