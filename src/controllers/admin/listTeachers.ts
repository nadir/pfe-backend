import { RouteHandler } from "fastify";

export const listTeachers: RouteHandler = async function (req, res) {
    const teachers = await this.pg.query(
        `SELECT user_id, username, first_name, last_name, email, phone_number, created_at, updated_at
            FROM users
            WHERE user_type = 'teacher'
            ORDER BY created_at DESC`
    );

    return res.status(200).send({
        result: teachers.rows,
    });
};
