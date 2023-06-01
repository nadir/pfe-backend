import { Type, Static } from "@sinclair/typebox";
import { RouteHandler } from "fastify";
import { FileBody } from "../../schemas/posts.schema";
import { v4 as uuid } from "uuid";
import { parse } from "date-fns";

export const AddStudentBody = Type.Object({
    first_name: Type.String(),
    last_name: Type.String(),
    date_of_birth: Type.String(),
    class_id: Type.String(),
    proof: FileBody,
});

export type AddStudentBody = Static<typeof AddStudentBody>;

export const addStudent: RouteHandler<{
    Body: AddStudentBody;
}> = async function (req, res) {
    const { first_name, last_name, date_of_birth, class_id, proof } = req.body;
    const { userId } = req.user;

    const dob = parse(date_of_birth, "dd/mm/yyyy", new Date());

    let fileName = `/${userId}/students/${uuid().substring(
        0,
        8
    )}.${proof.filename.split(".").pop()}`;
    const buffer = Buffer.from(proof.data, "base64");
    // upload buffer to bucket
    const file = this.firebase.bucket.file(fileName);
    await file.save(buffer, {
        resumable: false,
        validation: false,
    });

    await file.makePublic();
    const fileUrl = file.publicUrl();

    const student = await this.pg.query(
        `INSERT INTO students (first_name, last_name, date_of_birth, class_id, proof_of_enrollment, parent_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [first_name, last_name, dob.toISOString(), class_id, fileUrl, userId]
    );

    return res.code(200).send({
        statusCode: 200,
        results: student.rows,
    });
};
