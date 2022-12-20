import express from 'express';
import mongoose, {ConnectOptions} from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';
import admin from './utils/config';
import authRoutes from './routes/authenticationRoutes';
import usersRoutes from './routes/usersRoutes';
import recaptchaRoutes from "./routes/recaptchaRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import imagesRoutes from "./routes/imagesRoutes";

const PORT = process.env.PORT || 5000;

const BASE_URL = "/api/v1"

console.log('BASE_HOST: ', process.env.BASE_HOST);

console.log('mongo db uri: ', process.env.MONGODB_URI)

if (process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions, () => {
    console.log("Database connection Success.");
})
else console.log('MONGO_URI is not valid. \n Process ended');

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

app.use( BASE_URL + "/authentication", authRoutes);
app.use( BASE_URL + "/users", usersRoutes);
app.use( BASE_URL + "/security", recaptchaRoutes);
app.use( BASE_URL + "/dashboard", dashboardRoutes);
app.use( BASE_URL + "/images", imagesRoutes);

/*
* usage from protected routes
* protected route: app.use( BASE_URL + "/protected-route", protectedRoutes, verifyIdToken);
* */

app.listen(PORT, () => {
    console.log("Server started listening on PORT : " + PORT);
});


export default app;
