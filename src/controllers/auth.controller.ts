import { RouteHandler } from "fastify";
import { LoginBody, SignupBody } from "../schemas/auth.schema";
import argon2 from "argon2";
import { User } from "../models/User";
import { createStudent } from "../services/createStudent";
import { parse } from "date-fns";

// Login Controller

const login: RouteHandler<{
    Body: LoginBody;
}> = async function (request, reply) {
    const { username, password } = request.body;

    const user = await this.pg.query<User>(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );

    if (user.rowCount === 0) {
        return reply.code(401).send({
            message: "Username or password is incorrect",
        });
    }

    const valid = await argon2.verify(user.rows[0].password, password);

    if (!valid) {
        return reply.code(401).send({
            message: "Username or password is incorrect",
        });
    }

    const token = this.jwt.sign({ userId: user.rows[0].user_id });
    const full_name = user.rows[0].first_name + " " + user.rows[0].last_name;
    return { full_name, token };
};

// Signup Controller

const signup: RouteHandler<{ Body: SignupBody }> = async function (
    request,
    reply
) {
    // parent information
    const {
        username,
        password,
        first_name,
        last_name,
        email,
        phone_number,
        address,
    } = request.body;
    const userId = request.userId;

    // child information
    const {
        child_first_name,
        child_last_name,
        child_date_of_birth,
        child_class,
        proof_of_enrollment,
    } = request.body;

    const hashedPassword = await argon2.hash(password);

    const parentResult = await this.pg.query<{ id: number }>(
        "INSERT INTO users (user_id, username, password, first_name, last_name, email, phone_number, address, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
        [
            userId,
            username.toLocaleLowerCase(),
            hashedPassword,
            first_name,
            last_name,
            email,
            phone_number,
            address,
            "parent",
        ]
    );
    const parent_id = parentResult.rows[0].id;
    const child_dob = parse(child_date_of_birth, "yyyy-MM-dd", new Date());
    try {
        await createStudent(
            {
                firstName: child_first_name,
                lastName: child_last_name,
                date_of_birth: child_dob,
                class: child_class,
                proof_of_enrollment: proof_of_enrollment,
                parent_id,
            },
            this.pg
        );
    } catch (error) {
        return reply.code(500).send({
            success: false,
            message: "Error creating child",
            error,
        });
    }

    const token = this.jwt.sign({ userId: request.userId });
    return {
        success: true,
        message: "User created successfully",
        userId: request.userId,
        token,
    };
};

export default {
    login,
    signup,
};
