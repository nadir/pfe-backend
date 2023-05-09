CREATE TABLE
  public.conversations (
    id serial NOT NULL,
    user1_id uuid NOT NULL,
    user2_id uuid NOT NULL,
    last_message character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

ALTER TABLE
  public.conversations
ADD
  CONSTRAINT conversations_pkey PRIMARY KEY (id)


CREATE TABLE
  public.messages (
    id serial NOT NULL,
    conversation_id integer NOT NULL,
    sender_id uuid NOT NULL,
    content text NOT NULL,
    file character varying(255) NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

ALTER TABLE
  public.messages
ADD
  CONSTRAINT messages_pkey PRIMARY KEY (id)