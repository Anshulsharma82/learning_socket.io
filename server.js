const {Server} = require('socket.io')

const io = new Server(3000, {
    cors: '*'
})

let users = {}

io.on('connection', socket => {
    console.log('Server is active...')
    
    socket.on('user-connected', (userName) => {
        console.log('users::::::::::::::::::', users)
        users[socket.id] = userName
        socket.broadcast.emit('new-user-connected', userName)
    })

    socket.on('send-message', (textMsg) => {
        socket.broadcast.emit('boradcast-msg', {msg: textMsg, userName: users[socket.id]})
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })

})