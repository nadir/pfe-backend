import { Type, Static } from "@fastify/type-provider-typebox";

export const UserCheckBody = Type.Object({
    username: Type.String(),
    email: Type.String({ format: "email" }),
    phone_number: Type.String(),
});

export type UserCheckBody = Static<typeof UserCheckBody>;
