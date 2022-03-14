// required imports
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('./passport/setup');
const routes = require('./routes/routes');
const candidate_routes = require('./routes/candidate_routes');
const user_routes = require('./routes/user_routes');
const auth_routes = require('./routes/auth_routes');
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
    extended: false
}));
app.use(bodyParser.json());
app.use(cors());
app.use(session({
    secret:process.env.SESSION_SECRET,
    cookie:{maxAge:60000},
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({mongoUrl:process.env.MONGO_URI})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use('/candidate', candidate_routes);
app.use('/user', user_routes);
//app.use('/api/auth', auth_routes);
app.use('/', auth_routes);

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