import { RouteHandler } from "fastify";

export const verifyStudent: RouteHandler<{
    Params: {
        student_id: string;
    };
}> = async function (req, res) {
    const { student_id } = req.params;

    try {
        await this.pg.query(
            `UPDATE students SET verified = true WHERE id = $1`,
            [student_id]
        );
    } catch (err) {
        return res.status(500).send({
            error: "Internal server error",
        });
    }

    return res.status(200).send({
        message: "Student verified successfully",
    });
};
