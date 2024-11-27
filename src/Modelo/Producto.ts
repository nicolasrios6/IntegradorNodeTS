export class Producto{
    id: number;
    codigoProducto: String;
    denominacion: String;
    precioVenta: number;

    constructor(id: number, codigoProducto: String, denominacion: String, precioVenta: number){
        this.id=id;
        this.codigoProducto=codigoProducto;
        this.denominacion=denominacion;
        this.precioVenta=precioVenta;
    }
}