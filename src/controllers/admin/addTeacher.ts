import { RouteHandler } from "fastify";
import { AddTeacherBody } from "../../schemas/admin.schema";
import argon2 from "argon2";

export const addTeacher: RouteHandler<{
    Body: AddTeacherBody;
}> = async function (req, res) {
    const {
        username,
        password,
        first_name,
        last_name,
        email,
        phone_number,
        classes,
    } = req.body;
    this.log.info(classes);
    // check if username or email or phone number exists
    const details = await this.pg.query(
        `SELECT * FROM users WHERE username = $1 OR email = $2 OR phone_number = $3`,
        [username, email, phone_number]
    );

    if (details.rowCount > 0) {
        return res.status(400).send({
            error: "Username or email or phone number already exists",
        });
    }

    const hashedPassword = await argon2.hash(password);

    // create user
    const user = await this.pg.query(
        `INSERT INTO users (username, password, first_name, last_name, email, phone_number, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
            username,
            hashedPassword,
            first_name,
            last_name,
            email,
            phone_number,
            "teacher",
        ]
    );

    for (const c of classes) {
        await this.pg.query(
            `INSERT INTO modules_teacher (teacher_id, class_id, module_id) VALUES ($1, $2, $3)`,
            [user.rows[0].user_id, c.class_id, c.module_id]
        );
    }

    return res.status(200).send({
        message: "Teacher added successfully",
        result: user.rows[0],
    });
};
