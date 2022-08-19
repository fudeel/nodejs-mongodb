const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cors = require('cors');
const admin = require('firebase-admin');


let serviceAccount = require('./service_account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


require("dotenv").config();
const PORT = process.env.PORT || 5000;

const authRoutes = require("./routes/users");
const matchRoutes = require("./routes/matches");

const BASE_URL = "/api/v1"

console.log('BASE_HOST: ', process.env.BASE_HOST);

mongoose
    .connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database connection Success.");
    })
    .catch((err) => {
        console.error("Mongo Connection Error", err);
    });

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
    return res.send({
        error: false,
        message: "Server is healthy",
    });
});




function verifyIdToken(req, res, next) {
    let idToken = req.headers.idtoken;

    console.log('request headers: ', req.headers);

    console.log('token: ', idToken);
    console.log('token: ', idToken);
    console.log('token: ', idToken);
    console.log('token: ', idToken);

    return admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            console.log({'Decoded token': decodedToken, 'uid': uid});
            next();

        })
        .catch((err) => {
            console.log('error: ', err);
            next();
        })
}

app.use( BASE_URL + "/users", authRoutes);
app.use( BASE_URL + "/matches", matchRoutes, verifyIdToken);

app.listen(PORT, () => {
    console.log("Server started listening on PORT : " + PORT);
});
