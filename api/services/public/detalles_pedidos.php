<?php
// Se incluye la clase del modelo.
require_once('../../models/data/detalles_pedidos_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $detalle_pedido = new DetallesPedidosData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como cliente, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idCliente'])) {
        // Se compara la acción a realizar cuando un cliente ha iniciado sesión.
        switch ($_GET['action']) {
                // La acción readOrderWithProduct retorna los detalles de pedidos que tienen un producto específico y el estado_pedido es 'Enviado'.
            case 'readOrderWithProduct':
                if (!$detalle_pedido->setIdProducto($_POST['idProducto'])) {
                    $result['error'] = $detalle_pedido->getDataError();
                } elseif ($result['dataset'] = $detalle_pedido->readOrderWithProduct()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay compras registradas con el producto';
                }
                break;
                // La acción readCartWithProduct retorna los detalles de pedidos que tienen un producto específico y el estado_pedido es 'En carrito'.
            case 'readCartWithProduct':
                if (!$detalle_pedido->setIdProducto($_POST['idProducto'])) {
                    $result['error'] = $detalle_pedido->getDataError();
                } elseif (!$result['dataset'] = $detalle_pedido->readCartWithProduct()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'El producto ya se encuentra agregado al carrito';
                }
                break;
                // La acción readCartWithDetail valida que un detalle de producto en específico no se haya agregado al carrito con anterioridad.
            case 'readCartWithDetail':
                if (!$detalle_pedido->setIdDetalleProducto($_POST['idDetalleProducto'])) {
                    $result['error'] = $detalle_pedido->getDataError();
                } elseif (!$result['dataset'] = $detalle_pedido->readCartWithDetail()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'El detalle del producto ya ha sido agregado al carrito';
                }
                break;
                // La acción addDetail permite agregar un detalle de pedido al carrito con el id del detalle del producto. 
            case 'addDetail':
                if (
                    !$detalle_pedido->setIdDetalleProducto($_POST['idDetalleProducto']) or
                    !$detalle_pedido->setPrecioProducto($_POST['precioProducto']) or
                    !$detalle_pedido->setCantidadProducto($_POST['cantidadRequerida'])
                ){
                    $result['error'] = $detalle_pedido->getDataError();
                } elseif($detalle_pedido->addDetail()){
                    $result['status'] = 1;
                    $result['message'] = 'Producto agregado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un error al agregar el producto al carrito, intentélo de nuevo más tarde';
                }
                break;
                // La acción updateDetail permite editar un detalle de pedido con el id del detalle del producto. 
            case 'updateDetail':
                if(
                    !$detalle_pedido->setId($_POST['idDetallePedido']) or
                    !$detalle_pedido->setIdDetalleProducto($_POST['idDetalleProducto']) or
                    !$detalle_pedido->setCantidadProducto($_POST['nuevaCantidad'])
                ){
                    $result['error'] = $detalle_pedido->getDataError();
                } elseif($detalle_pedido->updateDetail()){
                    $result['status'] = 1;
                    $result['message'] = 'Detalle de pedido editado correctamente';
                } else{
                    $result['error'] = 'Ocurrió un error al editar el detalle del pedido';
                }
                break;
                // La acción removeDetail permite eliminar un detalle de pedido de la tabla detalles_pedidos con el id del detalle del pedido. 
            case 'removeDetail':
                if(
                    !$detalle_pedido->setId($_POST['idDetallePedido']) or
                    !$detalle_pedido->setIdDetalleProducto($_POST['idDetalleProducto'])
                ){
                    $result['error'] = $detalle_pedido->getDataError();
                } elseif($detalle_pedido->removeDetail()){
                    $result['status'] = 1;
                    $result['message'] = 'Detalle de pedido eliminado correctamente';
                } else{
                    $result['error'] = 'Ocurrió un error al eliminar el detalle del pedido';
                }
                break;
                // La acción readCart selecciona todos los productos agregados al carrito.
            case 'readCart':
                if ($result['dataset'] = $detalle_pedido->readCart()) {
                    $result['status'] = 1;
                    $result['message'] = count($result['dataset']) . ' productos';
                } else {
                    $result['error'] = 'No se ha agregado ningún producto al carrito';
                }
                break;
                // La acción readDetail permite remover un detalle de producto del carrito.
            case 'removeDetail':
                if(
                    !$detalle_pedido->setId($_POST['idDetallePedido']) or
                    !$detalle_pedido->setIdDetalleProducto($_POST['idDetalleProducto'])
                ){
                    $result['error'] = $detalle_pedido->getDataError();
                } elseif($detalle_pedido->removeDetail()){
                    $result['status'] = 1;
                    $result['message'] = 'Producto removido del carrito';
                } else{
                    $result['error'] = 'Ocurrió un error al remover el producto del carrito';
                }
                break;
            case 'readDetails':
                if (!$detalle_pedido->setIdPedido($_POST['idPedido'])) {
                    $result['error'] = $detalle_pedido->getDataError();
                } elseif ($result['dataset'] = $detalle_pedido->readDetails()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un error al obtener los productos del pedido';
                }
                break;
                // Si no se encuentra la acción a realizar se muestra el error.
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
