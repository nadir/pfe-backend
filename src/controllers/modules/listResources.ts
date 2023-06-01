import { RouteHandler } from "fastify";

export const listResources: RouteHandler<{
    Params: { moduleId: string };
}> = async function (req, res) {
    // check if module exists

    const module = await this.pg.query(`SELECT * FROM modules WHERE id = $1`, [
        req.params.moduleId,
    ]);

    if (module.rows.length === 0) {
        return res.code(404).send({
            error: "Module not found",
        });
    }

    const resources = await this.pg.query(
        `SELECT * FROM module_resources WHERE module_id = $1`,
        [req.params.moduleId]
    );

    return res.code(200).send({
        results: resources.rows,
    });
};
