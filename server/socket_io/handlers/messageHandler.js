import {Message} from "../../models/models.js";
import {removeFile} from "../../utils/file.js";
import onError from "../../utils/onError.js";

const messages = {}

export const messageHandlers = (io, socket) => {
    // извлекаем идентификатор комнаты
    const {roomId} = socket

    // утилитаа для обновления списка сообщений
    const updateMessageList = () => {
        io.to(roomId).emit('message_list:update', messages[roomId])
    }

    // обрабатываем получение сообщений
    socket.on('message:get', async () => {
        try {
            const _messages = await Message.findAll({where: {roomId: roomId}})

        // инициализируем хранилище сообщений
            messages[roomId] = _messages

            // обновляем список сообщений
            updateMessageList()

        } catch (e) {
            onError(e)
        }
    })

    // обрабатываем создание нового сообщения
    socket.on('message:add', (message) => {
        // пользователи не должны ждать записи сообщения в БД
        Message.create(message).catch(onError)

        // Создаем сообщение предполагая, что запись сообщения в БД будет успешной
        message[roomId].push(message)

        // обновляем список сообщений
        updateMessageList()
    })

    // обрабатываем удаление сообщения
    socket.on('message:remove', (message) => {
        const {messageId, messageType, textOrPathToFile} = message
        // Пользователи не должны ждать удаления сообщения из БД и файла на сервере (если сообщение является файлом)
        Message.destroy({where: {messageId: messageId}}).then(() => {
            if(messageType !== 'text'){
                removeFile(textOrPathToFile)
            }
        }).catch(onError)

       // удаляем сообщение (также, с расчётом на то, что это будет успешно)
       message[roomId] = messages[roomId].filter((m) => m.messageId !== messageId)

        updateMessageList()
    }) // end
}