import { PostgresDb } from "@fastify/postgres";

interface studentDetails {
    firstName: string;
    lastName: string;
    date_of_birth: Date;
    class: string;
    proof_of_enrollment: string;
    parent_id: number;
}

// function that takes parent id and datbase object and returns a creates a child
export const createStudent = async (child: studentDetails, db: PostgresDb) => {
    const {
        firstName,
        lastName,
        date_of_birth,
        class: child_class,
        proof_of_enrollment,
        parent_id,
    } = child;

    try {
        // insert child info and return id
        const child_id = await db.query<{ id: number }>(
            "INSERT INTO students (first_name, last_name, date_of_birth, class, proof_of_enrollment, parent_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [
                firstName,
                lastName,
                date_of_birth,
                child_class,
                proof_of_enrollment,
                parent_id,
            ]
        );

        return child_id.rows[0].id;
    } catch (err) {
        return Promise.reject(err);
    }
};
