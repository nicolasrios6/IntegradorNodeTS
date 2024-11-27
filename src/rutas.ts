import {Router} from 'express';
import {getClientes,getClienteId, getProductos} from "./controlador/CtrlCliente&Producto";
import {getPedidosVentas, getPedidosXId, getPedidosXComprobante,getPedidosXFechas, PostPedidoAlta,PutModificarPedido,DeletePedido,getDetalles,pedidosConDetalles,guardarPedido} from "./controlador/CtrPedidoVenta";



const router=Router();

router.get('/test', (requ, resp) => {resp.send('HOLA MUNDO')});

router.get('/obtenerPedidos', getPedidosVentas);
router.get('/obtenerPedidos/:idPedido', getPedidosXId);
router.get('/obtenerPedido/:comprobante', getPedidosXComprobante);
router.get('/obtenerPedidos/:fechaMin/:fechaMax', getPedidosXFechas);
router.post('/altaPedido', PostPedidoAlta);
router.post('/pedidosConDetalles', pedidosConDetalles);
router.put('/guardarPedido', guardarPedido);
router.put('/modificarPedido', PutModificarPedido);
router.delete('/Pedido/:idPedido', DeletePedido);

router.get('/obtenerDetalles/:idPedido', getDetalles);
// router.post('/altaDetalleVenta', PostDetalleVenta);

router.get('/Clientes/', getClientes);
router.get('/Clientes/:idCliente', getClienteId);

router.get('/Productos/', getProductos);

export default router;