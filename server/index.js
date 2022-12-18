import express from 'express';
import dotEnv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {sequelize} from "./db.js";
import { createServer } from 'http';
import { Server } from 'socket.io'
import onConnection from "./socket_io/onConnection.js";
import {getFilePath} from "./utils/file.js";
import onError from "./utils/onError.js";
import upload from "./utils/upload.js";

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
    }
))
app.use('/upload', upload.single('file'), (req, res) => {
    if(!req.file) return res.sendStatus(400)
    // формируем относительный путь к файлу
    const relativeFilePath = req.file.path
        .replace(/\\/g, '/')
        .split('server/files')[1]

    //  возвращаем его

    res.status(201).json(relativeFilePath)
})
app.use('/files', (req, res) => {
    // формируем абсолютный путь к файлу
    const filePath = getFilePath(req.url)
    res.status(200).sendFile(filePath)

})
app.use(onError)

try {
    await sequelize.authenticate()
    await sequelize.sync().then(result => console.log('success')).catch(e => console.log(e))
    // app.listen(process.env.PORT, () => {
    //     console.log(`Server started in port ${process.env.PORT}`)
    // })
} catch (e) {
    onError(e)
}

const server = createServer(app)
const io = new Server (server,  {
    cors: process.env.CLIENT_URL,
    serveClient: false
})
io.on('connection', (socket) => {
    onConnection(io, socket)
})

server.listen(process.env.PORT, () => {
    console.log(`Server started in port ${process.env.PORT}`)
})