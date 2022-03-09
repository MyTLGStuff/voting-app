const express = require('express');
const bodyParser = require('body-parser');
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');

const uri = "mongodb+srv://lbox01:Hellou%32y%21@cluster0.jghso.mongodb.net/star%2Dwars%2Dquotes?retryWrites=true&w=majority";

const { LocalStorage } = require('node-localstorage'),
    localStorage = new LocalStorage('./scratch');

const userNotVoted = localStorage.getItem('best_muscle_car_vote');


const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

client.connect(() => {
    const collection = client.db('classic-cars').collection('muscle-cars');

    app.listen(3000, () => {
        console.log('MongoDB is connected.\nExpress server is running');
    });

    app.get('/vote/:itemId', (req, res) => {
        collection.updateOne({
                itemId: req.params.itemId
            }, {
                $inc: {
                    votes: 1
                }
            })
            .then(result => {
                console.log(result);
                localStorage.setItem('best_muscle_car_vote', 'voted');
                collection.find().toArray()
                    .then(results => {
                        res.render('index.ejs', {
                            candidates: results,
                            notVoted: false
                        })
                    })
            })
            .catch(error => console.error(error));
    });

    app.get('/', (req, res) => {
        collection.find().toArray()
            .then(results => {
                res.render('index.ejs', {
                    candidates: results,
                    notVoted: true
                })
            })
    })
});