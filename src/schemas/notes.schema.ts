import { Static, Type } from "@sinclair/typebox";

export const UpdateNotesBody = Type.Object({
    notes: Type.Array(
        Type.Object({
            id: Type.Number(),
            evaluation: Type.Optional(Type.Number()),
            test: Type.Optional(Type.Number()),
            exam: Type.Optional(Type.Number()),
            updated_at: Type.Optional(Type.String()),
        })
    ),
});

export type UpdateNotesBody = Static<typeof UpdateNotesBody>;
