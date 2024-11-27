"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetalleVenta = void 0;
class DetalleVenta {
    constructor(id, pedidoventa, producto, cantidad, subtotal) {
        this.id = id;
        this.pedidoventa = pedidoventa;
        this.producto = producto;
        this.cantidad = cantidad;
        this.subtotal = subtotal;
    }
}
exports.DetalleVenta = DetalleVenta;
