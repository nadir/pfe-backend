export interface Conversation {
    id: number;
    user1_id: string;
    user2_id: string;
    last_message: string;
    created_at: Date;
    updated_at: Date;
}
