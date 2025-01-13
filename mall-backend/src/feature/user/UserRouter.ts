import express, { RequestHandler } from 'express';
import { requireAuth } from '@clerk/express';
import { checkUserProfile, createUser, deleteUser, getUsersInfo, updateUser } from './UserController';

const userRouter = express.Router();

userRouter.get('/checkUserProfile', requireAuth(), (checkUserProfile as unknown) as RequestHandler);

userRouter.post('/createUserInfo', requireAuth(), (createUser as unknown) as RequestHandler);
userRouter.put('/updateUserInfo', requireAuth(), (updateUser as unknown) as RequestHandler);
userRouter.delete('/deleteUserInfo', requireAuth(), (deleteUser as unknown) as RequestHandler);
userRouter.get('/getUserInfo', requireAuth(), (getUsersInfo as unknown) as RequestHandler);

export default userRouter;
