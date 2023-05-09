CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id NOT NULL INTEGER REFERENCES users(user_id),
  receiver_id NOT NULL INTEGER REFERENCES users(user_id),
  content TEXT NOT NULL,
  attachment VARCHAR(255),
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
