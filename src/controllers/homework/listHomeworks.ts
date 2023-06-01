import { RouteHandler } from "fastify";

export const listHomeworks: RouteHandler<{
    Params: { moduleId: string; classId: string };
}> = async function (req, res) {
    const { moduleId, classId } = req.params;

    const homeworks = await this.pg.query(
        `SELECT * FROM homeworks WHERE module_id = $1 AND class_id = $2`,
        [moduleId, classId]
    );

    return res.code(200).send({
        results: homeworks.rows,
    });
};
