export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    file: string;
    created_at: Date;
}
