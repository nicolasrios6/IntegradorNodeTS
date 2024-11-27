"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cxMysql2 = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
exports.cxMysql2 = mysql2_1.default.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Parcial2Labo',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
