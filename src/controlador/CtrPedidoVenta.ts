import { Request, Response, NextFunction } from "express";
import { PedidoVenta } from "../Modelo/PedidoVenta";
import { DetalleVenta } from "../Modelo/DetalleVenta";
import { Cliente, Producto,PedidoVentaDetalle,PedidoVentaInt} from "../interfaces/interfaces";
import { cxMysql2 } from "../mysqldb";
import { ResultSetHeader ,FieldPacket} from 'mysql2';

export const getPedidosVentas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const connection = await cxMysql2.promise().getConnection();
        try {
            const [pedidoResults] = await connection.query(
                `SELECT pv.id AS pedidoId, pv.fechaPedido, pv.nroComprobante, pv.formaPago, pv.observaciones, pv.totalPedido, 
                        c.id AS clienteId, c.razonSocial AS clienteRazonSocial, c.cuit AS clienteCuit
                 FROM pedido_venta pv 
                 LEFT JOIN cliente c ON pv.idCliente = c.id 
                 WHERE pv.borrada = 0`
            );

            const [detalleResults] = await connection.query(
                `SELECT pvd.idPedidoVenta AS pedidoId, pvd.cantidad, pvd.subtotal, 
                        p.id AS productoId, p.denominacion AS productoDenominacion, p.precioVenta AS productoPrecioVenta
                 FROM pedido_venta_detalle pvd 
                 LEFT JOIN producto p ON pvd.idProducto = p.id WHERE pvd.borrada=0`
            );

            const pedidosMap: Record<number, PedidoVenta> = {};

            (pedidoResults as any[]).forEach((pedidoRow) => {
                pedidosMap[pedidoRow.pedidoId] = {
                    id: pedidoRow.pedidoId,
                    cliente: {
                        id: pedidoRow.clienteId,
                        razonSocial: pedidoRow.clienteRazonSocial,
                        cuit: pedidoRow.clienteCuit,
                    },
                    fechaPedido: pedidoRow.fechaPedido,
                    nroComprobante: pedidoRow.nroComprobante,
                    formaPago: pedidoRow.formaPago,
                    observaciones: pedidoRow.observaciones,
                    totalPedido: pedidoRow.totalPedido,
                    detalles: [],
                };
            });

            (detalleResults as any[]).forEach((detalleRow) => {
                const pedido = pedidosMap[detalleRow.pedidoId];
                if (pedido) {
                    pedido.detalles.push({
                        cantidad: detalleRow.cantidad,
                        subtotal: detalleRow.subtotal,
                        producto: {
                            id: detalleRow.productoId,
                            denominacion: detalleRow.productoDenominacion,
                            precioVenta: detalleRow.productoPrecioVenta,
                            codigoProducto: detalleRow.productoCodigoProducto
                        },
                        id: 0,
                        pedidoventa: undefined
                    });
                }
            });

            const pedidos = Object.values(pedidosMap);
            res.json(pedidos);
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};

