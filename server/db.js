import {Sequelize} from "sequelize";
import dotEnv from 'dotenv';
dotEnv.config()

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT || 8000;

export const sequelize = new Sequelize(
    dbName,
    dbUser,
    dbPassword,
    {
        dialect: "postgres",
        host: dbHost,
        port: dbPort
    }
)
