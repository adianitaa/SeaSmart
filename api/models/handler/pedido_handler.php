<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
 */
class PedidoHandler
{
    /*
     *   Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $fecha = null;
    protected $estado = null;
    protected $direccion = null;

    /*
     *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_pedido, fecha_pedido, estado_pedido,
                FROM pedidos
                INNER JOIN pedidos USING(id_pedido)
                WHERE id_pedido LIKE ? OR estado_pedido LIKE ?
                ORDER BY id_pedido';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_pedido, fecha_pedido, estado_pedido
                FROM pedidos
                INNER JOIN pedidos USING(id_pedido)
                ORDER BY id_pedido';
        return Database::getRows($sql);
    }

    public function readOrders()
    {
        $sql = 'SELECT id_pedido, estado_pedido, fecha_pedido, direccion
                FROM pedidos
                WHERE id_cliente = ?
                AND estado_pedido != "En carrito";';
        $params = array($_SESSION['idCliente']);
        return Database::getRows($sql, $params);
    }

    public function readOrdersMobile()
    {
        $sql = 'SELECT p.id_pedido, 
                p.estado_pedido, 
                DATE_FORMAT(p.fecha_pedido, "%d/%m/%Y") AS fecha_pedido, -- Sirve para el formato de fecha con plecas
                p.direccion, 
                SUM(dp.precio_producto * dp.cantidad_producto) AS precio_total
                FROM pedidos p
                INNER JOIN detalles_pedidos dp ON p.id_pedido = dp.id_pedido
                WHERE p.id_cliente = ?
                AND p.estado_pedido != "En carrito"
                GROUP BY p.id_pedido, 
                p.estado_pedido, 
                p.fecha_pedido, 
                p.direccion;';
            $params = array($_SESSION['idCliente']);
            $data = Database::getRows($sql, $params);

            // Sirve para redondear el total del pedido
            foreach ($data as &$row) {
            $row['precio_total'] = round($row['precio_total'], 2); // Redondea a 2 decimales
        }
        return $data;
    }

    public function readOne()
    {
        $sql = 'SELECT id_pedido, fecha_pedido, estado_pedido, id_direccion, id_cliente
                FROM pedidos
                WHERE id_pedido = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function getOrder()
    {
        $this->estado = 'En carrito';
        $sql = 'SELECT id_pedido
        FROM pedidos
        WHERE estado_pedido = ? AND id_cliente = ?';
        $params = array($this->estado, $_SESSION['idCliente']);
        if ($data = Database::getRow($sql, $params)) {
            $_SESSION['idPedido'] = $data['id_pedido'];
            return true;
        } else {
            return false;
        }
    }

    public function startOrder()
    {
        // Se verifica que exista un pedido con el estado 'En carrito'.
        if ($this->getOrder()) {
            return true;
        } else {
            // Si no existe un pedido con el estado 'En carrito' se crea el pedido.
            $sql = 'INSERT INTO pedidos (estado_pedido, id_cliente, fecha_pedido) VALUES("En carrito", ?, DATE(NOW()));';
            $params = array($_SESSION['idCliente']);
            // Se obtiene el ultimo valor insertado de la llave primaria en la tabla pedidos.
            if ($_SESSION['idPedido'] = Database::getLastRow($sql, $params)) {
                return true;
            } else {
                return false;
            }
        }
    }

    public function finishOrder()
    {
        $sql = 'UPDATE pedidos
                SET estado_pedido = "Siendo enviado", direccion = ?, fecha_pedido = DATE(NOW())
                WHERE id_pedido = (SELECT id_pedido FROM pedidos WHERE estado_pedido = "En carrito" AND id_cliente = ?);';
        $params = array($this->direccion, $_SESSION['idCliente']);
        return Database::executeRow($sql, $params);
    }

    //Función para obtener reporte de pedidos ordenados por estado
    public function getReportePedidosPorEstado()
    {
        $sql = 'SELECT p.id_pedido, p.fecha_pedido, p.estado_pedido, p.direccion, c.nombre_cliente, c.apellido_cliente, 
                (SELECT SUM(cantidad_producto) FROM detalles_pedidos WHERE id_pedido = p.id_pedido) as cantidad
                FROM pedidos p
                INNER JOIN clientes c ON p.id_cliente = c.id_cliente
                ORDER BY p.estado_pedido, p.fecha_pedido DESC;';
        return Database::getRows($sql);
    }

    //Función para el reporte de información de los clientes
    public function readByCliente($id_cliente)
    {
        $sql = 'SELECT id_pedido, fecha_pedido, estado_pedido, direccion
                FROM pedidos
                WHERE id_cliente = ?
                ORDER BY fecha_pedido DESC;';
        $params = array($id_cliente);
        return Database::getRows($sql, $params);
    }


    public function readCart()
    {
        $sql = 'SELECT id_detalle_pedido, detalles_productos.id_detalle_producto,  nombre_producto, cantidad_producto, detalles_pedidos.precio_producto, imagen_producto, existencia_producto, (SELECT COUNT(id_producto_talla) FROM detalles_productos WHERE detalles_productos.id_producto = productos.id_producto) AS talla, (SELECT COUNT(id_producto_color) FROM detalles_productos WHERE detalles_productos.id_producto = productos.id_producto) AS color, (CASE (SELECT COUNT(id_producto_color) FROM detalles_productos WHERE detalles_productos.id_producto = productos.id_producto) WHEN 0 THEN false ELSE (SELECT color_producto FROM productos_colores WHERE id_producto_color = detalles_productos.id_producto_color) END) AS color_producto, (CASE (SELECT COUNT(id_producto_talla) FROM detalles_productos WHERE detalles_productos.id_producto = productos.id_producto) WHEN 0 THEN false ELSE (SELECT talla FROM productos_tallas WHERE id_producto_talla = detalles_productos.id_producto_talla) END) AS talla_producto
                FROM detalles_pedidos
                INNER JOIN pedidos ON pedidos.id_pedido = detalles_pedidos.id_pedido
                INNER JOIN detalles_productos ON detalles_productos.id_detalle_producto = detalles_pedidos.id_detalle_producto
                INNER JOIN productos ON productos.id_producto = detalles_productos.id_producto
                WHERE id_cliente = ?
                AND estado_pedido = "En carrito";';
        $params = array($_SESSION['idCliente']);
        return Database::getRows($sql, $params);
    }
}
