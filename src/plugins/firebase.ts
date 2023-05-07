import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { Messaging, getMessaging } from "firebase-admin/messaging";
import { Bucket } from "@google-cloud/storage";
import fp from "fastify-plugin";

export default fp(async (fastify) => {
    const firebaseApp = initializeApp({
        credential: cert(
            JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "")
        ),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    const bucket = getStorage(firebaseApp).bucket();
    const messaging = getMessaging(firebaseApp);

    fastify.decorate("firebase", {
        bucket,
        messaging,
        // in the future i will add more services if needed
    });
});

declare module "fastify" {
    export interface FastifyInstance {
        firebase: {
            bucket: Bucket;
            messaging: Messaging;
        };
    }
}
