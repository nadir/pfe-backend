import { initializeApp, cert } from "firebase-admin/app";
import { Storage, getStorage } from "firebase-admin/storage";
import { Messaging, getMessaging } from "firebase-admin/messaging";
import { Bucket } from "@google-cloud/storage";
import fp from "fastify-plugin";

export default fp(async (fastify) => {
    const app = initializeApp({
        credential: cert(
            JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "")
        ),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    const bucket = getStorage(app).bucket();
    const messaging = getMessaging(app);
    const storage = getStorage(app);

    fastify.decorate("firebase", {
        bucket,
        messaging,
        storage,
        // in the future i will add more services if needed
    });
});

declare module "fastify" {
    export interface FastifyInstance {
        firebase: {
            bucket: Bucket;
            messaging: Messaging;
            storage: Storage;
        };
    }
}
