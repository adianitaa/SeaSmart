<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla CATEGORIA.
 */
class subCategoriaHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $id_categoria = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_sub_categoria, nombre_sub_categoria, descripcion_sub_categoria
                FROM sub_categorias
                WHERE nombre_sub_categoria LIKE ? OR descripcion_sub_categoria LIKE ?
                ORDER BY nombre_sub_categoria';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO sub_categorias(nombre_sub_categoria, descripcion_sub_categoria, id_categoria)
                VALUES(?, ?, ?)';
        $params = array($this->nombre, $this->descripcion, $this->id_categoria);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_sub_categoria, nombre_sub_categoria, descripcion_sub_categoria
                FROM sub_categorias
                ORDER BY nombre_sub_categoria';
        return Database::getRows($sql);
    }

    public function readAllCategoria()
    {
        $sql = 'SELECT 
        a.id_sub_categoria, 
        a.nombre_sub_categoria, 
        a.descripcion_sub_categoria
    FROM 
        sub_categorias a
    JOIN 
        categorias b ON a.id_categoria = b.id_categoria
    WHERE 
        a.id_categoria = ?
    ORDER BY 
        a.nombre_sub_categoria;
    ';
        $params = array($this->id_categoria);
        return Database::getRows($sql, $params);
    }

    public function readWithId()
    {
        $sql = 'SELECT id_sub_categoria, nombre_sub_categoria, descripcion_sub_categoria
                FROM sub_categorias where id_categoria = ?
                ORDER BY nombre_sub_categoria';
        $params = array($this->id_categoria);
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT id_sub_categoria, nombre_sub_categoria, descripcion_sub_categoria, id_categoria
                FROM sub_categorias
                WHERE id_sub_categoria = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE sub_categorias
                SET nombre_sub_categoria = ?, descripcion_sub_categoria = ?, id_categoria = ?
                WHERE id_sub_categoria = ?';
        $params = array($this->nombre, $this->descripcion, $this->id_categoria,$this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM sub_categorias
                WHERE id_sub_categoria = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}