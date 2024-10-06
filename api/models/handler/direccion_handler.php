<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla DIRECCIONES.
 */
class DireccionHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $direccion = null;
    protected $id_cliente = null;

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function readAll()
    {
        $sql = 'SELECT direccion, id_direccion, nombre_cliente, apellido_cliente FROM direcciones, clientes WHERE direcciones.id_cliente = ? AND clientes.id_cliente = direcciones.id_cliente;';

        if($this->id_cliente){
            $params = array($this->id_cliente);
        } else{
            $params = array($_SESSION['idCliente']);
        }
        return Database::getRows($sql, $params);
    }

    public function validarDireccion()
    {
        $sql = 'SELECT id_direccion, direccion, id_cliente FROM direcciones WHERE direccion = ?;';
        $params = array($this->direccion);
        return Database::getRow($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO direcciones (direccion, id_cliente) VALUES(?, ?);';
        $params = array($this->direccion, $_SESSION['idCliente']);
        return Database::executeRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE direcciones SET direccion = ? WHERE id_direccion = ?;';
        $params = array($this->direccion, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT id_direccion, direccion FROM direcciones WHERE id_cliente = ? AND id_direccion = ?';
        $params = array($_SESSION['idCliente'], $this->id);
        return Database::getRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM direcciones WHERE id_direccion = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    //Función para el reporte de la información del cliente
    public function readByCliente($id_cliente)
    {
        $sql = 'SELECT id_direccion, direccion
                FROM direcciones
                WHERE id_cliente = ?
                ORDER BY direccion;';
        $params = array($id_cliente);
        return Database::getRows($sql, $params);
    }
}