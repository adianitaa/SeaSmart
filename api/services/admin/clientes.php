<?php
// Se incluye la clase del modelo.
require_once('../../models/data/cliente_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $clientes = new ClienteData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'correoCliente' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador']) or true) {
        // Se verifica la acción a realizar.
        switch ($_GET['action']) {
                // La acción searchRows permite buscar clientes por su nombre, apellido o correo.
            case 'searchRows':
                if (!Validator::validateSearch($_POST['buscarUsuario'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $clientes->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
                // La acción createRow permite crear un nuevo cliente.
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$clientes->setNombre($_POST['nombreCliente']) or
                    !$clientes->setApellido($_POST['apellidoCliente']) or
                    !$clientes->setDUI($_POST['duiCliente'], 0) or
                    !$clientes->setCorreo($_POST['correoCliente'], 0) or
                    !$clientes->setContra($_POST['contraCliente']) or
                    !$clientes->setTelefono($_POST['telefonoCliente'], 0) or
                    !$clientes->setTelefonoFijo($_POST['telefonoFijoCliente'], 0)
                ) {
                    $result['error'] = $clientes->getDataError();
                } elseif ($_POST['contraCliente'] != $_POST['confirmarContraCliente']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($_POST['telefonoCliente'] == $_POST['telefonoFijoCliente']) {
                    $result['error'] = 'El teléfono fijo no puede ser el mismo que el teléfono móvil';
                } elseif ($clientes->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cliente creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el cliente';
                }
                break;
                // La acción readAll permite seleccionar todos los clientes registrados.
            case 'readAll':
                if ($result['dataset'] = $clientes->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen clientes registrados';
                }
                break;
                // La acción readOne permite seleccionar la información de un cliente específico.
            case 'readOne':
                if (!$clientes->setId($_POST['idCliente'])) {
                    $result['error'] = 'Cliente incorrecto';
                } elseif ($result['dataset'] = $clientes->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Cliente inexistente';
                }
                break;
                // La acción updateRow permite editar la información de un registro específico.
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$clientes->setId($_POST['idCliente']) or
                    !$clientes->setNombre($_POST['nombreCliente']) or
                    !$clientes->setApellido($_POST['apellidoCliente']) or
                    !$clientes->setCorreo($_POST['correoCliente'], 1) or
                    !$clientes->setDUI($_POST['duiCliente'], 1) or
                    !$clientes->setTelefono($_POST['telefonoCliente'], 1) or
                    !$clientes->setTelefonoFijo($_POST['telefonoFijoCliente'], 1) or
                    !$clientes->setEstado($_POST['estadoCliente'])
                ) {
                    $result['error'] = $clientes->getDataError();
                } elseif ($_POST['telefonoCliente'] == $_POST['telefonoFijoCliente']) {
                    $result['error'] = 'El teléfono fijo no puede ser el mismo que el teléfono móvil';
                } elseif ($clientes->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cliente modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el cliente';
                }
                break;
                // La acción deleteRow permite eliminar un cliente.
            case 'deleteRow':
                if (!$clientes->setId($_POST['idCliente'])) {
                    $result['error'] = $clientes->getDataError();
                } elseif ($clientes->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cliente eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el cliente';
                }
                break;
            case 'readProfile':
                if(!$clientes->setId($_POST['idCliente'])){
                    $result['error'] = $clientes->getDataError();
                }
                elseif ($result['dataset'] = $clientes->readProfile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el perfil';
                }
                break;
                // Si no se encuentra la acción a realizar se muestra el error.
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
                break;
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
