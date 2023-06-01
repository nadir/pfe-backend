import { RouteHandler } from "fastify";

export const listUnconfirmedStudents: RouteHandler = async function (req, res) {
    // join iwth user table to get parent name
    const unverified = await this.pg.query(
        "SELECT s.*, u.first_name AS parent_first_name, u.last_name AS parent_last_name FROM students s INNER JOIN users u ON s.parent_id = u.user_id WHERE s.verified = false ORDER BY s.created_at DESC"
    );

    return res.status(200).send({
        result: unverified.rows,
    });
};
