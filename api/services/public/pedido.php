<?php
// Se incluye la clase del modelo.
require_once('../../models/data/pedido_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $pedido = new PedidoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'error' => null, 'exception' => null, 'dataset' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    if (isset($_SESSION['idCliente'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un cliente ha iniciado sesión.
        switch ($_GET['action']) {
                // La acción readOrders retorna los pedidos realizados por el cliente.
            case "readOrders":
                if ($result['dataset'] = $pedido->readOrders()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = "El cliente no ha realizado ningún pedido";
                }
                break;
            // La acción readOrders retorna los pedidos realizados por el cliente en mobile.
            case "readOrdersMobile":
                if($result['dataset'] = $pedido->readOrdersMobile()){
                    $result['status'] = 1;
                } else{
                    $result['error'] = "El cliente no ha realizado ningún pedido";
                }
                break;
                // Acción para crear/iniciar un pedido del carrito.
            case 'startOrder':
                if (!$pedido->startOrder()) {
                    $result['error'] = 'Ocurrió un problema al iniciar el pedido';
                } elseif ($_SESSION['idPedido']) {
                    $result['status'] = 1;
                    $result['message'] = 'Pedido iniciado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el pedido';
                }
                break;
                // Acción para finalizar un pedido.
            case 'finishOrder':
                if (!$pedido->setDireccion($_POST['direccion'])) {
                    $result['error'] = $pedido->getDataError();
                } elseif (!$pedido->finishOrder()) {
                    $result['error'] = 'Ocurrió un problema al finalizar el pedido';
                } else {
                    $result['status'] = 1;
                    $result['message'] = 'Pedido realizado correctamente';
                }
                break;
                // Acción para obtener los detalles de un producto.
            case 'readCart':
                if($result['dataset'] = $pedido->readCart()){
                    $result['status'] = 1;
                } else{
                    $result['error'] = 'No se ha agregado ningún producto al carrito';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando un cliente no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'startOrder':
                $result['error'] = 'Debe iniciar sesión para agregar el producto al carrito';
                break;
            default:
                $result['error'] = 'Acción no disponible fuera de la sesión';
        }
    }
    // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
    $result['exception'] = Database::getException();
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('Content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}