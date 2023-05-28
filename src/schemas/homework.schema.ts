import { Static, Type } from "@sinclair/typebox";
import { FileBody } from "./posts.schema";

export const CreateHomeworkBody = Type.Object({
    title: Type.String(),
    description: Type.String(),
    moduleId: Type.Number(),
    classId: Type.Number(),
    dueDate: Type.String(),
    file: Type.Optional(FileBody),
});

export type CreateHomeworkBody = Static<typeof CreateHomeworkBody>;
