import { Static, Type } from "@sinclair/typebox";

export const MessagesResponse = Type.Array(
    Type.Object({
        id: Type.Number(),
        content: Type.String(),
        author: Type.Object({
            id: Type.String(),
            first_name: Type.String(),
            last_name: Type.String(),
        }),
        created_at: Type.String(),
    })
);

export const ConversationsResponse = Type.Array(
    Type.Object({
        conversation_id: Type.Number(),
        last_message: Type.String(),
        contact: Type.Object({
            id: Type.String(),
            first_name: Type.String(),
            last_name: Type.String(),
        }),
    })
);

export const ListConversationParams = Type.Object({
    conversation_id: Type.String(),
});

export const CreateMessageParams = Type.Object({
    conversation_id: Type.String(),
});

export const CreateMessageBody = Type.Object({
    content: Type.String(),
});

export const CreateMessageResponse = Type.Object({
    id: Type.Number(),
    content: Type.String(),
    sender_id: Type.String(),
    conversation_id: Type.String(),
    file: Type.String(),
    created_at: Type.String(),
});

export type CreateMessageResponse = Static<typeof CreateMessageResponse>;
export type ListConversationParams = Static<typeof ListConversationParams>;
export type CreateMessageParams = Static<typeof CreateMessageParams>;
export type CreateMessageBody = Static<typeof CreateMessageBody>;
export type MessagesResponse = Static<typeof MessagesResponse>;
export type ConversationsResponse = Static<typeof ConversationsResponse>;
