-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-10-2024 a las 01:16:55
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
-- Base de datos: `avijuelas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comida`
--

CREATE TABLE `comida` (
  `id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `id_saco` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comida`
--

INSERT INTO `comida` (`id`, `cantidad`, `fecha`, `hora`, `descripcion`, `id_saco`) VALUES
(3, 20, '2024-10-21', '15:43:59', 'dsa', 2),
(4, 10, '2024-10-21', '15:50:40', 'de', 2),
(5, 10, '2024-10-21', '16:18:29', 'dsa', 2),
(6, 5, '2024-10-21', '16:25:11', 'jj', 1),
(7, 5, '2024-10-21', '16:25:40', 'ghg', 1),
(8, 10, '2024-10-21', '21:23:30', 'none', 3),
(9, 30, '2024-10-21', '22:00:51', 'comedora', 5),
(10, 10, '2024-10-21', '23:08:55', 'Para ponedoras', 1);

--
-- Disparadores `comida`
--
DELIMITER $$
CREATE TRIGGER `after_insert_comida` AFTER INSERT ON `comida` FOR EACH ROW BEGIN
    UPDATE sacos_comida
    SET cantidad = cantidad - NEW.cantidad
    WHERE id = NEW.id_saco;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pollos`
--

CREATE TABLE `pollos` (
  `id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `tipo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pollos`
--

INSERT INTO `pollos` (`id`, `cantidad`, `fecha`, `hora`, `descripcion`, `tipo`) VALUES
(1, 10, '2024-10-21', '23:07:12', 'nuevas', 'comedores');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sacos_comida`
--

CREATE TABLE `sacos_comida` (
  `id` int(11) NOT NULL,
  `id_tipo` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `precio` int(11) NOT NULL,
  `proveedor` varchar(255) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha_compra` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sacos_comida`
--

INSERT INTO `sacos_comida` (`id`, `id_tipo`, `nombre`, `precio`, `proveedor`, `cantidad`, `fecha_compra`) VALUES
(1, 1, 'comida ponedora', 50000, 'avijuelas', 90, '2024-10-01'),
(2, 2, 'comida bkn', 50000, 'avijuelas', 10, '2024-10-01'),
(3, 2, 'comida no tan bkn', 50000, 'avijuelas', 15, '2024-10-01'),
(5, NULL, 'comida wena y', 50001, 'avijuelaZ', 100, '2024-10-01'),
(6, NULL, 'comida wena ', 300, 'avijuelas', 40, '2024-10-21');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comida`
--
ALTER TABLE `comida`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_saco_comida` (`id_saco`);

--
-- Indices de la tabla `pollos`
--
ALTER TABLE `pollos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sacos_comida`
--
ALTER TABLE `sacos_comida`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comida`
--
ALTER TABLE `comida`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `pollos`
--
ALTER TABLE `pollos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `sacos_comida`
--
ALTER TABLE `sacos_comida`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comida`
--
ALTER TABLE `comida`
  ADD CONSTRAINT `fk_saco_comida` FOREIGN KEY (`id_saco`) REFERENCES `sacos_comida` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
