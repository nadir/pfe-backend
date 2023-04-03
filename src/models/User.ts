export default interface User {
    id: number;
    user_id: string;
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
    created_at: Date;
    updated_at: Date;
}
