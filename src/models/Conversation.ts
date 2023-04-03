export interface Conversation {
    id: number;
    user1_id: number;
    user2_id: number;
    last_message: string;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
}
