CREATE table modules (
    id serial NOT NULL PRIMARY KEY,
    name varchar(255) NOT NULL,
    description text NULL,
    icon varchar(255) NOT NULL,
    level integer NOT NULL,
);

CREATE TABLE modules_teacher (
    id serial NOT NULL PRIMARY KEY,
    module_id integer NOT NULL REFERENCES modules(id),
    teacher_id uuid NOT NULL REFERENCES users(user_id),
    class_id integer NOT NULL REFERENCES classes(id),
    color varchar(255) NOT NULL,
);


CREATE TABLE courses (
    id serial NOT NULL PRIMARY KEY,
    module_id integer NOT NULL REFERENCES modules(id),
    file varchar(255) NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
);

create TABLE homeworks (
    id serial NOT NULL PRIMARY KEY,
    module_id integer NOT NULL REFERENCES modules(id),
    class_id integer NOT NULL REFERENCES classes(id),
    title varchar(255) NOT NULL,
    description text NULL,
    file varchar(255) NOT NULL,
    author_id uuid NOT NULL REFERENCES users(user_id),
    due_date timestamp without time zone NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
);


CREATE TABLE module_resources (
    id serial NOT NULL PRIMARY KEY,
    module_id integer NOT NULL REFERENCES modules(id),
    file varchar(255) NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
)


CREATE TABLE notes (
    id serial NOT NULL PRIMARY KEY,
    student_id intenger NOT NULL REFERENCES students(id),
    module_id integer NOT NULL REFERENCES modules(id),
    evaluation NUMERIC(5, 2) NULL,
    test NUMERIC(5, 2) NULL,
    exam NUMERIC(5, 2) NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
)


CREATE TABLE questions (
    id serial NOT NULL PRIMARY KEY,
    module_id integer NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    question text NOT NULL,
    answer text NOT NULL,
    answered_at timestamp without time zone NULL,
    answered_by uuid NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
)