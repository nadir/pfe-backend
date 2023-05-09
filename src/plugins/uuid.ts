// import { v4 as uuidv4 } from "uuid";

// import fp from "fastify-plugin";

// export default fp(async (fastify) => {
//     fastify.decorate("uuid", "");

//     fastify.addHook("onRequest", (request, reply, done) => {
//         const uuid = uuidv4();
//         request.userId = uuid;
//         done();
//     });
// });

// declare module "fastify" {
//     interface FastifyRequest {
//         userId: string;
//     }
// }
