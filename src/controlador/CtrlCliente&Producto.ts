import { Request, Response, NextFunction } from "express";
import { cxMysql2 } from "../mysqldb";
import { Cliente } from "../Modelo/Cliente";
import { Producto } from "../Modelo/Producto";

export const getClientes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const connection = await cxMysql2.promise().getConnection();
        try {
            const [results] = await connection.query('SELECT * FROM cliente');
            const clientes = results as Cliente[]; 
            res.json(clientes);
        } finally {
            connection.release(); 
        }
    } catch (error) {
        next(error);
    }
};


export const getClienteId = async (req: Request, res: Response, next: NextFunction) => {
    const idCliente = req.params.idCliente;
    try {
        const connection = await cxMysql2.promise().getConnection();
        try {
            const [results] = await connection.query('SELECT * FROM cliente WHERE id = ?', [idCliente]);
            const cliente = results as Cliente[]; 
            if (cliente.length === 0) {
                res.status(404).json({ message: "Cliente no encontrado" });
            } else {
                res.json(cliente[0]); 
            }
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};

export const getProductos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const connection = await cxMysql2.promise().getConnection();
        try {
            const [results] = await connection.query('SELECT * FROM producto');
            const productos = results as Producto[]; 
            res.json(productos);
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};
