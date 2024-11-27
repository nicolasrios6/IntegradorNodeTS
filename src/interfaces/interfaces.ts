export interface Cliente {
    id?: number; 
    cuit: string;
    razonSocial: string;
}

export interface Producto {
    id?: number;
    codigoProducto: string;
    denominacion: string;
    precioVenta: number;
}

export interface PedidoVentaDetalle {
    id?: number;
    cantidad: number;
    subtotal: number;
    pedidoVenta?: PedidoVentaInt; 
    producto: Producto; 
}

export interface PedidoVentaInt {
    id?: number;
    fechaPedido: Date;
    nroComprobante: number;
    formaPago: string;
    observaciones: string;
    totalPedido: number;
    cliente: Cliente; 
    detalles: PedidoVentaDetalle[]; 
}
