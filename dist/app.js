"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const authenticationRoutes_1 = __importDefault(require("./routes/authenticationRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const imagesRoutes_1 = __importDefault(require("./routes/imagesRoutes"));
const constants_1 = require("./utils/constants");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const securityRoutes_1 = __importDefault(require("./routes/securityRoutes"));
const PORT = process.env.PORT || 8000;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * Connection to MongoDB instance by passing as params the mongo uri from environment
         * @param MONGODB_URI
         */
        yield (0, mongoose_1.set)('strictQuery', false);
        yield (0, mongoose_1.connect)(process.env.MONGODB_URI);
    });
}
run().then(() => {
    console.log('Connection to DB success');
}).catch(err => {
    console.log('Error during DB connection: ', err);
});
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
app.use(constants_1.BASE_URL + constants_1.authenticationURL, authenticationRoutes_1.default);
app.use(constants_1.BASE_URL + constants_1.userURL, userRoutes_1.default);
app.use(constants_1.BASE_URL + "/security", securityRoutes_1.default);
app.use(constants_1.BASE_URL + "/dashboard", dashboardRoutes_1.default);
app.use(constants_1.BASE_URL + "/images", imagesRoutes_1.default);
/*
* usage from protected routes
* protected route: app.use( BASE_URL + "/protected-route", protectedRoutes, verifyIdToken);
* */
app.listen(PORT, () => {
    console.log("Server started listening on PORT : " + PORT);
});
exports.default = app;
//# sourceMappingURL=app.js.map