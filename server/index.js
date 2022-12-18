import express from 'express';
import dotEnv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {sequelize} from "./db.js";
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
    }
))

const start = async () => {
    await sequelize.authenticate()
    await sequelize.sync().then(result => console.log('success')).catch(e => console.log(e))
    app.listen(process.env.PORT, () => {
        console.log(`Server started in port ${process.env.PORT}`)
    })
}
start()