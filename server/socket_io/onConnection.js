import {userHandlers} from "./handlers/userHandler.js";
import {messageHandlers} from "./handlers/messageHandler.js";

export default function onConnection(io, socket) {
    // извлекаем идентификатор комнаты и имя пользователя
    const { roomId, userName } = socket.handshake.query

    // аписываем их в объект сокета
    socket.roomId = roomId
    socket.userName = userName

    // присоединяемся к комнате
    socket.join(roomId)

    // регистрируем обработчики для пользователей
    userHandlers(io, socket)

    // регистрируем обработчики для пользователей
    messageHandlers(io, socket)
}