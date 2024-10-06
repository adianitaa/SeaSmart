<?php
// Se incluye la clase del modelo.
require_once('../../models/data/valoracion_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $valoracion = new ValoracionData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idCliente'])) {
        // Se compara la acción a realizar cuando un cliente ha iniciado sesión.
        switch ($_GET['action']) {
                // La acción readComments retorna los comentarios habilitados de un producto.
            case 'readComments':
                if(!$valoracion->setIdProducto($_POST['idProducto'])){
                    $result['error'] = $valoracion->getDataError();
                } elseif ($result['dataset'] = $valoracion->readComments()) {
                    $result['status'] = 1;
                    $result['message'] = 'Mostrando ' . count($result['dataset']) . ' comentarios';
                } else {
                    $result['error'] = 'No existen comentarios del producto';
                }
                break;
                // La acción readOne retorna una reseña/comentario específico.
            case 'readOne':
                if(!$valoracion->readOne($_POST['idProducto'])){
                    $result['status'] = 1;
                } else{
                    $result['error'] = 'No se puede agregar más de 1 reseña por producto';
                }
                break;
                // La acción makeComment permite agregar un registro con la reseña/comentario del cliente.
            case 'makeComment':
                if (
                    !$valoracion->setComentario($_POST['comentarioProducto']) or
                    !$valoracion->setCalificacion($_POST['calificacionProducto']) or
                    !$valoracion->setIdDetallePedido($_POST['idDetallePedido'])
                ) {
                    $result['error'] = $valoracion->getDataError();
                } elseif ($valoracion->makeComment()) {
                    $result['status'] = 1;
                    $result['message'] = 'Reseña agregada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un error al agregar la reseña';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando un cliente no ha iniciado sesión.
        switch ($_GET['action']) {
                // La acción readComments retorna los comentarios habilitados de un producto.
            case 'readComments':
                if ($result['dataset'] = $valoracion->readComments($_POST['idProducto'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Mostrando ' . count($result['dataset']) . ' comentarios';
                } else {
                    $result['error'] = 'No existen comentarios del producto';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible fuera de la sesión';
        }
    }
    // Se obtiene la excepción del servidor de bd por si ocurrió un problema.
    $result['exception'] = Database::getException();
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('Content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
