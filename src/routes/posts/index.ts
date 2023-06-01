import { FastifyPluginAsync } from "fastify";
// import { createPost } from "../../controllers/posts/createPost";
// import { CreatePostBody } from "../../schemas/posts.schema";
import multipart from "@fastify/multipart";
import {
    CreatePostBody,
    LikePostQueryParams,
    VotePollBody,
    VotePollQueryParams,
} from "../../schemas/posts.schema";
import { createPost } from "../../controllers/posts/createPost";
import { likePost } from "../../controllers/posts/likePost";
import { listPosts } from "../../controllers/posts/listPosts";
import { votePoll } from "../../controllers/posts/votePoll";
import { deletePost } from "../../controllers/posts/deletePost";
import { getPostComments } from "../../controllers/posts/postComments";
import { publishComment } from "../../controllers/posts/publishComment";
import { deleteComment } from "../../controllers/posts/deleteComment";

const posts: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.register(multipart, {
        attachFieldsToBody: "keyValues",
        async onFile(part) {
            const buff = await part.toBuffer();
            const data = buff.toString("base64");
            // @ts-ignore
            part.value = {
                data,
                filename: part.filename,
                mimetype: part.mimetype,
            }; // set `part.value` to specify the request body value
        },
    });
    fastify.route({
        method: "POST",
        url: "/",
        handler: createPost,
        schema: {
            body: CreatePostBody,
        },
        preHandler: [fastify.authenticate],
    });

    // like or unlike post
    fastify.route({
        method: "POST",
        url: "/:postId/like",
        handler: likePost,
        preHandler: [fastify.authenticate],
        schema: {
            params: LikePostQueryParams,
        },
    });

    fastify.route({
        method: "GET",
        url: "/",
        handler: listPosts,
        preHandler: [fastify.authenticate],
    });

    fastify.route({
        method: "POST",
        url: "/poll/:pollId/vote",
        handler: votePoll,
        preHandler: [fastify.authenticate],
        schema: {
            params: VotePollQueryParams,
            body: VotePollBody,
        },
    });

    fastify.route({
        method: "DELETE",
        url: "/:postId",
        handler: deletePost,
        preHandler: [fastify.authenticate],
        schema: {
            params: {
                postId: { type: "string" },
            },
        },
    });

    fastify.route({
        method: "GET",
        url: "/:postId/comments",
        handler: getPostComments,
        preHandler: [fastify.authenticate],
        schema: {
            params: {
                postId: { type: "string" },
            },
        },
    });

    fastify.route({
        method: "POST",
        url: "/:postId/comments",
        handler: publishComment,
        preHandler: [fastify.authenticate],
        schema: {
            params: {
                postId: { type: "string" },
            },
            body: {
                type: "object",
                required: ["content"],
                properties: {
                    content: { type: "string" },
                },
            },
        },
    });

    fastify.route({
        method: "DELETE",
        url: "/comments/:commentId/delete",
        handler: deleteComment,
        preHandler: [fastify.authenticate],
        schema: {
            params: {
                commentId: { type: "string" },
            },
        },
    });
};

export default posts;
