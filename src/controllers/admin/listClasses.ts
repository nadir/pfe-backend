import { RouteHandler } from "fastify";
import { QueryResult } from "pg";

export const listClasses: RouteHandler<{
    Querystring: {
        distinct: boolean;
    };
}> = async function (req, res) {
    const { distinct } = req.query;

    if (distinct) {
        // only return classes

        const classes = await this.pg.query(`SELECT * FROM classes`);

        return res.status(200).send({
            statusCode: 200,
            results: classes.rows,
        });
    }

    const classesAndModules: QueryResult = await this.pg.query(`
    SELECT c.*, m.id AS module_id, m.name AS module_name, m.level AS module_level
    FROM classes c
    JOIN modules m ON c.level = m.level
  `);

    return res.status(200).send({
        statusCode: 200,
        results: classesAndModules.rows,
    });
};
