import { Cliente } from "./Cliente";
import { DetalleVenta } from "./DetalleVenta";

export class PedidoVenta{

    id: number;
    cliente: Cliente;
    fechaPedido: Date;
    nroComprobante: number;
    formaPago: String;
    observaciones: String;
    totalPedido: number;
    detalles:DetalleVenta[];

    constructor(id: number, cliente: Cliente, fechaPedido: Date, nroComprobante: number, formaPago: String, observaciones: String, totalPedido: number, detalles: DetalleVenta[]){
        
        this.id=id;
        this.cliente=cliente;
        this.fechaPedido=fechaPedido;
        this.nroComprobante=nroComprobante;
        this.formaPago=formaPago;
        this.observaciones=observaciones;
        this.totalPedido=totalPedido;
        this.detalles=detalles;

    }
}