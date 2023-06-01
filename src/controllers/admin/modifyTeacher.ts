import { RouteHandler } from "fastify";
import { EditTeacherBody } from "../../schemas/admin.schema";
import argon2 from "argon2";

export const editTeacher: RouteHandler<{
    Body: EditTeacherBody;
    Params: { userId: string };
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
    const { userId } = req.params;

    // Check if the teacher exists
    const existingTeacher = await this.pg.query(
        `SELECT * FROM users WHERE user_id = $1`,
        [userId]
    );

    if (existingTeacher.rowCount === 0) {
        return res.status(404).send({
            success: false,
            message: "Teacher not found",
        });
    }

    // Check if the username or email or phone number already exists

    const existingUsername = await this.pg.query(
        `SELECT * FROM users WHERE username = $1 AND user_id != $2`,
        [username, userId]
    );

    if (existingUsername.rowCount !== 0) {
        return res.status(409).send({
            success: false,

            message: "Username already exists",
        });
    }

    const existingEmail = await this.pg.query(
        `SELECT * FROM users WHERE email = $1 AND user_id != $2`,
        [email, userId]
    );

    if (existingEmail.rowCount !== 0) {
        return res.status(409).send({
            success: false,

            message: "Email already exists",
        });
    }

    const existingPhoneNumber = await this.pg.query(
        `SELECT * FROM users WHERE phone_number = $1 AND user_id != $2`,
        [phone_number, userId]
    );

    if (existingPhoneNumber.rowCount !== 0) {
        return res.status(409).send({
            success: false,

            message: "Phone number already exists",
        });
    }

    let newPassword = existingTeacher.rows[0].password;
    if (password) {
        newPassword = await argon2.hash(password);
    }
    // Update the teacher's details
    const updatedTeacher = await this.pg.query(
        `
        UPDATE
        users
        SET 
        password = $1,
        first_name = $2,
        last_name = $3,
        email = $4,
        phone_number = $5,
        username = $6,
        updated_at = CURRENT_TIMESTAMP
        WHERE
        user_id = $7 RETURNING *`,
        [
            newPassword,
            first_name,
            last_name,
            email,
            phone_number,
            username,
            userId,
        ]
    );

    // Delete the existing classes for the teacher
    await this.pg.query(`DELETE FROM modules_teacher WHERE teacher_id = $1`, [
        updatedTeacher.rows[0].user_id,
    ]);

    // Add the new classes for the teacher

    if (classes.length !== 0) {
        for (const c of classes) {
            await this.pg.query(
                `INSERT INTO modules_teacher (teacher_id, class_id, module_id) VALUES ($1, $2, $3)`,
                [updatedTeacher.rows[0].user_id, c.class_id, c.module_id]
            );
        }
    }

    return res.status(200).send({
        success: true,
        message: "Teacher updated successfully",
    });
};
