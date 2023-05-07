import fp from "fastify-plugin";
import { BiMap } from "mnemonist";

export interface SupportPluginOptions {
    // Specify Support plugin options here
}

const activeUsers: BiMap<String, String> = new BiMap();
const firebaseTokens: Map<String, String> = new Map();

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
    fastify.decorate("activeUsers", activeUsers);
    fastify.decorate("firebaseTokens", firebaseTokens);
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
    export interface FastifyInstance {
        activeUsers: BiMap<string, string>;
        firebaseTokens: Map<string, string>;
    }
}
