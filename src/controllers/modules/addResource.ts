import { RouteHandler } from "fastify";
import { FileBody } from "../../schemas/posts.schema";
import { v4 as uuid } from "uuid";

export const addResource: RouteHandler<{
    Params: { moduleId: string };
    Body: {
        file: FileBody;
    };
}> = async function (req, res) {
    const { moduleId } = req.params;
    const { userId } = req.user;
    const { file } = req.body;

    const module = await this.pg.query(`SELECT * FROM modules WHERE id = $1`, [
        moduleId,
    ]);

    if (module.rows.length === 0) {
        return res.code(404).send({
            error: "Module not found",
        });
    }

    const moduleTeacher = await this.pg.query(
        `SELECT * FROM modules_teacher WHERE module_id = $1 AND teacher_id = $2`,
        [moduleId, userId]
    );

    if (moduleTeacher.rows.length === 0) {
        return res.code(403).send({
            error: "You are not allowed to add resource to this module",
        });
    }

    const { data, filename, mimetype } = file;

    // upload to firebase
    const storage = this.firebase.bucket;
    let fileName = `/modules/${moduleId}/resource/${uuid().substring(
        0,
        8
    )}.${file.filename.split(".").pop()}`;
    const fileUpload = storage.file(fileName);

    await fileUpload.save(Buffer.from(data, "base64"), {
        contentType: mimetype,
    });

    await fileUpload.makePublic();
    const fileUrl = await fileUpload.publicUrl();

    await this.pg.query(
        `INSERT INTO module_resources (module_id, file, filename) VALUES ($1, $2, $3)`,
        [moduleId, fileUrl, filename]
    );

    return res.code(200).send({
        message: "Resource added",
    });
};
