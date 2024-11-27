-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-11-2024 a las 22:28:03
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `parcial2labo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id` int(11) NOT NULL,
  `cuit` varchar(20) NOT NULL,
  `razonSocial` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id`, `cuit`, `razonSocial`) VALUES
(1, '20-12345678-0', 'Comercial Los Andes SA'),
(2, '27-98765432-1', 'Distribuidora del Sur SRL'),
(3, '30-45678912-3', 'Supermercados Norte SA'),
(4, '23-78912345-4', 'Almacén El Sol'),
(5, '24-32165498-5', 'Mayorista Central LTDA'),
(6, '25-74185296-6', 'Autoservicio La Estrella'),
(7, '26-95175384-7', 'Comercial San Martín'),
(8, '27-15935785-8', 'Distribuidora El Paso'),
(9, '28-75395145-9', 'Mercado La Plaza'),
(10, '29-85274196-0', 'Minimercado El Ahorro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_venta`
--

CREATE TABLE `pedido_venta` (
  `id` int(11) NOT NULL,
  `idCliente` int(11) NOT NULL,
  `fechaPedido` date NOT NULL,
  `nroComprobante` int(11) NOT NULL,
  `formaPago` varchar(50) NOT NULL,
  `observaciones` text DEFAULT NULL,
  `totalPedido` decimal(10,2) NOT NULL,
  `borrada` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `pedido_venta`
--

INSERT INTO `pedido_venta` (`id`, `idCliente`, `fechaPedido`, `nroComprobante`, `formaPago`, `observaciones`, `totalPedido`, `borrada`) VALUES
(7, 5, '2024-11-26', 1212, 'Efectivo', '-', 11993.00, 1),
(8, 4, '2024-11-22', 1231, 'Tarjeta', '-', 2602.50, 1),
(9, 8, '2024-11-19', 12345, 'Efectivo', '-', 4452.50, 1),
(10, 5, '2024-11-27', 1111, 'Efectivo', '-', 4250.00, 1),
(11, 8, '2024-11-26', 1122, 'Transferencia', '-', 11061.50, 1),
(12, 2, '2024-11-26', 11, 'Tarjeta', '-', 6150.50, 0),
(13, 6, '2024-11-12', 113, 'Tarjeta', '-', 9636.50, 0),
(14, 10, '2024-11-18', 114, 'Transferencia', '-', 2731.25, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido_venta_detalle`
--

CREATE TABLE `pedido_venta_detalle` (
  `id` int(11) NOT NULL,
  `idPedidoVenta` int(11) NOT NULL,
  `idProducto` int(11) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `borrada` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `pedido_venta_detalle`
--

INSERT INTO `pedido_venta_detalle` (`id`, `idPedidoVenta`, `idProducto`, `cantidad`, `subtotal`, `borrada`) VALUES
(26, 7, 7, 3.00, 1561.50, 1),
(27, 7, 7, 3.00, 1561.50, 1),
(28, 7, 12, 3.00, 1140.00, 1),
(29, 8, 3, 1.00, 600.75, 1),
(30, 8, 6, 2.00, 1160.00, 1),
(31, 8, 9, 5.00, 12500.00, 1),
(32, 8, 3, 1.00, 600.75, 1),
(33, 8, 9, 5.00, 12500.00, 1),
(34, 8, 7, 5.00, 2602.50, 1),
(35, 9, 10, 5.00, 4452.50, 1),
(36, 9, 4, 3.00, 2250.00, 1),
(37, 9, 10, 5.00, 4452.50, 1),
(38, 10, 1, 5.00, 4250.00, 1),
(39, 10, 19, 3.00, 1440.00, 1),
(40, 11, 18, 2.00, 4401.50, 1),
(41, 11, 11, 4.00, 1803.00, 1),
(42, 11, 9, 3.00, 7500.00, 1),
(43, 11, 19, 7.00, 3360.00, 1),
(44, 11, 1, 1.00, 850.00, 1),
(45, 11, 15, 1.00, 420.00, 1),
(46, 11, 19, 13.00, 6240.00, 1),
(47, 12, 1, 2.00, 1700.00, 0),
(48, 12, 16, 1.00, 2800.00, 1),
(49, 12, 17, 1.00, 1950.50, 0),
(50, 12, 9, 1.00, 2500.00, 0),
(51, 12, 4, 2.00, 1500.00, 1),
(52, 13, 10, 1.00, 890.50, 0),
(53, 13, 9, 1.00, 2500.00, 0),
(54, 13, 8, 2.00, 761.50, 1),
(55, 13, 7, 12.00, 6246.00, 0),
(56, 14, 14, 1.00, 950.25, 1),
(57, 14, 13, 2.00, 1361.00, 1),
(58, 14, 15, 1.00, 420.00, 1),
(59, 12, 4, 1.00, 750.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` int(11) NOT NULL,
  `codigoProducto` varchar(50) NOT NULL,
  `denominacion` varchar(100) NOT NULL,
  `precioVenta` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `codigoProducto`, `denominacion`, `precioVenta`) VALUES
(1, 'ALM001', 'Arroz Largo Fino 1kg', 850.00),
(2, 'ALM002', 'Aceite Girasol 1L', 1200.50),
(3, 'ALM003', 'Azúcar Refinada 1kg', 600.75),
(4, 'BEB001', 'Gaseosa Cola 2.25L', 750.00),
(5, 'BEB002', 'Agua Mineral 2L', 450.25),
(6, 'BEB003', 'Jugo Naranja 1L', 580.00),
(7, 'LAC001', 'Leche Entera 1L', 520.50),
(8, 'LAC002', 'Yogur Natural 500g', 380.75),
(9, 'LAC003', 'Queso Cremoso 1kg', 2500.00),
(10, 'PAN001', 'Pan Lactal Blanco', 890.50),
(11, 'PAN002', 'Galletitas Dulces 300g', 450.75),
(12, 'PAN003', 'Tostadas Integrales', 380.00),
(13, 'LIMP001', 'Detergente 750ml', 680.50),
(14, 'LIMP002', 'Jabón en Polvo 800g', 950.25),
(15, 'LIMP003', 'Lavandina 1L', 420.00),
(16, 'CARN001', 'Carne Molida 1kg', 2800.00),
(17, 'CARN002', 'Pollo Entero', 1950.50),
(18, 'CARN003', 'Cerdo Costillas 1kg', 2200.75),
(19, 'VERD001', 'Papas 1kg', 480.00),
(20, 'VERD002', 'Tomates 1kg', 750.50),
(21, 'VERD003', 'Cebollas 1kg', 390.25),
(22, 'PERE001', 'Shampoo 400ml', 1200.00),
(23, 'PERE002', 'Jabón de Tocador', 280.50),
(24, 'PERE003', 'Papel Higiénico x4', 850.75),
(25, 'CONG001', 'Hamburguesas x4', 1500.00),
(26, 'CONG002', 'Papas Fritas 1kg', 980.50),
(27, 'CONG003', 'Helado 1L', 1800.75),
(28, 'SNACK001', 'Papas Fritas 150g', 580.00),
(29, 'SNACK002', 'Maní Salado 100g', 350.50),
(30, 'SNACK003', 'Nachos 200g', 480.25);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedido_venta`
--
ALTER TABLE `pedido_venta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idCliente` (`idCliente`);

--
-- Indices de la tabla `pedido_venta_detalle`
--
ALTER TABLE `pedido_venta_detalle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPedidoVenta` (`idPedidoVenta`),
  ADD KEY `idProducto` (`idProducto`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `pedido_venta`
--
ALTER TABLE `pedido_venta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `pedido_venta_detalle`
--
ALTER TABLE `pedido_venta_detalle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pedido_venta`
--
ALTER TABLE `pedido_venta`
  ADD CONSTRAINT `pedido_venta_ibfk_1` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`id`);

--
-- Filtros para la tabla `pedido_venta_detalle`
--
ALTER TABLE `pedido_venta_detalle`
  ADD CONSTRAINT `pedido_venta_detalle_ibfk_1` FOREIGN KEY (`idPedidoVenta`) REFERENCES `pedido_venta` (`id`),
  ADD CONSTRAINT `pedido_venta_detalle_ibfk_2` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
