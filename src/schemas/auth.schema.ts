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
});

export type SignupBody = Static<typeof SignupBody>;
export type LoginBody = Static<typeof LoginBody>;
