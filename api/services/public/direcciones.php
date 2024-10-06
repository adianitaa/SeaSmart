<?php
// Se incluye la clase del modelo.
require_once('../../models/data/direccion_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $direccion = new DireccionData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'recaptcha' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    if (isset($_SESSION['idCliente'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un cliente ha iniciado sesión.
        switch ($_GET['action']) {
            // La acción readAll retorna todas las direcciones ingresadas de un cliente específico.
            case 'readAll':
                if ($result['dataset'] = $direccion->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Mostrando ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No se han agregado direcciones';
                }
                break;
                // La acción createRow agrega una nueva dirección.
            case 'createRow':
                if(
                    !$direccion->setDireccion($_POST['inputDireccion'])
                ){
                    $result['error'] = $direccion->getDataError();
                } elseif($direccion->validarDireccion()){
                    $result['error'] = 'La dirección ya ha sido agregada';
                } elseif($direccion->createRow()){
                    $result['status'] = 1;
                    $result['message'] = 'Dirección agregada correctamente';
                } else{
                    $result['error'] = 'No se han agregado direcciones';
                }
                break;
                // La acción updateRow edita una dirección existente.
            case 'updateRow':
                if(
                    !$direccion->setDireccion($_POST['inputDireccion']) or
                    !$direccion->setId($_POST['idDireccion'])
                ){
                    $result['error'] = $direccion->getDataError();
                } elseif($direccion->validarDireccion()){
                    $result['error'] = 'La dirección ya ha sido agregada';
                } elseif($direccion->updateRow()){
                    $result['status'] = 1;
                    $result['message'] = 'Dirección editada correctamente';
                } else{
                    $result['error'] = 'No se han agregado direcciones';
                }
                break;
                // La acción deleteRow elimina una dirección específica.
            case 'deleteRow':
                if(
                    !$direccion->setId($_POST['idDireccion'])
                ){
                    $result['error'] = $direccion->getDataError();
                } elseif($direccion->deleteRow()){
                    $result['status'] = 1;
                    $result['message'] = 'Dirección eliminada correctamente';
                } else{
                    $result['error'] = 'No se pudo eliminar la dirección';
                }
                break;
                // La acción readOne permite seleccionar una dirección específica de un cliente específico.
            case 'readOne':
                if (
                    !$direccion->setId($_POST['idDireccion'])
                ) {
                    $result['error'] = 'Dirección incorrecta';
                } elseif ($result['dataset'] = $direccion->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Dirección inexistente';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        print (json_encode('Acceso denegado'));
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
