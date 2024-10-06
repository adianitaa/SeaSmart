<?php
// Se incluye la clase del modelo.
require_once('../../models/data/administrador_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $administrador = new AdministradorData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'correoAdmin' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador'])) {
        // Se cambia el valor de la session, 1 = sesión iniciada.
        $result['session'] = 1;
        // Se verifica la acción a realizar.
        switch ($_GET['action']) {
                // La acción searchRows permite buscar administradores por su nombre, apellido o correo.
            case 'searchRows':
                if (!Validator::validateSearch($_POST['buscarUsuario'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $administrador->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
                // La acción createRow permite crear un nuevo administrador.
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$administrador->setNombre($_POST['nombreAdministrador']) or
                    !$administrador->setApellido($_POST['apellidoAdministrador']) or
                    !$administrador->setCorreo($_POST['correoAdministrador'], 0) or
                    !$administrador->setContra($_POST['contraAdministrador'])
                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($_POST['contraAdministrador'] != $_POST['confirmarContraAdmin']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($administrador->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el administrador';
                }
                break;
                // La acción readAll permite seleccionar todos los administradores registrados.
            case 'readAll':
                if ($result['dataset'] = $administrador->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen administradores registrados';
                }
                break;
                // La acción readOne permite seleccionar la información de un administrador específico.
            case 'readOne':
                if (!$administrador->setId($_POST['idAdministrador'])) {
                    $result['error'] = 'Administrador incorrecto';
                } elseif ($result['dataset'] = $administrador->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Administrador inexistente';
                }
                break;
                // La acción updateRow permite editar la información de un registro específico.
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (($_SESSION['idAdministrador'] == $_POST['idAdministrador']) and $_POST['estadoAdministrador'] == 0) {
                    $result['error'] = 'No se puede cambiar el estado de su cuenta';
                } elseif (
                    !$administrador->setId($_POST['idAdministrador']) or
                    !$administrador->setNombre($_POST['nombreAdministrador']) or
                    !$administrador->setApellido($_POST['apellidoAdministrador']) or
                    !$administrador->setCorreo($_POST['correoAdministrador'], 1) or
                    !$administrador->setEstado($_POST['estadoAdministrador'])
                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($administrador->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el administrador';
                }
                break;
                // La acción deleteRow permite eliminar un administrador.
            case 'deleteRow':
                if ($_POST['idAdministrador'] == $_SESSION['idAdministrador']) {
                    $result['error'] = 'No se puede eliminar a sí mismo';
                } elseif (!$administrador->setId($_POST['idAdministrador'])) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($administrador->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el administrador';
                }
                break;
                // La acción getUser valida que se haya iniciado sesión.
            case 'getUser':
                if (isset($_SESSION['correoAdministrador'])) {
                    $result['status'] = 1;
                    $result['correoAdmin'] = $_SESSION['correoAdministrador'];
                } else {
                    $result['error'] = 'Correo no definido';
                }
                break;
                // La acción logOut permite cerrar la sesión de administrador.
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando un administrador no ha iniciado sesión.
        switch ($_GET['action']) {
                // Se leen todos los registros para verificar que exista un administrador registrado.
            case 'readUsers':
                if ($administrador->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Debe autenticarse para ingresar';
                } else {
                    $result['error'] = 'Debe crear un administrador para comenzar';
                }
                break;
                // La acción signUp valida la información del usuario y agrega el primer registro a la tabla administradores.
            case 'signUp':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$administrador->setNombre($_POST['NombreAdmin'])
                    or
                    !$administrador->setApellido($_POST['ApellidoAdmin'])
                    or
                    !$administrador->setCorreo($_POST['CorreoAdmin'], 0)
                    or
                    !$administrador->setContra($_POST['ContraAdmin'])
                ) {
                    $result['error'] = $administrador->getDataError();
                } else if ($_POST['ContraAdmin'] != $_POST['ConfirmarContra']) {
                    $result['error'] = 'Las contraseñas son diferentes';
                } elseif ($administrador->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador registrado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al registrar el administrador';
                }
                break;
                // La acción logIn verifica las credenciales del administrador para poder ingresar al programa.
            case 'logIn':
                // Se validan los campos del form que se encuentran en el array $_POST.
                $_POST = Validator::validateForm($_POST);
                // Se valida el estado del administrador.
                if ($administrador->checkUser($_POST['CorreoAdmin'], $_POST['ContraAdmin']) == 'Estado inactivo') {
                    // Si el estado del administrador es inactivo se muestra un mensaje con el error.
                    $result['error'] = 'Su cuenta ha sido desactivada por un administrador';
                } elseif ($administrador->checkUser($_POST['CorreoAdmin'], $_POST['ContraAdmin'])) {
                    // Si el estado del administrador es activo se ejecuta el código.
                    // Se asigna el valor de status.
                    $result['status'] = 1;
                    // Se asigna el id del administrador proveniente de la función checkUser()
                    // dentro del array de la sesión $_SESSION.
                    $_SESSION['idAdministrador'] = $administrador->checkUser($_POST['CorreoAdmin'], $_POST['ContraAdmin'])[0];
                    // Se asigna el correo del administrador proveniente de la función checkUser()
                    // dentro del array de la sesión $_SESSION.
                    $_SESSION['correoAdministrador'] = $administrador->checkUser($_POST['CorreoAdmin'], $_POST['ContraAdmin'])[1];
                    // Se devuelve el mensaje del resultado de la acción logIn.
                    $result['message'] = 'Autenticación correcta';
                } else {
                    $result['error'] = 'Credenciales incorrectas';
                }
                break;
                // Si el usuario no ha iniciado sesión no permite realizar las acciones updateRow, createRow,
                // deleteRow (Acciones que si están permitidas cuando el usuario ha iniciado sesión).
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
