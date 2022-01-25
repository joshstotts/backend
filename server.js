//////////////////////////
// DEPENDENCIES
//////////////////////////
require("dotenv").config();
const {port=4000, MONGODB_URL} = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require('morgan');
const cors = require('cors');

//////////////////////////
// DATABASE CONNECTION
//////////////////////////
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});
// connection events
const db = mongoose.connection;
    db.on("open", () => console.log("Connected to MongoDB"));
    db.on("close", () => console.log("disconnected"));
    db.on("error", (error) => console.log("ERROR"));

// set up peopl model
const peopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
}, {timestamps: true});

const People = mongoose.model('People', peopleSchema);

// MOUNT MIDDLEWARE
app.use(express.json()); // this creates req.body using incoming JSON from our requests
app.use(morgan('dev'));
app.use(cors()); 

//////////////////////////
// ROUTES
//////////////////////////
// create a test route
app.get('/', (req, res) => {
    res.send("Hi everybody");
});

// people index
app.get('/people', async (req, res) => {
    try {
        //send all people
        res.json(await People.find({}));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

// people delete
app.delete('/people/:id', async (req, res) => {
    try {
        //send all people
        res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

// people update
app.put('/people/:id', async(req, res) => {
    try {
        // send all people
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

// people create
app.post('/people', async (req, res) => {
    try {
        //send all people
        res.json(await People.create(req.body));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});









//////////////////////////
// LISTENER
//////////////////////////
app.listen(port, () => console.log(`Listening on port: ${port}`));