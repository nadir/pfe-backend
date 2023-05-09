import { FastifyReply, FastifyRequest, RouteHandler } from "fastify";

export const listConversations: RouteHandler = async function (
    req: FastifyRequest,
    res: FastifyReply
) {
    const { userId } = req.user;

    const query = {
        text: `SELECT
        u.first_name as first_name,
        u.last_name as last_name,
        
        u.profile_pic as profile_pic,
        u.user_id as contact_id,
        m.content as content,
        m.created_at as created_at
      FROM
        (
          SELECT
            GREATEST(sender_id, receiver_id) AS user1_id,
            LEAST(sender_id, receiver_id) AS user2_id,
            MAX(created_at) AS max_created_at
          FROM
            messages
          GROUP BY
            user1_id,
            user2_id
        ) latest_msg
        JOIN messages m ON GREATEST(m.sender_id, m.receiver_id) = latest_msg.user1_id
        AND LEAST(m.sender_id, m.receiver_id) = latest_msg.user2_id
        AND m.created_at = latest_msg.max_created_at
        JOIN users u ON u.user_id = CASE
          WHEN m.sender_id = $1 THEN m.receiver_id
          ELSE m.sender_id
        END
      WHERE
        m.sender_id = $1
        OR m.receiver_id = $1
      ORDER BY
        m.created_at DESC;`,
        values: [userId],
    };

    const conversations = await this.pg.query(query);
    return conversations.rows;
};
