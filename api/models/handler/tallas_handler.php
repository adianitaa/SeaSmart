<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla CATEGORIA.
 */
class TallaHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $talla = null;
    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_producto_talla, talla
            FROM productos_tallas
            WHERE talla LIKE ? OR talla LIKE ?
            ORDER BY talla';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO tallas(id_producto_talla, talla)
                VALUES(?, ?, ?)';
        $params = array($this->id, $this->talla,);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_producto_talla, talla
                FROM productos_tallas
                ORDER BY id_producto_talla';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_producto_talla, talla
                FROM productos_tallas
                WHERE id_producto_talla = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE productos_tallas
                SET id_producto_talla = ?, talla = ?
                WHERE id_categoria = ?';
        $params = array($this->imagen, $this->nombre, $this->descripcion, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM productos_tallas
                WHERE id_producto_talla = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
