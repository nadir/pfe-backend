import { Static, Type } from "@sinclair/typebox";

const FileBody = Type.Object({
    data: Type.String(),
    filename: Type.String(),
    mimetype: Type.String(),
});

export const PollBody = Type.Object({
    type: Type.Literal("poll"),
    question: Type.String(),
    options: Type.String(),
    classId: Type.Optional(Type.String()),
    closeDate: Type.Optional(Type.String()),
});

export const PublicationBody = Type.Object({
    title: Type.Optional(Type.String()),
    content: Type.String(),
    classId: Type.Optional(Type.String()),
    image: Type.Optional(FileBody),
    file1: Type.Optional(FileBody),
    type: Type.Literal("publication"),
});

export const LikePostQueryParams = Type.Object({
    postId: Type.String(),
});

export const VotePollQueryParams = Type.Object({
    pollId: Type.String(),
});

export const VotePollBody = Type.Object({
    optionId: Type.Number(),
});

export type VotePollBody = Static<typeof VotePollBody>;
export type VotePollQueryParams = Static<typeof VotePollQueryParams>;

export type LikePostQueryParams = Static<typeof LikePostQueryParams>;
export const CreatePostBody = Type.Union([PollBody, PublicationBody]);

export type CreatePostBody = Static<typeof CreatePostBody>;
