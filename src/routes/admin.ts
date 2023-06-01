import { FastifyPluginAsync, RouteHandler } from "fastify";
import { addTeacher } from "../controllers/admin/addTeacher";
import { AddTeacherBody, EditTeacherBody } from "../schemas/admin.schema";
import { listClasses } from "../controllers/admin/listClasses";
import { getTeacher } from "../controllers/admin/getTeacherInfo";
import { editTeacher } from "../controllers/admin/modifyTeacher";
import { listTeachers } from "../controllers/admin/listTeachers";
import { deleteTeacher } from "../controllers/admin/deleteTeacher";
import { listUnconfirmedStudents } from "../controllers/admin/listUnconfirmedStudents";
import { verifyStudent } from "../controllers/admin/verifyStudent";
import { User } from "../models/User";
import argon2 from "argon2";

const adminLogin: RouteHandler<{
    Body: {
        username: string;
        password: string;
    };
}> = async function (request, reply) {
    const { username, password } = request.body;

    const user = await this.pg.query<User>(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );

    if (user.rowCount === 0) {
        return reply.code(401).send({
            message: "Username or password is incorrect",
        });
    }

    const valid = await argon2.verify(user.rows[0].password, password);
    this.log.info(valid);

    if (!valid) {
        return reply.code(401).send({
            message: "Username or password is incorrect",
        });
    }

    if (user.rows[0].user_type !== "admin") {
        return reply.code(401).send({
            message: "You are not an admin",
        });
    }

    const token = this.jwt.sign({ userId: user.rows[0].user_id });
    const full_name = user.rows[0].first_name + " " + user.rows[0].last_name;
    return { full_name, token };
};

const modules: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.route({
        method: "POST",
        url: "/teachers/add",
        handler: addTeacher,
        schema: {
            body: AddTeacherBody,
        },
    });

    fastify.route({
        method: "DELETE",
        url: "/teachers/delete/:teacher_id",
        handler: deleteTeacher,
        schema: {
            params: {
                teacher_id: { type: "string" },
            },
        },
    });

    fastify.route({
        method: "POST",
        url: "/teachers/edit/:userId",
        handler: editTeacher,
        schema: {
            body: EditTeacherBody,
            params: {
                userId: { type: "string" },
            },
        },
    });

    fastify.route({
        method: "GET",
        url: "/classes",
        handler: listClasses,
    });

    fastify.route({
        method: "GET",
        url: "/teacher/:userId",
        handler: getTeacher,
        schema: {
            params: {
                userId: { type: "string" },
            },
        },
    });

    fastify.route({
        method: "GET",
        url: "/teachers",
        handler: listTeachers,
    });

    // students related routes

    fastify.route({
        method: "GET",
        url: "/students/unconfirmed",
        handler: listUnconfirmedStudents,
    });

    fastify.route({
        method: "PUT",
        url: "/students/verify/:student_id",
        handler: verifyStudent,
        schema: {
            params: {
                student_id: { type: "string" },
            },
        },
    });

    fastify.route({
        method: "POST",
        url: "/adminlogin",
        handler: adminLogin,
    });
};

export default modules;
