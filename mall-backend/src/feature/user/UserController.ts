import { Request, Response } from 'express';
import { Result } from '../../utils/Result';
import { checkUserProfileService, createUserService, updateUserService, deleteUserService, getUsersInfoService } from './UserService';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const checkUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).auth.userId;
        const result = await checkUserProfileService(userId);
        res.json(Result.success(result)); 
    } catch (error) {
        res.status(500).json(Result.error(error.message));
    }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
      const userData = req.body;
      const result = await createUserService(userId, userData);
      res.json(Result.success(result));
  } catch (error) {
      res.status(500).json(Result.error(error.message));
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
      const updateData = req.body;
      const result = await updateUserService(userId, updateData);
      res.json(Result.success(result));
  } catch (error) {
      res.status(500).json(Result.error(error.message));
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
      await deleteUserService(userId);
      res.json(Result.success('用户删除成功'));
  } catch (error) {
      res.status(500).json(Result.error(error.message));
  }
};

export const getUsersInfo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
      const result = await getUsersInfoService(userId);
      res.json(Result.success(result));
  } catch (error) {
      res.status(500).json(Result.error(error.message));
  }
};