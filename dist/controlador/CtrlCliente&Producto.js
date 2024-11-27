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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductos = exports.getClienteId = exports.getClientes = void 0;
const mysqldb_1 = require("../mysqldb");
const getClientes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mysqldb_1.cxMysql2.promise().getConnection();
        try {
            const [results] = yield connection.query('SELECT * FROM cliente');
            const clientes = results;
            res.json(clientes);
        }
        finally {
            connection.release();
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getClientes = getClientes;
const getClienteId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const idCliente = req.params.idCliente;
    try {
        const connection = yield mysqldb_1.cxMysql2.promise().getConnection();
        try {
            const [results] = yield connection.query('SELECT * FROM cliente WHERE id = ?', [idCliente]);
            const cliente = results;
            if (cliente.length === 0) {
                res.status(404).json({ message: "Cliente no encontrado" });
            }
            else {
                res.json(cliente[0]);
            }
        }
        finally {
            connection.release();
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getClienteId = getClienteId;
const getProductos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mysqldb_1.cxMysql2.promise().getConnection();
        try {
            const [results] = yield connection.query('SELECT * FROM producto');
            const productos = results;
            res.json(productos);
        }
        finally {
            connection.release();
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getProductos = getProductos;
