<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class ProductoHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $id_categoria = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $id_subcategoria = null;
    protected $estado = null;
    protected $precio = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/productos/';

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_producto, nombre_producto, descripcion_producto, nombre_sub_categoria, estado_producto, nombre_administrador
                FROM productos
                INNER JOIN sub_categorias USING(id_sub_categoria)
                INNER JOIN administradores USING(id_administrador)
                WHERE nombre_producto LIKE ? OR descripcion_producto LIKE ? OR nombre_administrador LIKE ? OR nombre_sub_categoria LIKE ?
                ORDER BY nombre_producto';
        $params = array($value, $value, $value, $value);
        return Database::getRows($sql, $params);
    }

    public function getProducts()
    {
        $sql = 'SELECT id_producto, nombre_producto, descripcion_producto, estado_producto, precio_producto, nombre_sub_categoria, (SELECT imagen_producto FROM detalles_productos WHERE detalles_productos.id_producto = productos.id_producto AND estado_detalle_producto = 1 LIMIT 1) AS imagen_producto, (SELECT SUM(existencia_producto) FROM detalles_productos WHERE detalles_productos.id_producto = productos.id_producto AND estado_detalle_producto = 1) as existencias
                FROM productos
                INNER JOIN sub_categorias USING(id_sub_categoria)
                INNER JOIN categorias USING (id_categoria)
                WHERE estado_producto = 1 AND
                categorias.id_categoria = ? AND
					 (SELECT SUM(existencia_producto) FROM detalles_productos WHERE estado_detalle_producto = 1 AND detalles_productos.id_producto = productos.id_producto) > 0;';
        $params = array($this->id_categoria);
        return Database::getRows($sql, $params);
    }
    
    public function createRow()
    {
        $sql = 'INSERT INTO productos(nombre_producto, descripcion_producto, id_sub_categoria, precio_producto, id_administrador)
                VALUES(?, ?, ?, ?, ?)';
        $params = array($this->nombre, $this->descripcion, $this->id_subcategoria, $this->precio, $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }

    public function readAllThats(){
        $sql = 'SELECT a.id_producto, a.nombre_producto, a.descripcion_producto, b.imagen_producto, 
        a.precio_producto from productos a, detalles_productos b where a.id_producto = b.id_producto';

        return Database::getRows($sql);
    }

    public function readAllSub(){
        $sql = 'SELECT a.id_producto, a.nombre_producto, a.descripcion_producto, b.imagen_producto, 
        a.precio_producto from productos a, detalles_productos b , sub_categorias c where a.id_producto = b.id_producto AND c.id_sub_categoria = a.id_sub_categoria AND c.id_sub_categoria = ?';
        $params = array($this->id_subcategoria);
        return Database::getRows($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_producto, nombre_producto, descripcion_producto, 
                nombre_sub_categoria, estado_producto, nombre_administrador
                FROM productos
                INNER JOIN sub_categorias USING(id_sub_categoria)
                INNER JOIN administradores USING(id_administrador)
                ORDER BY nombre_producto';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_producto, nombre_producto, descripcion_producto, categorias.id_categoria, sub_categorias.id_sub_categoria, estado_producto, precio_producto, nombre_administrador, 
                        nombre_categoria, nombre_sub_categoria, (SELECT imagen_producto FROM detalles_productos WHERE detalles_productos.id_producto = productos.id_producto and estado_detalle_producto = 1 LIMIT 1) as imagen_producto,
                        (SELECT COUNT(id_producto_color) FROM detalles_productos WHERE id_producto = ?) as colores, (SELECT COUNT(id_producto_talla) FROM detalles_productos WHERE id_producto = ?) as tallas,
                        (SELECT SUM(existencia_producto) FROM detalles_productos WHERE id_producto = ? AND estado_detalle_producto = 1) as existencias, (SELECT id_detalle_pedido FROM detalles_pedidos INNER JOIN pedidos USING(id_pedido) INNER JOIN detalles_productos USING(id_detalle_producto) INNER JOIN productos USING(id_producto) WHERE id_cliente = ? AND id_producto = ? AND estado_pedido = "Enviado" LIMIT 1) AS compra_cliente, (SELECT id_valoracion FROM valoraciones INNER JOIN detalles_pedidos USING(id_detalle_pedido) INNER JOIN detalles_productos USING(id_detalle_producto) INNER JOIN productos USING(id_producto) INNER JOIN pedidos USING (id_pedido) WHERE id_producto = ? AND id_cliente = ? LIMIT 1) AS valoraciones
                FROM productos, sub_categorias, categorias, administradores
                WHERE id_producto = ? AND
                categorias.id_categoria = sub_categorias.id_categoria AND
                sub_categorias.id_sub_categoria = productos.id_sub_categoria AND
                administradores.id_administrador = productos.id_administrador';
        $params = array($this->id, $this->id, $this->id, $_SESSION['idCliente'], $this->id, $this->id, $_SESSION['idCliente'], $this->id);
        return Database::getRow($sql, $params);
    }

    public function readSingleDetailProduct()
    {
        $sql = 'SELECT id_detalle_producto, existencia_producto, id_producto
                FROM detalles_productos
                WHERE id_producto = ?;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readColorDetailProduct()
    {
        $sql = 'SELECT id_detalle_producto, existencia_producto, id_producto, color_producto, id_producto_color
                FROM detalles_productos
                INNER JOIN productos_colores USING (id_producto_color)
                WHERE id_producto = ?;';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    public function readDetailProduct()
    {
        $sql = 'SELECT id_detalle_producto, existencia_producto, id_producto, talla, id_producto_talla, color_producto, id_producto_color
                FROM detalles_productos
                INNER JOIN productos_tallas USING (id_producto_talla)
                INNER JOIN productos_colores USING (id_producto_color)
                WHERE id_producto = ? AND
                estado_detalle_producto = 1;';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    public function readSizeDetailProduct()
    {
        $sql = 'SELECT id_detalle_producto, existencia_producto, id_producto, talla, id_producto_talla
                FROM detalles_productos
                INNER JOIN productos_tallas USING (id_producto_talla)
                WHERE id_producto = ?;';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE productos
                SET nombre_producto = ?, descripcion_producto = ?, estado_producto = ?, id_sub_categoria = ?, precio_producto = ?
                WHERE id_producto = ?';
        $params = array($this->nombre, $this->descripcion, $this->estado, $this->id_subcategoria, $this->precio, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM productos
                WHERE id_producto = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function porcentajeProductosSubcategoria()
    {
        // Se estalece la estructura de la sentencia.
        $sql = 'SELECT nombre_sub_categoria, ROUND((COUNT(id_producto) * 100.0 / (SELECT COUNT(id_producto) FROM productos)), 2) porcentaje
                FROM productos
                INNER JOIN sub_categorias USING(id_sub_categoria)
                GROUP BY nombre_sub_categoria ORDER BY porcentaje DESC
                ';
        // Se capturan y retornan los datos.
        return Database::getRows($sql);
    }

    public function porcentajeProductosCategoria()
    {
        // Se estalece la estructura de la sentencia.
        $sql = 'SELECT categorias.nombre_categoria, ROUND((COUNT(productos.id_producto) * 100.0 / (SELECT COUNT(*) FROM productos)), 2) AS porcentaje
                FROM productos
                INNER JOIN sub_categorias ON productos.id_sub_categoria = sub_categorias.id_sub_categoria
                INNER JOIN categorias ON sub_categorias.id_categoria = categorias.id_categoria
                GROUP BY categorias.nombre_categoria
                ORDER BY porcentaje DESC';
        // Se capturan y retornan los datos.
        return Database::getRows($sql);
    }

    // Definir la función para obtener los top 5 productos más vendidos
    public function topProductosMasVendidos()
    {
        // Se estalece la estructura de la sentencia.
        $sql = 'SELECT p.nombre_producto, SUM(dped.cantidad_producto) AS cantidad_vendida
                FROM productos p
                INNER JOIN detalles_productos dp ON p.id_producto = dp.id_producto
                INNER JOIN detalles_pedidos dped ON dp.id_detalle_producto = dped.id_detalle_producto
                INNER JOIN pedidos ped ON dped.id_pedido = ped.id_pedido AND (ped.estado_pedido = "Enviado" OR ped.estado_pedido = "Siendo enviado")
                GROUP BY p.nombre_producto
                ORDER BY cantidad_vendida DESC
                LIMIT 5';
        // Se capturan y retornan los datos.
        return Database::getRows($sql);
    }
  
    //Consulta para grafico de cantidad (COUNT) de Productos por subcategoria
    public function cantidadProductosSubcategoria()
    {
        // Se estalece la estructura de la sentencia.
        $sql = 'SELECT COUNT(id_producto) AS cantidad_productos, nombre_sub_categoria
                FROM productos 
                    INNER JOIN sub_categorias  USING(id_sub_categoria)
                GROUP BY nombre_sub_categoria
                ORDER BY nombre_sub_categoria
                ';
        // Se capturan y retornan los datos.
        return Database::getRows($sql);
    }

    //Consulta para grafico de cantidad (COUNT) de Productos por categoria
    public function cantidadProductosCategoria()
    {
        // Se establece la estructura de la sentencia.
        $sql = 'SELECT COUNT(id_producto) AS cantidad_productos, nombre_categoria
                FROM productos 
                    INNER JOIN sub_categorias USING(id_sub_categoria)
                    INNER JOIN categorias USING(id_categoria)
                GROUP BY nombre_categoria
                ORDER BY nombre_categoria
                ';
        // Se capturan y retornan los datos.
        return Database::getRows($sql);
    }

    //Consulta para reporte de productos por Subcategoria (parametro: id_sub_categoria)
    public function productosSubCategoria()
    {
        // Se establece la estructura de la sentencia.
        $sql = 'SELECT id_producto, nombre_producto, descripcion_producto, precio_producto, nombre_sub_categoria, estado_producto
                FROM productos 
                    INNER JOIN sub_categorias USING(id_sub_categoria)
                WHERE id_sub_categoria = ?
                ORDER BY nombre_producto;
                ';
        $params = array($this->id_subcategoria);
        // Se capturan y retornan los datos.
        return Database::getRows($sql, $params);
    }

    //Consulta para reporte de productos ordenados por Categoria y Subcategoria 
    public function productosOrdenSubYCategoria()
    {
        $sql = 'SELECT nombre_categoria, nombre_sub_categoria, id_producto, nombre_producto, descripcion_producto, precio_producto, estado_producto 
                FROM productos 
                    INNER JOIN sub_categorias USING(id_sub_categoria)
                    INNER JOIN categorias USING(id_categoria)
                ORDER BY nombre_categoria, nombre_sub_categoria, nombre_producto;
                ';
        return Database::getRows($sql);
    }
}
