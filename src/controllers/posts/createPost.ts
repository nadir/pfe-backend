import { RouteHandler } from "fastify";
import { CreatePostBody } from "../../schemas/posts.schema";
import { v4 as uuid } from "uuid";

export const createPost: RouteHandler<{
    Body: CreatePostBody;
}> = async function (request, reply) {
    const { type, classId } = request.body;
    const { userId } = request.user;

    // check if user is teacher
    let user = await this.pg.query("SELECT * FROM users WHERE user_id = $1", [
        userId,
    ]);

    if (user.rows[0].user_type !== "teacher") {
        return reply.code(403).send({
            statusCode: 403,
            error: "Forbidden",
            message: "You must be a teacher to create a post",
        });
    }
    // check if class exists*
    if (classId) {
        let classExists = await this.pg.query(
            "SELECT * FROM classes WHERE id = $1",
            [request.body.classId]
        );

        if (classExists.rows.length === 0) {
            return reply.code(404).send({
                statusCode: 404,
                error: "Not Found",
                message: "Class not found",
            });
        }
    }

    // // check if user teaches class, MAYBE IMPLEMENT LATER

    // let teachesClass = await this.pg.query(
    //     "SELECT * FROM teaches WHERE user_id = $1 AND class_id = $2",
    //     [request.user.userId, request.body.classId]
    // );

    // if (teachesClass.rows.length === 0) {
    //     return reply.code(403).send({
    //         statusCode: 403,
    //         error: "Forbidden",
    //         message: "You do not teach this class",
    //     });
    // }

    // create post

    // upload image to firebase

    if (type === "publication") {
        const { title, content, image } = request.body;

        let fileUrl;

        if (image) {
            let fileName = `/${userId}/posts/${uuid().substring(
                0,
                8
            )}.${image.filename.split(".").pop()}`;
            const buffer = Buffer.from(image.data, "base64");
            // upload buffer to bucket
            const file = this.firebase.bucket.file(fileName);
            await file.save(buffer, {
                resumable: false,
                validation: false,
            });

            await file.makePublic();
            fileUrl = file.publicUrl();
        }

        const post = await this.pg.query(
            "INSERT INTO posts (class_id, author_id, type, title, content, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [classId || null, userId, type, title, content, fileUrl]
        );

        return reply.code(201).send({
            statusCode: 201,
            message: "Post created",
            data: post.rows[0],
        });
    } else if (type === "poll") {
        const { question, options, closeDate } = request.body;

        const poll = await this.pg.query(
            "INSERT INTO polls (question, closed_at) VALUES ($1, $2) RETURNING *",
            [question, closeDate]
        );

        const pollId = poll.rows[0].id;

        for (const option of JSON.parse(options)) {
            await this.pg.query(
                "INSERT INTO poll_options (poll_id, option) VALUES ($1, $2)",
                [pollId, option]
            );
        }

        const post = await this.pg.query(
            "INSERT INTO posts (class_id, author_id, type, poll_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [classId, userId, type, pollId]
        );

        return reply.code(201).send({
            statusCode: 201,
            message: "Post created",
            data: post.rows[0],
        });
    }

    // return post
};
