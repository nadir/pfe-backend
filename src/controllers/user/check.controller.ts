import { RouteHandler } from "fastify";
import { UserCheckBody } from "../../schemas/user.schema";

export const checkDetails: RouteHandler<{
    Querystring: UserCheckBody;
}> = async function (request, reply) {
    // check if either username or email or phone number is already taken and handle errors seperately
    const { username, email, phone_number } = request.query;

    if (username) {
        const user = await this.pg.query(
            "SELECT * FROM users WHERE username = $1",
            [username.toLocaleLowerCase()]
        );

        if (user.rowCount !== 0) {
            return reply.code(401).send({
                available: false,
                field: "username",
                message: "Username is already taken",
            });
        }
    }

    if (email) {
        const email_check = await this.pg.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (email_check.rowCount !== 0) {
            return reply.code(401).send({
                available: false,
                field: "email",
                message: "Email is already taken",
            });
        }
    }

    if (phone_number) {
        const phone = await this.pg.query(
            "SELECT * FROM users WHERE phone_number = $1",
            [phone_number]
        );

        if (phone.rowCount !== 0) {
            return reply.code(401).send({
                available: false,
                field: "phoneNumber",
                message: "Phone number is already taken",
            });
        }
    }
    return reply.code(200).send({
        available: true,
    });
};
