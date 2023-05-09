export interface Message {
    id: number;
    sender_id: string;
    receiver_id: string;
    content: string;
    attachment: string;
    created_at: Date;
}
