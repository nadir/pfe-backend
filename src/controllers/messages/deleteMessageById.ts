import { RouteHandler } from "fastify";
import { DeleteMessageParams } from "../../schemas/messages.schema";

export const deleteMessageById: RouteHandler<{
    Params: DeleteMessageParams;
}> = async function (request, reply) {
    const { messageId } = request.params;
    const { userId } = request.user;

    // delete message only if user has permission to delete it
    const deletedMessage = await this.pg.query(
        `DELETE FROM messages WHERE id = $1 AND sender_id = $2 RETURNING *`,
        [messageId, userId]
    );

    if (deletedMessage.rows.length === 0) {
        reply.status(404).send({
            success: false,
            message: "Message not found",
        });
    }

    return {
        success: true,
        message: "Message deleted",
    };
};
