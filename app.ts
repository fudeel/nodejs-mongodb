import express from 'express';
import {connect, set} from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';
import admin from './utils/config';
import authRoutes from './routes/authenticationRoutes';
import dashboardRoutes from "./routes/dashboardRoutes";
import imagesRoutes from "./routes/imagesRoutes";
import {authenticationURL, BASE_URL, userURL} from "./utils/constants";
import userRoutes from "./routes/userRoutes";
import securityRoutes from "./routes/securityRoutes";

const PORT = process.env.PORT || 8000;

async function run() {
    /**
     * Connection to MongoDB instance by passing as params the mongo uri from environment
     * @param MONGODB_URI
     */
    await set('strictQuery', false);
    await connect(process.env.MONGODB_URI);
}

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

app.use( BASE_URL + authenticationURL, authRoutes);
app.use( BASE_URL + userURL, userRoutes);
app.use( BASE_URL + "/security", securityRoutes);
app.use( BASE_URL + "/dashboard", dashboardRoutes);
app.use( BASE_URL + "/images", imagesRoutes);

/*
* usage from protected routes
* protected route: app.use( BASE_URL + "/protected-route", protectedRoutes, verifyIdToken);
* */

app.listen(PORT, () => {
    console.log("Server started listening on PORT : " + PORT);

    run().then(() => {
        console.log('Connection to DB success');
    }).catch(err => {
        console.log('Error during DB connection: ', err);
    })
});


export default app;

