import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppDataSource } from './config/DataSource';
import 'express-async-errors';
import userRouter from './feature/user/UserRouter';
import { clerkMiddleware } from '@clerk/express'
import 'dotenv/config'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
// 初始化 Express 应用
const app = express();

// 中间件配置
app.use(morgan('dev'));  // 日志中间件放在最前面
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(clerkMiddleware())



// API 路由
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

// 全局错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 服务器配置
const PORT = process.env.PORT || process.env.ASB_WEB_PORT || 3001;

// 数据库初始化和服务器启动
async function startServer() {
    try {
        // 初始化数据库连接
        await AppDataSource.initialize();
        console.log('✅ 数据库连接成功');

        // 启动服务器
        const server = app.listen(PORT, () => {
            console.log(`🚀 服务器运行在端口 ${PORT}`);
        });

        // 优雅关闭处理
        const gracefulShutdown = async () => {
            console.log('🔄 正在关闭服务器...');
            server.close(async () => {
                console.log('👋 HTTP 服务器已关闭');
                try {
                    await AppDataSource.destroy();
                    console.log('💤 数据库连接已关闭');
                    process.exit(0);
                } catch (error) {
                    console.error('❌ 数据库关闭时发生错误:', error);
                    process.exit(1);
                }
            });
        };

        // 注册进程信号处理
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

    } catch (error) {
        console.error('❌ 启动服务器时发生错误:', error);
        process.exit(1);
    }
}

// 启动应用
startServer();