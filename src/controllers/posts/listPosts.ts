import { RouteHandler } from "fastify";

export const listPosts: RouteHandler<{
    Querystring: {
        nextCursor?: string;
    };
}> = async function (request, reply) {
    const { userId } = request.user;

    // paginate with cursor
    const resultsPerPage = 10;
    const { nextCursor } = request.query;
    const results = await this.pg.query({
        text: `SELECT
            p.id,
            p.title,
            p.content,
            p.image,
            p.type,
            p.class_id,
            p.author_id,
            u.profile_pic as author_pic,
            CONCAT(u.first_name, ' ', u.last_name) as author_name,
            p.created_at,
            p.poll_id,
            po.question,
            EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = $1) AS liked,
            COUNT(DISTINCT pl.id) AS likesCount,
            COALESCE(COUNT(DISTINCT pc.id), 0) AS commentsCount,
            COUNT(DISTINCT pv.id) AS votesCount,
            MAX(CASE WHEN pv.user_id = $1 THEN pv.poll_option_id ELSE NULL END) AS votedOption
          FROM
            posts AS p
            LEFT JOIN post_likes AS pl ON p.id = pl.post_id
            LEFT JOIN post_comments AS pc ON p.id = pc.post_id
            LEFT JOIN poll_votes AS pv ON p.poll_id = pv.poll_id
            LEFT JOIN users as u ON p.author_id = u.user_id
            LEFT JOIN polls as po ON p.poll_id = po.id
          WHERE 
            CASE WHEN $3::INTEGER IS NOT NULL THEN p.id < $3 ELSE TRUE END
          GROUP BY
            p.id,
            u.profile_pic,
            u.first_name,
            u.last_name,
            po.question
          
          ORDER BY
            p.created_at DESC
          LIMIT $2; 
          `,
        values: [userId, resultsPerPage + 1, nextCursor || null],
    });

    const cursor =
        results.rows.length > resultsPerPage
            ? results.rows[results.rows.length - 1].id
            : null;

    // if post is a poll, get poll options
    const pg = this.pg;
    const response = await Promise.all(
        results.rows.map(async (post) => {
            let newPost = {
                id: post.id,
                title: post.title,
                text: post.content,
                image: post.image,
                type: post.type,
                class_id: post.class_id,
                user: {
                    id: post.author_id,
                    profile_pic: post.author_pic,
                    name: post.author_name,
                },
                created_at: post.created_at,
                isLiked: post.liked,
                likesCount: parseInt(post.likescount),
                commentsCount: parseInt(post.commentscount),
                poll_id: post.poll_id,
                question: post.question,
                votesCount: parseInt(post.votescount),
                votedOption: post.votedoption,
                options: [] as any[],
            };

            if (post.type === "poll") {
                const pollOptions = await pg.query({
                    text: `SELECT
                  po.id,
                  po.option as text,
                  COUNT(pv.id) AS votes
                FROM
                  poll_options AS po
                  LEFT JOIN poll_votes AS pv ON po.id = pv.poll_option_id
                WHERE
                  po.poll_id = $1
                GROUP BY
                  po.id;
                `,
                    values: [post.poll_id],
                });

                newPost.options = pollOptions.rows;
            }

            return newPost;
        })
    );

    // only pop if there are more results
    if (results.rows.length > resultsPerPage) response.pop();

    return reply.code(200).send({
        statusCode: 200,
        data: response,
        nextCursor: cursor,
    });
};
