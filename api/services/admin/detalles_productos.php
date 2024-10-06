<?php
// Se incluye la clase del modelo.
require_once('../../models/data/detalles_productos_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $detalle_producto = new DetallesProductosData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // La acción readAll retorna todos los registros de detalles_productos con color y talla asignada.
            case 'readAll':
                if (!$detalle_producto->setIdProducto($_POST['idProducto'])) {
                    $result['error'] = $detalle_producto->getDataError();
                } elseif ($result['dataset'] = $detalle_producto->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Mostrando ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay existencias registradas';
                }
                break;
                // La acción readAll retorna todos los registros de detalles_productos con un color asignado.
            case 'readAllWithColor':
                if (!$detalle_producto->setIdProducto($_POST['idProducto'])) {
                    $result['error'] = $detalle_producto->getDataError();
                } elseif ($result['dataset'] = $detalle_producto->readAllWithColor()) {
                    $result['status'] = 1;
                    $result['message'] = 'Mostrando ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay existencias con color registradas';
                }
                break;
                // La acción readAll retorna todos los registros de detalles_productos con una talla asignada.
            case 'readAllWithSize':
                if (!$detalle_producto->setIdProducto($_POST['idProducto'])) {
                    $result['error'] = $detalle_producto->getDataError();
                } elseif ($result['dataset'] = $detalle_producto->readAllWithSize()) {
                    $result['status'] = 1;
                    $result['message'] = 'Mostrando ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay existencias con talla registradas';
                }
                break;
                // La acción readAllEmpty retorna todos los registros de detalles_productos sin talla ni color asignado.
            case 'readAllEmpty':
                if (!$detalle_producto->setIdProducto($_POST['idProducto'])) {
                    $result['error'] = $detalle_producto->getDataError();
                } elseif ($result['dataset'] = $detalle_producto->readAllEmpty()) {
                    $result['status'] = 1;
                    $result['message'] = 'Mostrando ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No hay existencias sin talla ni color asignado';
                }
                break;
                // La acción searchRows permite buscar registros específicos.
            case 'searchRows':
                if (
                    !$detalle_producto->setIdProducto($_POST['idProducto']) or
                    !$detalle_producto->setIdColor($_POST['selectColor']) or
                    !$detalle_producto->setIdTalla($_POST['selectTalla'])
                ) {
                    $result['error'] = $detalle_producto->getDataError();
                } elseif ($result['dataset'] = $detalle_producto->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
                // La acción searchRows permite buscar registros específicos.
            case 'searchRowsWithColor':
                if (
                    !$detalle_producto->setIdProducto($_POST['idProducto']) or
                    !$detalle_producto->setIdColor($_POST['selectColor'])
                ) {
                    $result['error'] = $detalle_producto->getDataError();
                } elseif ($result['dataset'] = $detalle_producto->searchRowsWithColorAllSizes()) {
                    array_push($result['dataset'], $detalle_producto->searchRowsWithColorNoSizes());
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
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
