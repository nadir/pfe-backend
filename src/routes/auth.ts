import { FastifyPluginAsync } from "fastify";
import authController from "../controllers/auth.controller";
import { LoginBody, SignupBody } from "../schemas/auth.schema";

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.route({
    method: "POST",
    url: "/auth/login",
    handler: authController.login,
    schema: { body: LoginBody },
  });

  fastify.route({
    method: "POST",
    url: "/auth/signup",
    handler: authController.signup,
    schema: { body: SignupBody },
  });
};

export default auth;
