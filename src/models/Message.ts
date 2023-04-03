export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    recipient_id: number;
    message: string;
    file: string;
    created_at: Date;
    updated_at: Date;
}
