import { Static, Type } from "@sinclair/typebox";

export const LoginBody = Type.Object({
    username: Type.String(),
    password: Type.String({ minLength: 8, maxLength: 64, title: "Password" }),
});

export const SignupBody = Type.Object({
    username: Type.String(),
    password: Type.String({ minLength: 8, maxLength: 64, title: "Password" }),
    email: Type.String({ format: "email" }),
    first_name: Type.String(),
    last_name: Type.String(),
    date_of_birth: Type.String({ format: "date" }),
    address: Type.String(),
    phone_number: Type.String(),
    child_first_name: Type.String(),
    child_last_name: Type.String(),
    child_date_of_birth: Type.String({ format: "date" }),
    child_class: Type.String(),
    proof_of_enrollment: Type.String(),
});

export type SignupBody = Static<typeof SignupBody>;
export type LoginBody = Static<typeof LoginBody>;
