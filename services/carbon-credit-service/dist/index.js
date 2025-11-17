"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//index.ts
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const data_source_1 = require("./data-source");
const routes_1 = __importDefault(require("./routes"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3003;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// health
app.get('/health', (_, res) => res.json({ status: 'ok' }));
// routes
app.use('/', routes_1.default);
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
        console.log(`Carbon Credit Service running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Error during Data Source initialization', err);
});
