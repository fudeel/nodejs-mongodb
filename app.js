"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const authenticationRoutes_1 = __importDefault(require("./routes/authenticationRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const recaptchaRoutes_1 = __importDefault(require("./routes/recaptchaRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const imagesRoutes_1 = __importDefault(require("./routes/imagesRoutes"));
const PORT = process.env.PORT || 5000;
const BASE_URL = "/api/v1";
console.log('BASE_HOST: ', process.env.BASE_HOST);
if (process.env.MONGODB_URI)
    mongoose_1.default.connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, () => {
        console.log("Database connection Success.");
    });
else
    console.log('MONGO_URI is not valid. \n Process ended');
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/ping", (req, res) => {
    return res.send({
        error: false,
        message: "Server is healthy",
    });
});
app.use(BASE_URL + "/authentication", authenticationRoutes_1.default);
app.use(BASE_URL + "/users", usersRoutes_1.default);
app.use(BASE_URL + "/security", recaptchaRoutes_1.default);
app.use(BASE_URL + "/dashboard", dashboardRoutes_1.default);
app.use(BASE_URL + "/images", imagesRoutes_1.default);
/*
* usage from protected routes
* protected route: app.use( BASE_URL + "/protected-route", protectedRoutes, verifyIdToken);
* */
app.listen(PORT, () => {
    console.log("Server started listening on PORT : " + PORT);
});
exports.default = app;
