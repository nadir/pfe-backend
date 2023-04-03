import fp from "fastify-plugin";

export interface SupportPluginOptions {
    // Specify Support plugin options here
}

const activeUsers: Map<String, String> = new Map();

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
    fastify.decorate("activeUsers", activeUsers);
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
    export interface FastifyInstance {
        activeUsers: Map<String, String>;
    }
}
