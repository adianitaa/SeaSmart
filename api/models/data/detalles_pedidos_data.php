<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/detalles_pedidos_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla DETALLES_PEDIDOS.
 */
class DetallesPedidosData extends DetallesPedidosHandler
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
            $this->data_error = 'El identificador del detalle de pedido es incorrecto';
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

    public function setIdPedido($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_pedido = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del pedido es incorrecto';
            return false;
        }
    }

    public function setIdDetalleProducto($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_detalle_producto = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del detalle de producto es incorrecto';
            return false;
        }
    }

    public function setCantidadProducto($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cantidad_producto = $value;
            return true;
        } else {
            $this->data_error = 'La cantidad del producto es incorrecta';
            return false;
        }
    }

    public function setPrecioProducto($value)
    {
        if(Validator::validateMoney($value)){
            $this->precio_producto = $value;
            return true;
        } else{
            $this->data_error = 'El precio del producto es incorrecto';
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