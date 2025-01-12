// src/types/express.d.ts
import { Request } from 'express';
import { ClerkUser } from '@clerk/clerk-sdk-node';

declare module 'express' {
    interface Request {
        auth: {
            userId: string;
            user?: ClerkUser;
            sessionId?: string;
        };
    }
}
