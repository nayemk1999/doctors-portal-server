const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(cors())
const {DB_USER, DB_PASS, DB_NAME} = process.env

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.xzc94.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useUnifiedTopology: true}, { useNewUrlParser: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1});
client.connect(err => {
    const appointmentCollection = client.db("doctorsPortal").collection("appointments");
    
    app.post('/addAppointment', (req, res) => {
        const appointment = req.body
        // console.log(appointment);
        appointmentCollection.insertOne(appointment)
            .then(result => {
               res.send(result.insertedCount > 0)
            })
            .catch(error=> console.log(error))
    })
    app.post('/appointmentsByDate', (req, res) => {
        const appointmentsByDate = req.body.date
        // console.log(appointmentsByDate);
        appointmentCollection.find({date: appointmentsByDate})
            .toArray((error, document) => {
                res.send(document);
            })
    })
    app.get('/allPatient', (req, res)=>{
        appointmentCollection.find({})
        .toArray((error, document)=>{
            res.send(document)
        })
    })
});


app.listen(3002)