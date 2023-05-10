import { Static, Type } from "@sinclair/typebox";

export const ListMessagesParams = Type.Object({
    userId: Type.String(),
});

export const ListMessageQuerystring = Type.Object({
    page: Type.Optional(Type.Number()),
});

export const CreateMessageParams = Type.Object({
    conversation_id: Type.String(),
});

export const DeleteMessageParams = Type.Object({
    messageId: Type.Number(),
});

export const CreateMessageBody = Type.Object({
    receiver_id: Type.String(),
    content: Type.String(),
});

export const RegisterFCMTokenBody = Type.Object({
    token: Type.String(),
});

export type CreateMessageParams = Static<typeof CreateMessageParams>;
export type DeleteMessageParams = Static<typeof DeleteMessageParams>;
export type CreateMessageBody = Static<typeof CreateMessageBody>;
export type ListMessagesParams = Static<typeof ListMessagesParams>;
export type ListMessageQuerystring = Static<typeof ListMessageQuerystring>;
export type RegisterFCMTokenBody = Static<typeof RegisterFCMTokenBody>;
