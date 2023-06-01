import { Type, Static } from "@sinclair/typebox";

export const AddTeacherBody = Type.Object({
    username: Type.String(),
    password: Type.String(),
    first_name: Type.String(),
    last_name: Type.String(),
    email: Type.String(),
    phone_number: Type.String(),
    classes: Type.Array(
        Type.Object({
            class_id: Type.Number(),
            module_id: Type.Number(),
        })
    ),
});

export const EditTeacherBody = Type.Object({
    username: Type.String(),
    password: Type.Optional(Type.String()),
    first_name: Type.String(),
    last_name: Type.String(),
    email: Type.String(),
    phone_number: Type.String(),
    classes: Type.Array(
        Type.Optional(
            Type.Object({
                class_id: Type.Number(),
                module_id: Type.Number(),
            })
        )
    ),
});

export type AddTeacherBody = Static<typeof AddTeacherBody>;

export type EditTeacherBody = Static<typeof EditTeacherBody>;
