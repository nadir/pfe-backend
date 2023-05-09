import { RouteHandler } from "fastify";

export const getUserInfo: RouteHandler = async function (request, reply) {
    const { userId } = request.user;

    // return everything but passsword
    const userInfo = await this.pg.query(
        "SELECT user_id, username, first_name, last_name, email, phone_number, address, profile_pic, user_type, created_at FROM users WHERE user_id = $1",
        [userId]
    );
    return userInfo.rows[0];
};
