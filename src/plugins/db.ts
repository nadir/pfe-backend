import fp from "fastify-plugin";
import postgres, { PostgresPluginOptions } from "@fastify/postgres";

export default fp<PostgresPluginOptions>(async (fastify) => {
    fastify.register(postgres, {
        connectionString: process.env.POSTGRES_URL,
    });
});
