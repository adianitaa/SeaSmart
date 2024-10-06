<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla VALORACIONES.
 */
class ValoracionHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $visibilidad = null;
    protected $comentario = null;
    protected $calificacion = null;
    protected $id_detalle_pedido = null;
    protected $id_producto = null;

    /*
     *  Métodos para realizar operaciones (search, read, update).
     */

    //Buscador de valoraciones
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_producto, nombre_producto, nombre_cliente
        FROM productos
        WHERE nombre_producto LIKE ? OR nombre_cliente LIKE ?
        ORDER BY nombre_producto';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT * FROM view_valoraciones ORDER BY fecha_valoracion ASC;';
        return Database::getRows($sql);
    }

    public function readAllAsc()
    {
        $sql = 'SELECT * FROM view_valoraciones ORDER BY fecha_valoracion DESC;';
        return Database::getRows($sql);
    }

    public function readOne($id_producto)
    {
        $sql = 'SELECT id_valoracion, fecha_valoracion, calificacion_producto, estado_comentario, productos.id_producto
                FROM valoraciones
                INNER JOIN detalles_pedidos ON detalles_pedidos.id_detalle_pedido = valoraciones.id_detalle_pedido
                INNER JOIN pedidos ON pedidos.id_pedido = detalles_pedidos.id_pedido
                INNER JOIN clientes ON clientes.id_cliente = pedidos.id_cliente
                INNER JOIN detalles_productos ON detalles_productos.id_detalle_producto = detalles_pedidos.id_detalle_producto
                INNER JOIN productos ON productos.id_producto = detalles_productos.id_producto
                WHERE productos.id_producto = ? AND clientes.id_cliente = ? AND estado_comentario = 1;';
        $params = array($id_producto, $_SESSION['idCliente']);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE valoraciones
                SET estado_comentario = ?
                WHERE id_valoracion = ?';
        $params = array($this->visibilidad, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function readComments()
    {
        $sql = 'SELECT nombre_cliente, apellido_cliente, calificacion_producto, fecha_valoracion, comentario_producto
                FROM valoraciones
                INNER JOIN detalles_pedidos ON detalles_pedidos.id_detalle_pedido = valoraciones.id_detalle_pedido
                INNER JOIN detalles_productos ON detalles_productos.id_detalle_producto = detalles_pedidos.id_detalle_producto
                INNER JOIN productos ON productos.id_producto = detalles_productos.id_producto
                INNER JOIN pedidos ON pedidos.id_pedido = detalles_pedidos.id_pedido
                INNER JOIN clientes ON clientes.id_cliente = pedidos.id_cliente
                WHERE estado_comentario = 1 AND productos.id_producto = ?;';
        $params = array($this->id_producto);
        return Database::getRows($sql, $params);
    }

    public function makeComment()
    {
        $sql = 'INSERT INTO valoraciones(fecha_valoracion, calificacion_producto, comentario_producto, id_detalle_pedido) 
                VALUES(NOW(), ?, ?, ?);';
        $params = array($this->calificacion, $this->comentario, $this->id_detalle_pedido);
        return Database::executeRow($sql, $params);
    }
}
