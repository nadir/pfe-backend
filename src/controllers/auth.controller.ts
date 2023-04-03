import { RouteHandler } from "fastify";
import { LoginBody, SignupBody } from "../schemas/auth.schema";
import argon2 from "argon2";
import User from "../models/User";

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
        return reply.code(400).send({
            message: "Username or password is incorrect",
        });
    }

    const valid = await argon2.verify(user.rows[0].password, password);

    if (!valid) {
        return reply.code(400).send({
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
    const { username, password, email, first_name, last_name } = request.body;

    // check if username or email already exists and handle both seperately
    const user = await this.pg.query(
        "SELECT * FROM users WHERE username = $1 OR email = $2",
        [username, email]
    );

    if (user.rowCount > 0) {
        if (user.rows[0].username === username) {
            return reply.code(400).send({
                message: "Username already exists",
            });
        } else if (user.rows[0].email === email) {
            return reply.code(400).send({
                message: "Email already exists",
            });
        }
    }

    const hashedPassword = await argon2.hash(password);

    const id = await this.pg.query<{ user_id: string }>(
        "INSERT INTO users (username, password, email, first_name, last_name, user_type) VALUES ($1, $2, $3, $4, $5, 'parent') RETURNING user_id",
        [username, hashedPassword, email, first_name, last_name]
    );

    const token = this.jwt.sign({ userId: id.rows[0].user_id });
    return { token };
};

export default {
    login,
    signup,
};
