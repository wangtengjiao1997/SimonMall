import { config } from 'dotenv';
import * as fs from 'fs';
import { DataSource } from 'typeorm';
import { User, Merchant, Product, ShoppingEvent, SellingProduct, Cart, CartItem, Order, OrderItem, EventProduct } from '../entities';


if (fs.existsSync(`.env.${process.env.NODE_ENV}`)) {
    console.log(`Using .env.${process.env.NODE_ENV} file`);
    config({ path: `.env.${process.env.NODE_ENV}` });
} else {
    console.error(
        `The .env.${process.env.NODE_ENV} file corresponding to NODE_ENV=${process.env.NODE_ENV} is not found!`,
    );
    console.warn('Using default .env file');
    config();
}

const host: string = process.env.DB_HOST as string;
const port: number = parseInt(process.env.DB_PORT as string, 10);
const username: string = process.env.DB_USERNAME as string;
const password: string = process.env.DB_PASSWORD as string;
const database: string = process.env.DB_NAME as string;



export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'SimonMall',
    synchronize: true,
    logging: false,
    entities: [
        User,
        Merchant,
        Product,
        ShoppingEvent,
        SellingProduct,
        EventProduct,
        Cart,
        CartItem,
        Order,
        OrderItem
    ],
});

