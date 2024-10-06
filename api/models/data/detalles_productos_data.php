<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/detalles_productos_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla DETALLES_PRODUCTOS.
 */
class DetallesProductosData extends DetallesProductosHandler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null;
    private $filename = null;

    /*
     *  Métodos para validar y establecer los datos.
     */
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la existencia es incorrecto';
            return false;
        }
    }

    public function setIdProducto($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_producto = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del producto es incorrecto';
            return false;
        }
    }

    public function setIdColor($value)
    {
        if(Validator::validateNaturalNumber($value)){
            $this->id_color = $value;
            return true;
        } else{
            $this->data_error = 'El identificador del color es incorrecto';
            return false;
        }
    }

    public function setIdTalla($value, $operadorTalla = null)
    {
        if($operadorTalla){
            $this->id_talla = $operadorTalla;
            return true;
        }
        elseif(Validator::validateNaturalNumber($value)){
            $this->id_talla = $value;
            return true;
        } else{
            $this->data_error = 'El identificador de la talla es incorrecto';
            return false;
        }
    }

    /*
     *  Métodos para obtener los atributos adicionales.
     */
    public function getDataError()
    {
        return $this->data_error;
    }

    public function getFilename()
    {
        return $this->filename;
    }
}