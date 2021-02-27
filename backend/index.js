const express = require('express');
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { userRoutes } = require('./controllers/userRoutes.js')
const { messageRoutes } = require('./controllers/messageRoutes.js')
// load env var
require('dotenv').config()

let corsOptions = {
    origin: '*' // allow from anywhere
}
// use cors
app.use(cors(corsOptions))

// json body parser
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)

// connect to mongoDB
mongoose.connect(process.env.MongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to database.')
}).catch((e) => {
    console.log(e)
})

// if port is defined in env file, use that otherwise use 8000
const PORT = process.env.PORT || 8000

const server = app.listen(PORT, () => {
    console.log('App is now listening on ' + PORT)
})

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PUT"]
    }
});
// ws

io.on('connection', (socket) => {
    console.log('User is now connected to our websocket server')
    socket.on('newMessage', (message) => {
       io.emit('incomingNewMessage', message)
    })
})