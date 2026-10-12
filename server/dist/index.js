"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_js_1 = require("./app.js");
const PORT = process.env.PORT || 5000;
app_js_1.app.listen(PORT, () => {
    console.log(`Craigslist Redesign API server running on http://localhost:${PORT}`);
});