export const getPedidosXId = async (req: Request, res: Response, next: NextFunction) => {
    const { idPedido } = req.params;

    try {
        const connection = await cxMysql2.promise().getConnection();
        try {
            const [pedidoResults] = await connection.query<any[]>(
                `SELECT pv.id, pv.fechaPedido, pv.nroComprobante, pv.formaPago, pv.observaciones, pv.totalPedido, 
                        c.id AS clienteId, c.razonSocial AS clienteRazonSocial, c.cuit AS clienteCuit
                 FROM pedido_venta pv 
                 LEFT JOIN cliente c ON pv.idCliente = c.id 
                 WHERE pv.id = ? AND pv.borrada = 0`,
                [idPedido]
            );

            if (pedidoResults.length === 0) {
                res.status(404).json({ message: "Pedido no encontrado" });
                return;
            }

            const pedido: PedidoVentaInt = {
                id: pedidoResults[0].id,
                fechaPedido: pedidoResults[0].fechaPedido,
                nroComprobante: pedidoResults[0].nroComprobante,
                formaPago: pedidoResults[0].formaPago,
                observaciones: pedidoResults[0].observaciones,
                totalPedido: pedidoResults[0].totalPedido,
                cliente: {
                    id: pedidoResults[0].clienteId,
                    razonSocial: pedidoResults[0].clienteRazonSocial,
                    cuit: pedidoResults[0].clienteCuit,
                },
                detalles: [],
            };

            const [detalleResults] = await connection.query<any[]>(
                `SELECT pvd.id AS detalleId, pvd.cantidad, pvd.subtotal, 
                        p.id AS productoId, p.codigoProducto, p.denominacion, p.precioVenta
                 FROM pedido_venta_detalle pvd 
                 LEFT JOIN producto p ON pvd.idProducto = p.id 
                 WHERE pvd.idPedidoVenta = ? AND pvd.borrada=0`,
                [idPedido]
            );
            pedido.detalles = detalleResults.map((detalleRow) => ({
                id: detalleRow.detalleId,
                cantidad: detalleRow.cantidad,
                subtotal: detalleRow.subtotal,
                producto: {
                    id: detalleRow.productoId,
                    codigoProducto: detalleRow.codigoProducto,
                    denominacion: detalleRow.denominacion,
                    precioVenta: detalleRow.precioVenta,
                },
            }));

            res.json(pedido);
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};


export const getPedidosXComprobante = async (req: Request, res: Response, next: NextFunction) => {
    const { comprobante } = req.params;
    try {
        const connection = await cxMysql2.promise().getConnection();
        try {
            const [pedidoResults] = await connection.query(
                `SELECT pv.id AS pedidoId, pv.fechaPedido, pv.nroComprobante, pv.formaPago, pv.observaciones, pv.totalPedido,
                        c.id AS clienteId, c.razonSocial AS clienteRazonSocial, c.cuit AS clienteCuit
                 FROM pedido_venta pv
                 LEFT JOIN cliente c ON pv.idCliente = c.id
                 WHERE pv.nroComprobante = ? AND pv.borrada = 0`,
                [comprobante]
            );

            if ((pedidoResults as any[]).length === 0) {
                res.status(404).json({ message: "Pedido no encontrado" });
                return;
            }

            const pedidosMap: Record<number, PedidoVenta> = {};

            (pedidoResults as any[]).forEach((pedidoRow) => {
                pedidosMap[pedidoRow.pedidoId] = {
                    id: pedidoRow.pedidoId,
                    cliente: {
                        id: pedidoRow.clienteId,
                        razonSocial: pedidoRow.clienteRazonSocial,
                        cuit: pedidoRow.clienteCuit,
                    },
                    fechaPedido: pedidoRow.fechaPedido,
                    nroComprobante: pedidoRow.nroComprobante,
                    formaPago: pedidoRow.formaPago,
                    observaciones: pedidoRow.observaciones,
                    totalPedido: pedidoRow.totalPedido,
                    detalles: [],
                };
            });

            const [detalleResults] = await connection.query(
                `SELECT pvd.idPedidoVenta AS pedidoId, pvd.cantidad, pvd.subtotal,
                        p.id AS productoId, p.denominacion AS productoDenominacion, p.precioVenta AS productoPrecioVenta
                 FROM pedido_venta_detalle pvd
                 LEFT JOIN producto p ON pvd.idProducto = p.id
                 WHERE pvd.idPedidoVenta IN (?) AND pvd.borrada=0`,
                [Object.keys(pedidosMap)]
            );

            (detalleResults as any[]).forEach((detalleRow) => {
                const pedido = pedidosMap[detalleRow.pedidoId];
                if (pedido) {
                    pedido.detalles.push({
                        cantidad: detalleRow.cantidad,
                        subtotal: detalleRow.subtotal,
                        producto: {
                            id: detalleRow.productoId,
                            denominacion: detalleRow.productoDenominacion,
                            precioVenta: detalleRow.productoPrecioVenta,
                            codigoProducto: detalleRow.productoCodigoProducto
                        },
                        id: 0
                    });
                }
            });

            const pedidos = Object.values(pedidosMap);

            res.json(pedidos);
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};

export const getPedidosXFechas = async (req: Request, res: Response, next: NextFunction) => {
    const { fechaMin, fechaMax } = req.params;
    try {
        const connection = await cxMysql2.promise().getConnection();
        try {
            const [results] = await connection.query(
                `SELECT pv.id, pv.fechaPedido, pv.nroComprobante, pv.formaPago, pv.observaciones, pv.totalPedido, 
                        c.id AS clienteId, c.razonSocial AS clienteRazonSocial, c.cuit AS clienteCuit
                 FROM pedido_venta pv 
                 LEFT JOIN cliente c ON pv.idCliente = c.id 
                 WHERE pv.fechaPedido BETWEEN ? AND ? AND pv.borrada = 0`,
                [fechaMin, fechaMax]
            );

            const pedidos = (results as any[]).map((pedidoRow) => ({
                id: pedidoRow.id,
                cliente: {
                    id: pedidoRow.clienteId,
                    razonSocial: pedidoRow.clienteRazonSocial,
                    cuit: pedidoRow.clienteCuit,
                },
                fechaPedido: pedidoRow.fechaPedido,
                nroComprobante: pedidoRow.nroComprobante,
                formaPago: pedidoRow.formaPago,
                observaciones: pedidoRow.observaciones,
                totalPedido: pedidoRow.totalPedido,
                detalles: [],
            }));

            res.json(pedidos);
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};

export const PostPedidoAlta = async (req: Request, res: Response, next: NextFunction) => {
    const pedidoVenta: PedidoVenta = req.body;

    if (!pedidoVenta.fechaPedido || !pedidoVenta.nroComprobante || !pedidoVenta.formaPago || !pedidoVenta.totalPedido || !pedidoVenta.cliente) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    try {
        const connection = await cxMysql2.promise().getConnection();
        try {
            const [results] = await connection.query<ResultSetHeader>(
                'INSERT INTO pedido_venta (fechaPedido, nroComprobante, formaPago, observaciones, totalPedido, idCliente) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    pedidoVenta.fechaPedido,
                    pedidoVenta.nroComprobante,
                    pedidoVenta.formaPago,
                    pedidoVenta.observaciones,
                    pedidoVenta.totalPedido,
                    pedidoVenta.cliente.id
                ]
            );

            const pedidoId = results.insertId;

            res.json({
                message: "Pedido creado exitosamente",
                id: pedidoId,
                pedido: {
                    ...pedidoVenta,
                    id: pedidoId,
                }
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};

export const pedidosConDetalles = async (req: Request, res: Response, next: NextFunction) => {
    const pedidoVenta: PedidoVenta = req.body;

    if (!pedidoVenta || !pedidoVenta.detalles || pedidoVenta.detalles.length === 0) {
        return res.status(400).json({ error: "Datos incompletos o detalles vacíos" });
    }

    try {
        const connection = await cxMysql2.promise().getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.query<ResultSetHeader>(
                'INSERT INTO pedido_venta (fechaPedido, nroComprobante, formaPago, observaciones, totalPedido, idCliente) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    pedidoVenta.fechaPedido,
                    pedidoVenta.nroComprobante,
                    pedidoVenta.formaPago,
                    pedidoVenta.observaciones,
                    pedidoVenta.totalPedido,
                    pedidoVenta.cliente.id
                ]
            );

            const pedidoId = result.insertId;

            const detalleValues = pedidoVenta.detalles.map((detalle) => [
                detalle.cantidad,
                detalle.subtotal,
                pedidoId,
                detalle.producto.id
            ]);

            await connection.query(
                'INSERT INTO pedido_venta_detalle (cantidad, subtotal, idPedidoVenta, idProducto) VALUES ?',
                [detalleValues]
            );

            await connection.commit();

            res.json({
                message: "Pedido y detalles guardados exitosamente",
                pedido: {
                    ...pedidoVenta,
                    id: pedidoId,
                }
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};

export const guardarPedido = async (req: Request, res: Response, next: NextFunction) => {
    const pedidoVenta: PedidoVentaInt = req.body;

    if (!pedidoVenta || !pedidoVenta.detalles || pedidoVenta.detalles.length === 0) {
        return res.status(400).json({ error: "Datos incompletos o detalles vacíos" });
    }

    try {
        const connection = await cxMysql2.promise().getConnection();
        try {
            await connection.beginTransaction();

            await connection.query(
                `UPDATE pedido_venta 
                 SET fechaPedido = ?, nroComprobante = ?, formaPago = ?, observaciones = ?, totalPedido = ?, idCliente = ? 
                 WHERE id = ?`,
                [
                    pedidoVenta.fechaPedido,
                    pedidoVenta.nroComprobante,
                    pedidoVenta.formaPago,
                    pedidoVenta.observaciones,
                    pedidoVenta.totalPedido,
                    pedidoVenta.cliente.id,
                    pedidoVenta.id
                ]
            );

            const [detallesActuales] = await connection.query<any[]>(
                'SELECT id FROM pedido_venta_detalle WHERE idPedidoVenta = ? AND borrada = 0',
                [pedidoVenta.id]
            );

            const idsDetallesActuales = detallesActuales.map(d => d.id);
            const idsDetallesNuevos = pedidoVenta.detalles
                .filter(d => d.id)
                .map(d => d.id);

            const detallesParaBorrar = idsDetallesActuales.filter(id => !idsDetallesNuevos.includes(id));
            if (detallesParaBorrar.length > 0) {
                await connection.query(
                    'UPDATE pedido_venta_detalle SET borrada = 1 WHERE id IN (?)',
                    [detallesParaBorrar]
                );
            }

            for (const detalle of pedidoVenta.detalles) {
                if (detalle.id) {
                    await connection.query(
                        `UPDATE pedido_venta_detalle 
                         SET cantidad = ?, subtotal = ?, idProducto = ?, borrada = 0
                         WHERE id = ? AND idPedidoVenta = ?`,
                        [
                            detalle.cantidad,
                            detalle.subtotal,
                            detalle.producto.id,
                            detalle.id,
                            pedidoVenta.id
                        ]
                    );
                } else {
                    await connection.query(
                        `INSERT INTO pedido_venta_detalle 
                         (cantidad, subtotal, idPedidoVenta, idProducto, borrada) 
                         VALUES (?, ?, ?, ?, 0)`,
                        [
                            detalle.cantidad,
                            detalle.subtotal,
                            pedidoVenta.id,
                            detalle.producto.id
                        ]
                    );
                }
            }

            await connection.commit();

            res.json({
                message: "Pedido y detalles actualizados exitosamente",
                pedido: pedidoVenta
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};


export const PutModificarPedido = async (req: Request, res: Response, next: NextFunction) => {
    const pedidoVenta: PedidoVenta = req.body;

    if (!pedidoVenta.id || !pedidoVenta.fechaPedido || !pedidoVenta.nroComprobante || !pedidoVenta.formaPago || !pedidoVenta.totalPedido || !pedidoVenta.cliente) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    try {
        const connection = await cxMysql2.promise().getConnection();
        try {
            const [results] = await connection.query<ResultSetHeader>(
                'UPDATE pedido_venta SET fechaPedido = ?, nroComprobante = ?, formaPago = ?, observaciones = ?, totalPedido = ?, idCliente = ? WHERE id = ?',
                [
                    pedidoVenta.fechaPedido,
                    pedidoVenta.nroComprobante,
                    pedidoVenta.formaPago,
                    pedidoVenta.observaciones,
                    pedidoVenta.totalPedido,
                    pedidoVenta.cliente.id,
                    pedidoVenta.id
                ]
            );

            res.json({
                message: "Pedido actualizado exitosamente",
                affectedRows: results.affectedRows,
                pedido: pedidoVenta
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};

export const DeletePedido = async (req: Request, res: Response, next: NextFunction) => {
    const { idPedido } = req.params;

    try {
        const connection = await cxMysql2.promise().getConnection();
        try {
            await connection.beginTransaction();

            const [pedidoResults] = await connection.query<ResultSetHeader>(
                'UPDATE pedido_venta SET borrada = 1 WHERE id = ?',
                [idPedido]
            );

            if (pedidoResults.affectedRows === 0) {
                await connection.rollback();
                res.status(404).json({ message: "Pedido no encontrado" });
                return;
            }

            const [detalleResults] = await connection.query<ResultSetHeader>(
                'UPDATE pedido_venta_detalle SET borrada = 1 WHERE idPedidoVenta = ?',
                [idPedido]
            );

            await connection.commit();

            res.json({
                message: "Pedido y detalles asociados eliminados exitosamente",
                affectedRows: {
                    pedidos: pedidoResults.affectedRows,
                    detalles: detalleResults.affectedRows
                }
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};


export const getDetalles = async (req: Request, res: Response, next: NextFunction) => {
    const { idPedido } = req.params;

    try {
        const connection = await cxMysql2.promise().getConnection();
        try {
            const [results] = await connection.query(
                `SELECT pv.cantidad, pv.subtotal, 
                        p.id AS productoId, p.denominacion AS productoDenominacion, p.precioVenta AS productoPrecioVenta
                 FROM pedido_venta_detalle pv 
                 LEFT JOIN producto p ON pv.idProducto = p.id 
                 WHERE pv.idPedidoVenta = ? AND pv.borrada=0`,
                [idPedido]
            );

            const detalles = (results as any[]).map((detalleRow) => ({
                cantidad: detalleRow.cantidad,
                subtotal: detalleRow.subtotal,
                producto: {
                    id: detalleRow.productoId,
                    denominacion: detalleRow.productoDenominacion,
                    precioVenta: detalleRow.productoPrecioVenta,
                },
            }));

            res.json(detalles);
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};
