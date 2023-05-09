import { RouteHandler } from "fastify";

export const listContacts: RouteHandler = async function (req, reply) {
    //@ts-ignore
    const { userId } = req.user;
    const contacts = await this.pg.query(
        "SELECT user_id, first_name, last_name, profile_pic FROM users WHERE user_type = $1",
        ["teacher"]
    );

    return contacts.rows;
};
