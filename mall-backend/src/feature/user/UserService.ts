import { User, UserRole } from '../../entities';
import { AppDataSource } from '../../config/DataSource';
import { clerkClient } from '@clerk/express';
import { DeepPartial } from 'typeorm';


const userRepository = AppDataSource.getRepository(User);
export const checkUserProfileService = async (userId: string) => {
  try {
    const clerkUser = await clerkClient.users.getUser(userId);
    const lastName = clerkUser.lastName;
    const firstName = clerkUser.firstName
    const username = clerkUser.username;
    // 使用 AppDataSource 获取 User 仓库


    // 从数据库查询用户
    const user = await userRepository.findOne({
      where: { userId: userId }
    });


    // 如果用户不在数据库中
    if (!user) {
      return {
        exists: false,
        message: '用户未登记信息',
      };
    }

    // 如果用户存在，返回完整信息
    return {
      exists: true,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    };
  } catch (error) {
    throw new Error(`获取用户信息失败: ${error.message}`);
  }
};

export const createUserService = async (userId: string, userData: DeepPartial<User>) => {
  const clerkUser = await clerkClient.users.getUser(userId);
  console.log(userData);
  const newUser = userRepository.create({
    userId,
    username: userData.username || clerkUser.username,
    email: userData.email || clerkUser.emailAddresses[0]?.emailAddress,
    role: UserRole.BUYER,
    phone: userData.phone,
    address: userData.address
  } as DeepPartial<User>);

  return await userRepository.save(newUser);
};

export const updateUserService = async (userId: string, updateData: Partial<User>) => {
  const user = await userRepository.findOne({ where: { userId } });
  if (!user) {
    throw new Error('用户不存在');
  }

  Object.assign(user, updateData);
  return await userRepository.save(user);
};

export const deleteUserService = async (userId: string) => {
  const result = await userRepository.delete({ userId });
  if (result.affected === 0) {
    throw new Error('用户不存在');
  }
};

export const getUsersInfoService = async (userId: string) => {
  return await userRepository.findOne({
    where: { userId },
    select: [
      'userId',
      'username',
      'email',
      'role',
      'phone',
      'address',
      'createdAt',
      'updatedAt'
    ]
  });
};