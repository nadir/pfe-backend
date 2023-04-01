import fp from "fastify-plugin";
import postgres, { PostgresPluginOptions } from "@fastify/postgres";

export default fp<PostgresPluginOptions>(async (fastify) => {
  fastify.register(postgres, {
    connectionString: "postgres://postgres:1234@localhost:5432/pfe",
  });
});
