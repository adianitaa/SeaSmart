<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla DETALLES_PEDIDOS.
 */
class DetallesPedidosHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $cantidad_producto = null;
    protected $precio_producto = null;
    protected $id_pedido = null;
    protected $id_detalle_producto = null;
    protected $id_producto = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/detalles_productos/';

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function readOrderWithProduct()
    {
        $sql = 'SELECT nombre_cliente, cantidad_producto, detalles_pedidos.precio_producto, estado_pedido, productos.id_producto, pedidos.id_pedido, detalles_pedidos.id_detalle_pedido
                FROM detalles_pedidos
                INNER JOIN pedidos ON pedidos.id_pedido = detalles_pedidos.id_pedido
                INNER JOIN clientes ON clientes.id_cliente = pedidos.id_cliente
                INNER JOIN detalles_productos ON detalles_productos.id_detalle_producto = detalles_pedidos.id_detalle_producto
                INNER JOIN productos ON productos.id_producto = detalles_productos.id_producto
                WHERE productos.id_producto = ? AND clientes.id_cliente = ? AND estado_pedido = "Enviado";';
        $params = array($this->id_producto, $_SESSION['idCliente']);
        return Database::getRows($sql, $params);
    }

    public function readCartWithProduct()
    {
        $sql = 'SELECT nombre_cliente, cantidad_producto, detalles_pedidos.precio_producto, estado_pedido, productos.id_producto, pedidos.id_pedido, detalles_pedidos.id_detalle_pedido
                FROM detalles_pedidos
                INNER JOIN pedidos ON pedidos.id_pedido = detalles_pedidos.id_pedido
                INNER JOIN clientes ON clientes.id_cliente = pedidos.id_cliente
                INNER JOIN detalles_productos ON detalles_productos.id_detalle_producto = detalles_pedidos.id_detalle_producto
                INNER JOIN productos ON productos.id_producto = detalles_productos.id_producto
                WHERE productos.id_producto = ? AND clientes.id_cliente = ? AND estado_pedido = "En carrito";';
        $params = array($this->id_producto, $_SESSION['idCliente']);
        return Database::getRows($sql, $params);
    }

    public function readCartWithDetail()
    {
        $sql = 'SELECT id_detalle_pedido FROM detalles_pedidos
                INNER JOIN pedidos ON pedidos.id_pedido = detalles_pedidos.id_pedido
                WHERE id_detalle_producto = ?
                AND id_cliente = ?
                AND estado_pedido = "En carrito";';
        $params = array($this->id_detalle_producto, $_SESSION['idCliente']);
        return Database::getRow($sql, $params);
    }

    public function addDetail()
    {
        $sql = 'call agregarDetalle(?, ?, ?, ?);';
        $params = array($this->cantidad_producto, $this->precio_producto, $_SESSION['idPedido'], $this->id_detalle_producto);
        return Database::executeRow($sql, $params);
    }

    public function updateDetail()
    {
        $sql = 'call actualizarDetalle(?, ?, ?);';
        $params = array($this->cantidad_producto, $this->id_detalle_producto, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function removeDetail()
    {
        $sql = 'call removerDetalle(?, ?, ?);';
        $params = array($this->id, $this->id_detalle_producto, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    public function readCart()
    {
        $sql = 'SELECT detalles_productos.id_detalle_producto,  nombre_producto, cantidad_producto, detalles_pedidos.precio_producto, imagen_producto, detalles_productos.id_producto_talla, detalles_productos.id_producto_color, talla, color_producto, existencia_producto, id_detalle_pedido
                FROM detalles_pedidos
                INNER JOIN pedidos ON pedidos.id_pedido = detalles_pedidos.id_pedido
                INNER JOIN detalles_productos ON detalles_productos.id_detalle_producto = detalles_pedidos.id_detalle_producto
                INNER JOIN productos ON productos.id_producto = detalles_productos.id_producto
                INNER JOIN productos_tallas ON productos_tallas.id_producto_talla = detalles_productos.id_producto_talla
                INNER JOIN productos_colores ON productos_colores.id_producto_color = detalles_productos.id_producto_color
                WHERE id_cliente = ?
                AND estado_pedido = "En carrito";';
        $params = array($_SESSION['idCliente']);
        return Database::getRows($sql, $params);
    }

    public function readDetails()
    {
        $sql = 'SELECT detalles_pedidos.precio_producto, nombre_producto, cantidad_producto, imagen_producto, fecha_pedido, estado_pedido
                FROM detalles_pedidos
                INNER JOIN detalles_productos ON detalles_productos.id_detalle_producto = detalles_pedidos.id_detalle_producto
                INNER JOIN productos ON productos.id_producto = detalles_productos.id_producto
                INNER JOIN pedidos ON pedidos.id_pedido = detalles_pedidos.id_pedido
                WHERE detalles_pedidos.id_pedido = ?;';
        $params = array($this->id_pedido);
        return Database::getRows($sql, $params);
    }
}
