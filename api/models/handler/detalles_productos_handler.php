<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla DETALLES_PRODUCTOS.
 */
class DetallesProductosHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $id_color = null;
    protected $id_talla = null;
    protected $id_producto = null;
    protected $imagen = null;
    protected $estado = null;
    protected $existencia = null;


    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/detalles_productos/';

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function readAll()
    {
        $sql = 'SELECT id_detalle_producto, productos_colores.id_producto_color, productos_tallas.id_producto_talla, productos.id_producto, imagen_producto, detalles_productos.estado_producto, existencia_producto, color_producto, talla
                FROM detalles_productos, productos_colores, productos_tallas, productos
                WHERE productos.id_producto = ? AND
                productos_colores.id_producto_color = detalles_productos.id_producto_color AND
                productos_tallas.id_producto_talla = detalles_productos.id_producto_talla AND
                productos.id_producto = detalles_productos.id_producto;';
        $params = array($this->id_producto);
        return Database::getRows($sql, $params);
    }

    public function readColorFromId()
    {
        $sql = 'SELECT color_producto FROM productos_colores WHERE id_producto_color = ?;';
        $params = array($this->id_color);
        return Database::getRow($sql, $params);
    }
    
    public function readSizeFromId()
    {
        $sql = 'SELECT talla FROM productos_tallas WHERE id_producto_talla = ?;';
        $params = array($this->id_talla);
        return Database::getRow($sql, $params);
    }

    public function readAllWithColor()
    {
        $sql = 'SELECT id_detalle_producto, productos_colores.id_producto_color, productos.id_producto, imagen_producto, detalles_productos.estado_producto, existencia_producto, color_producto
                FROM detalles_productos, productos_colores, productos
                WHERE productos.id_producto = ? AND
                productos_colores.id_producto_color = detalles_productos.id_producto_color AND
                id_producto_talla IS NULL AND
                productos.id_producto = detalles_productos.id_producto;';
        $params = array($this->id_producto);
        return Database::getRows($sql, $params);
    }

    public function readAllWithSize()
    {
        $sql = 'SELECT id_detalle_producto, productos_tallas.id_producto_talla, productos.id_producto, imagen_producto, detalles_productos.estado_producto, existencia_producto, talla
                FROM detalles_productos, productos_tallas, productos
                WHERE productos.id_producto = ? AND
                id_producto_color IS NULL AND
                productos_tallas.id_producto_talla = detalles_productos.id_producto_talla AND
                productos.id_producto = detalles_productos.id_producto;';
        $params = array($this->id_producto);
        return Database::getRows($sql, $params);
    }

    public function readAllEmpty()
    {
        $sql = 'SELECT id_detalle_producto, productos.id_producto, imagen_producto, detalles_productos.estado_producto, existencia_producto
                FROM detalles_productos, productos
                WHERE productos.id_producto = ? AND
                id_producto_color IS NULL AND
                id_producto_talla IS NULL AND
                productos.id_producto = detalles_productos.id_producto;';
        $params = array($this->id_producto);
        return Database::getRows($sql, $params);
    }

    public function searchRows()
    {
        $sql = 'SELECT id_detalle_producto, productos_colores.id_producto_color, productos_tallas.id_producto_talla, productos.id_producto, imagen_producto, detalles_productos.estado_producto, existencia_producto, color_producto, talla
                FROM detalles_productos, productos_colores, productos_tallas, productos
                WHERE productos.id_producto = ? AND
                productos_colores.id_producto_color = detalles_productos.id_producto_color AND
                productos_tallas.id_producto_talla = detalles_productos.id_producto_talla AND
                productos.id_producto = detalles_productos.id_producto AND
                detalles_productos.id_producto_color = ? AND
                detalles_productos.id_producto_talla = ?;';
        $params = array($this->id_producto, $this->id_color, $this->id_talla);
        return Database::getRows($sql, $params);
    }

    public function searchRowsWithColorAllSizes()
    {
        $sql = 'SELECT id_detalle_producto, productos_colores.id_producto_color, productos_tallas.id_producto_talla, productos.id_producto, imagen_producto, detalles_productos.estado_producto, existencia_producto, color_producto, talla
                FROM detalles_productos, productos_colores, productos_tallas, productos
                WHERE productos.id_producto = ? AND
                productos_colores.id_producto_color = detalles_productos.id_producto_color AND
                productos_tallas.id_producto_talla = detalles_productos.id_producto_talla AND
                productos.id_producto = detalles_productos.id_producto AND
                detalles_productos.id_producto_color = ? AND
                detalles_productos.id_producto_talla >= 0;';
        $params = array($this->id_producto, $this->id_color);
        return Database::getRows($sql, $params);
    }

    public function searchRowsWithColorNoSizes()
    {
        $sql = 'SELECT id_detalle_producto, productos_colores.id_producto_color, productos.id_producto, imagen_producto, detalles_productos.estado_producto, existencia_producto, color_producto
                FROM detalles_productos, productos_colores, productos
                WHERE productos.id_producto = ? AND
                productos_colores.id_producto_color = detalles_productos.id_producto_color AND
                id_producto_talla IS NULL AND
                productos.id_producto = detalles_productos.id_producto AND
                detalles_productos.id_producto_color = ?;';
        $params = array($this->id_producto, $this->id_color);
        return Database::getRows($sql, $params);
    }

    public function readColors()
    {
        $sql = 'SELECT DISTINCT detalles_productos.id_producto_color, color_producto 
                FROM detalles_productos, productos_colores
                WHERE detalles_productos.id_producto_color = productos_colores.id_producto_color
                AND estado_detalle_producto = 1
                AND existencia_producto > 0
                AND id_producto = ?;';
        $params = array($this->id_producto);
        return Database::getRows($sql, $params);
    }

    public function readSizes()
    {
        $sql = 'SELECT DISTINCT detalles_productos.id_producto_talla, talla 
                FROM detalles_productos, productos_tallas
                WHERE detalles_productos.id_producto_talla = productos_tallas.id_producto_talla
                AND estado_detalle_producto = 1
                AND existencia_producto > 0
                AND id_producto = ?;';
        $params = array($this->id_producto);
        return Database::getRows($sql, $params);
    }

    public function readColorsFromSize()
    {
        $sql = 'SELECT productos_colores.id_producto_color, color_producto
                FROM detalles_productos
                INNER JOIN productos_colores ON productos_colores.id_producto_color = detalles_productos.id_producto_color
                WHERE detalles_productos.id_producto = ? AND
                id_producto_talla = ? AND
                estado_detalle_producto = 1 AND
                existencia_producto > 0;';
        $params = array($this->id_producto, $this->id_talla);
        return Database::getRows($sql, $params);
    }

    public function readDetailId()
    {
        $sql = 'SELECT detalles_productos.id_detalle_producto, productos.precio_producto, existencia_producto
                FROM detalles_productos
                INNER JOIN productos ON productos.id_producto = detalles_productos.id_producto
                WHERE detalles_productos.id_producto = ?
                AND existencia_producto > 0
                AND estado_detalle_producto = 1;';
        $params = array($this->id_producto);
        return Database::getRow($sql, $params);
    }

    public function readDetailIdWithColor()
    {
        $sql = 'SELECT detalles_productos.id_detalle_producto, productos.precio_producto, existencia_producto
                FROM detalles_productos
                INNER JOIN productos ON productos.id_producto = detalles_productos.id_producto
                WHERE id_producto_color = ?
                AND detalles_productos.id_producto = ?
                AND existencia_producto > 0
                AND estado_detalle_producto = 1;';
        $params = array($this->id_color, $this->id_producto);
        return Database::getRow($sql, $params);
    }

    public function readDetailIdWithSize()
    {
        $sql = 'SELECT detalles_productos.id_detalle_producto, productos.precio_producto, existencia_producto
                FROM detalles_productos
                INNER JOIN productos ON productos.id_producto = detalles_productos.id_producto
                WHERE id_producto_talla = ?
                AND detalles_productos.id_producto = ?
                AND existencia_producto > 0
                AND estado_detalle_producto = 1;';
        $params = array($this->id_talla, $this->id_producto);
        return Database::getRow($sql, $params);
    }

    public function readDetailIdWithColorAndSize()
    {
        $sql = 'SELECT detalles_productos.id_detalle_producto, productos.precio_producto, existencia_producto
                FROM detalles_productos
                INNER JOIN productos ON productos.id_producto = detalles_productos.id_producto
                WHERE id_producto_color = ?
                AND id_producto_talla = ?
                AND detalles_productos.id_producto = ?
                AND existencia_producto > 0
                AND estado_detalle_producto = 1;';
        $params = array($this->id_color, $this->id_talla, $this->id_producto);
        return Database::getRow($sql, $params);
    }

    public function readStock()
    {
        $sql = 'SELECT SUM(existencia_producto) AS existencias
                FROM detalles_productos 
                WHERE estado_detalle_producto = 1
                AND id_producto = ?;';
        $params = array($this->id_producto);
        return Database::getRow($sql, $params);
    }

    public function readImages()
    {
        $sql = 'SELECT imagen_producto 
                FROM detalles_productos
                WHERE id_producto = ?
                AND imagen_producto IS NOT NULL;';
        $params = array($this->id_producto);
        return Database::getRows($sql, $params);
    }
}
