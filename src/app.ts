import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync, FastifyServerOptions } from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

// export type AppOptions = {
//   // Place your custom options for app below here.
// } & Partial<AutoloadPluginOptions>;

export interface AppOptions
    extends FastifyServerOptions,
        Partial<AutoloadPluginOptions> {}

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
    ajv: { customOptions: { allErrors: true } },
};

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
    // Place here your custom code!
    void fastify.withTypeProvider<TypeBoxTypeProvider>();

    // Do not touch the following lines

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application
    void fastify.register(AutoLoad, {
        dir: join(__dirname, "plugins"),
        options: opts,
    });

    // This loads all plugins defined in routes
    // define your routes in one of these
    void fastify.register(AutoLoad, {
        dir: join(__dirname, "routes"),
        options: opts,
    });
};

export default app;
export { app, options };
