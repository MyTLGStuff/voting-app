// required imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const appRouter = require('./routes/pages');
const {
    ServerApiVersion
} = require('mongodb');
const cors = require('cors');
const {
    Server
} = require("socket.io");
require('dotenv').config();

// middleware applications
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use('/', appRouter);

// extra for testing
const candidate_routes = require('./routes/candidate_routes');
const user_routes = require('./routes/user_routes');
app.use('/candidate', candidate_routes);
app.use('/user', user_routes);

// socket.io instantiation
const httpServer = require('http').createServer(app);
const io = new Server(httpServer);
const message = '';
httpServer.listen(3000, () => {
    console.log('Sockets are listening...')
});

// socket.io controller
io.on('connection', (socket) => {
    console.log('User connnected: ' + socket.id);

    socket.on('results', (data) => {
        socket.broadcast.emit('results', data);
    });
});

// mongoose instance of mongodb
mongoose
.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
})
.then(console.log('MongoDB is connected...'))
.catch(err => console.error(err))

console.log('Express server is running!');