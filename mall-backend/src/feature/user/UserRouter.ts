import express, { RequestHandler } from 'express';
import { requireAuth } from '@clerk/express';
import { checkUserProfile, createUser, deleteUser, getUsersInfo, updateUser } from './UserController';

const userRouter = express.Router();

userRouter.get('/checkUserProfile', requireAuth(), checkUserProfile);

userRouter.post('/createUserInfo', requireAuth(), createUser);
userRouter.put('/updateUserInfo', requireAuth(), updateUser);
userRouter.delete('/deleteUserInfo', requireAuth(), deleteUser);
userRouter.get('/getUserInfo', requireAuth(), getUsersInfo);

export default userRouter;
