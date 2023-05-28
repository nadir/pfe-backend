import { RouteHandler } from "fastify";
import { CreateHomeworkBody } from "../../schemas/homework.schema";
import { v4 as uuid } from "uuid";
import { parse } from "date-fns";

export const createHomework: RouteHandler<{
    Body: CreateHomeworkBody;
}> = async function (request, reply) {
    const { classId, moduleId, title, description, dueDate, file } =
        request.body;

    const { userId } = request.user;

    // check if user is teacher
    let user = await this.pg.query("SELECT * FROM users WHERE user_id = $1", [
        userId,
    ]);

    if (user.rows[0].user_type !== "teacher") {
        return reply.code(403).send({
            statusCode: 403,
            error: "Forbidden",
            message: "You must be a teacher to create a homework",
        });
    }

    let fileUrl;

    if (file) {
        let fileName = `${userId}/homework/${uuid().substring(
            0,
            8
        )}.${file.filename.split(".").pop()}`;
        const buffer = Buffer.from(file.data, "base64");
        // upload buffer to bucket
        const object = this.firebase.bucket.file(fileName);
        await object.save(buffer, {
            resumable: false,
            validation: false,
        });

        fileUrl = object.publicUrl();
    }

    // parse from dd/mm/yyyy
    let date = parse(dueDate, "dd/MM/yyyy", new Date());

    // create homework
    let homework = await this.pg.query(
        "INSERT INTO homeworks (title, description, class_id, due_date, file, module_id, author_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [title, description, classId, date, fileUrl, moduleId, userId]
    );

    return reply.code(201).send({
        statusCode: 201,
        message: "Homework created",
        homework: homework.rows[0],
    });
};
