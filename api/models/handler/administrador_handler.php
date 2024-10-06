<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class AdministradorHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $correo = null;
    protected $contra = null;
    protected $fecha_registro = null;
    protected $estado = null;

    /*
     *  Métodos para gestionar la cuenta del administrador.
     */
    public function checkUser($correo, $contra)
    {
        $sql = 'SELECT id_administrador, nombre_administrador, contra_administrador, estado_administrador
                FROM administradores
                WHERE correo_administrador = ?';
        $params = array($correo);
        $data = Database::getRow($sql, $params);

        // Se valida que el query retorne un registro de la tabla.
        if ($data) {
            // Se valida que la contraseña ingresada en el campo de login convertida a hash
            // sea igual a la contraseña almacenada en la bd.
            if (password_verify($contra, $data['contra_administrador'])) {
                // Se valida el estado del administrador.
                if ($data['estado_administrador'] == '0') {
                    // Si estado_administrador = 0 el estado es inactivo: Se devuelve el string.
                    return 'Estado inactivo';
                } else {
                    // Si estado_administrador = 1 el estado es activo: Se devuelve el array.
                    return array($data['id_administrador'], $correo);
                }
            } else {
                // Si la contraseña no es correcta se devuelve false.
                return false;
            }
        } else {
            return false;
        }
    }

    public function checkPassword($password)
    {
        $sql = 'SELECT contra_administrador
                FROM administradores
                WHERE id_administrador = ?';
        $params = array($_SESSION['idAdministrador']);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['contra_administrador'])) {
            return true;
        } else {
            return false;
        }
    }

    public function changePassword()
    {
        $sql = 'UPDATE administradores
                SET contra_administrador = ?
                WHERE id_administrador = ?';
        $params = array($this->contra, $_SESSION['idadministrador']);
        return Database::executeRow($sql, $params);
    }

    public function readProfile()
    {
        $sql = 'SELECT id_administrador, nombre_administrador, apellido_administrador, correo_administrador
                FROM administradores
                WHERE id_administrador = ?';
        $params = array($_SESSION['idAdministrador']);
        return Database::getRow($sql, $params);
    }

    public function editProfile()
    {
        $sql = 'UPDATE administradores
                SET nombre_administrador = ?, apellido_administrador = ?, correo_administrador = ?
                WHERE id_administrador = ?';
        $params = array($this->nombre, $this->apellido, $this->correo, $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_administrador, nombre_administrador, apellido_administrador, correo_administrador, estado_administrador, fecha_registro
                FROM administradores
                WHERE apellido_administrador LIKE ? OR nombre_administrador LIKE ? OR correo_administrador LIKE ?
                ORDER BY apellido_administrador';
        $params = array($value, $value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        $sql = 'INSERT INTO administradores (nombre_administrador, apellido_administrador, correo_administrador, contra_administrador) VALUES
        (?, ?, ?, ?);';

        $params = array($this->nombre, $this->apellido, $this->correo, $this->contra);
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_administrador, nombre_administrador, apellido_administrador, correo_administrador, fecha_registro, estado_administrador
                FROM administradores
                ORDER BY apellido_administrador';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_administrador, nombre_administrador, apellido_administrador, correo_administrador, estado_administrador
                FROM administradores
                WHERE id_administrador = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE administradores
                SET nombre_administrador = ?, apellido_administrador = ?, correo_administrador = ?, estado_administrador = ?
                WHERE id_administrador = ?';
        $params = array($this->nombre, $this->apellido, $this->correo, $this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM administradores
                WHERE id_administrador = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    public function searchEmail($correo)
    {
        $sql = 'SELECT nombre_administrador FROM administradores
                WHERE correo_administrador = ?';
        $params = array($correo);
        return Database::getRow($sql, $params);
    }

    public function checkDuplicateWithId($value)
    {
        $sql = 'SELECT id_administrador
                FROM administradores
                WHERE (correo_administrador = ?) AND id_administrador != ?';
        $params = array($value, $this->id);
        return Database::getRow($sql, $params);
    }
}
