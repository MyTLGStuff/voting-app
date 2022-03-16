// required imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const candidate_routes = require('./routes/candidate_routes');
const {
    auth
} = require('express-openid-connect');
const {
    ServerApiVersion
} = require('mongodb');
const cors = require('cors');
const {
    Server
} = require("socket.io");
const { process_params } = require('express/lib/router');
require('dotenv').config();


// Auth0 Configuration
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SESSION_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER
};


// middleware applications
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use(auth(config));
app.use('/', routes);
app.use('/candidate', candidate_routes);


// socket.io instantiation
const server = require('http').createServer(app);
const io = new Server(server);

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

server.listen(process.env.PORT, () => {
    console.log('Sockets are listening...')
});

console.log('Express server is running!');