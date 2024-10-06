<?php
// Se incluye la clase del modelo.
require_once('../../models/data/subcategoria_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $subcategoria = new subCategoriaData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if (!Validator::validateSearch($_POST['buscarsubCategoria'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $subcategoria->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$subcategoria->setNombre($_POST['nombresubCategoria']) or
                    !$subcategoria->setDescripcion($_POST['descripcionsubCategoria']) or
                    !$subcategoria->setIdCategoria($_POST['categoriaSelect'])
                ) {
                    $result['error'] = $subcategoria->getDataError();
                } elseif ($subcategoria->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'subCategoría creada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear la subcategoría';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $subcategoria->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Mostrando ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen subcategorías registradas';
                }
                break;
            case 'readWithId':
                if(
                    !$subcategoria->setIdCategoria($_POST['selectCategoria'])
                ){
                    $result['error'] = $subcategoria->getDataError();
                } elseif ($result['dataset'] = $subcategoria->readWithId()) {
                    $result['status'] = 1;
                    $result['message'] = 'Mostrando ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen subcategorías registradas';
                }
                break;
            case 'readOne':
                if (!$subcategoria->setId($_POST['idsubCategoria'])) {
                    $result['error'] = $subcategoria->getDataError();
                } elseif ($result['dataset'] = $subcategoria->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'subCategoría inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$subcategoria->setId($_POST['idsubCategoria']) or
                    !$subcategoria->setNombre($_POST['nombresubCategoria']) or
                    !$subcategoria->setIdCategoria($_POST['categoriaSelect']) or
                    !$subcategoria->setDescripcion($_POST['descripcionsubCategoria'])
                ) {
                    $result['error'] = $subcategoria->getDataError();
                } elseif ($subcategoria->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'subCategoría modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la subcategoría';
                }
                break;
            case 'deleteRow':
                if (!$subcategoria->setId($_POST['idsubCategoria'])) {
                    $result['error'] = $subcategoria->getDataError();
                } elseif ($subcategoria->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'subCategoría eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la subcategoría';
                }
                break;
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