const users = {}
export const userHandlers = (io, socket) => {
    const { roomId, userName } = socket

    // инициализируем хранилище пользователей
    if(!users[roomId]){
        users[roomId] = []
    }
    const updateUserList = () => {
        // сообщение получают только пользователи, находящиеся в комнате
        io.to(roomId).emit('user_list:update', users[roomId])
    }
    // обрабатываем подключение нового пользователя
    socket.on('user:add', async (user) => {
        socket.to(roomId).emit('log', `user ${userName} connected`)

        // записываем идентификатор сокета пользователю
        user.socketId = socket.id

        // записивыем пользователя в хранилище
        users[roomId].push(user)

        // обновляем список пользователей
        updateUserList()
    })

    // обрабатываем отключение пользователя
    socket.on('disconnect', () => {
        if (!users[roomId]) return

        // сообщаем об этом другим пользователям
        socket.to(roomId).emit('log', `User ${userName} disconnected`)

        // удаляем пользователя из хранилища
        users[roomId] = users[roomId].filter((u) => u.socketId !== socket.id)

        // обновляем список пользователей
        updateUserList()
    })
}