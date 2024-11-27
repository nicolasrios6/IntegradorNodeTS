import{Producto} from "./Producto"
import { PedidoVenta } from "./PedidoVenta";

export class DetalleVenta{

    id: number;
    pedidoventa?: PedidoVenta;
    producto: Producto;
    cantidad: String;
    subtotal: String;
    

    constructor(id: number, pedidoventa: PedidoVenta, producto: Producto, cantidad: String, subtotal: String){

        this.id=id;
        this.pedidoventa=pedidoventa;
        this.producto=producto;
        this.cantidad=cantidad;
        this.subtotal=subtotal;
    }
}