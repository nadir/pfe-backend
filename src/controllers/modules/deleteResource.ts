import { RouteHandler } from "fastify";

export const deleteResource: RouteHandler<{
    Params: { resourceId: string };
}> = async function (req, res) {
    // delete if it exists
    const resource = await this.pg.query(
        `SELECT * FROM module_resources WHERE id = $1`,
        [req.params.resourceId]
    );

    if (resource.rows.length === 0) {
        return res.code(404).send({
            error: "Resource not found",
        });
    }

    await this.pg.query(`DELETE FROM module_resources WHERE id = $1`, [
        req.params.resourceId,
    ]);

    return res.code(200).send({
        message: "Resource deleted",
    });
};
