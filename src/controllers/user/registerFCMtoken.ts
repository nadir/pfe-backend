import { RouteHandler } from "fastify";
import { RegisterFCMTokenBody } from "../../schemas/messages.schema";

export const registerFCMtoken: RouteHandler<{
    Body: RegisterFCMTokenBody;
}> = async function (request, reply) {
    const { userId } = request.user;
    const { token } = request.body;

    this.firebaseTokens.set(userId, token);
};
