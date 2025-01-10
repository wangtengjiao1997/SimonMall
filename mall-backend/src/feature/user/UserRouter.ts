import express, { NextFunction, Request, Response } from 'express';
import { Result } from '../../utils/Result';
import { clerkClient, requireAuth } from '@clerk/express'
import 'dotenv/config'


const userRouter = express.Router();


userRouter.get('/test1', requireAuth(), async (req, res) => {
    try {
        const mockData = {
            message: "You are authenticated!",
            user: {
                id: 1,
                name: "测试用户",
                email: "test@example.com",
                role: "user",
                createdAt: new Date().toISOString()
            },
            stats: {
                loginCount: 10,
                lastLogin: new Date().toISOString()
            }
        };

        res.json(Result.success(mockData));
    } catch (error) {
        res.status(500).json(Result.error(error.message));
    }
});


export default userRouter;
