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
exports.getProductosDetalle = exports.obtenerProductosPorRubro = exports.getRubros = exports.getProductos = void 0;
const mysqldb_1 = require("../mysqldb");
const getProductos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mysqldb_1.cxMysql2.getConnection((err, connection) => {
            if (err) {
                return next(err);
            }
            connection.query('SELECT id, codigo, denominacion,precio FROM producto LIMIT 100', (err, results) => {
                connection.release();
                if (err) {
                    return next(err);
                }
                res.json(results);
            });
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProductos = getProductos;
const getRubros = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mysqldb_1.cxMysql2.getConnection((err, connection) => {
            if (err) {
                return next(err);
            }
            connection.query('SELECT * FROM rubro', (err, results) => {
                connection.release();
                if (err) {
                    return next(err);
                }
                res.json(results);
            });
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getRubros = getRubros;
const obtenerProductosPorRubro = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idRubro } = req.params;
    const values = [idRubro];
    try {
        mysqldb_1.cxMysql2.getConnection((err, connection) => {
            if (err) {
                return next(err);
            }
            const sql = 'SELECT id, codigo, denominacion,precio FROM producto WHERE idrubro= ? LIMIT 100';
            connection.query(sql, values, (err, results) => {
                connection.release();
                if (err) {
                    return next(err);
                }
                res.json(results);
            });
        });
    }
    catch (error) {
        next(error);
    }
});
exports.obtenerProductosPorRubro = obtenerProductosPorRubro;
const getProductosDetalle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const values = [productId];
    try {
        mysqldb_1.cxMysql2.getConnection((err, connection) => {
            if (err) {
                return next(err);
            }
            const sql = 'SELECT  p.id AS productoId,  p.codigo,p.denominacion AS productoDenominacion,  p.precio,  r.id AS rubroId, r.denominacion AS rubroDenominacion FROM  producto p  JOIN  rubro r ON r.id = p.idrubro WHERE p.id = ?; ';
            connection.query(sql, values, (err, results) => {
                connection.release();
                if (err) {
                    return next(err);
                }
                res.json(results);
            });
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProductosDetalle = getProductosDetalle;
