<?php
// Se incluye la clase del modelo.
require_once('../../models/data/cliente_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $cliente = new ClienteData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'recaptcha' => 0, 'message' => null, 'error' => null, 'exception' => null, 'username' => null, 'debug' => null, 'usuario' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    if (isset($_SESSION['idCliente'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un cliente ha iniciado sesión.
        switch ($_GET['action']) {
            case 'validarSesion':
                $result['status'] = 1;
                break;
            case 'createRow':
                // Se validan los datos del formulario.
                $_POST = Validator::validateForm($_POST);
                // Se comprueba y establecen los datos del cliente.
                if (
                    !$cliente->setNombre($_POST['nombreCliente']) or
                    !$cliente->setApellido($_POST['apellidoCliente']) or
                    !$cliente->setDUI($_POST['duiCliente'], 0) or
                    !$cliente->setCorreo($_POST['correoCliente'], 0) or
                    !$cliente->setContra($_POST['contraCliente']) or
                    !$cliente->setTelefono($_POST['telefonoCliente'], 0) or
                    !$cliente->setTelefonoFijo($_POST['telefonoFijoCliente'], 0)
                ) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($_POST['contraCliente'] != $_POST['confirmarContraCliente']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($_POST['telefonoCliente'] == $_POST['telefonoFijoCliente']) {
                    $result['error'] = 'El teléfono fijo no puede ser el mismo que el teléfono móvil';
                } elseif ($cliente->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cliente creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el cliente';
                }
                break;
            case 'getUser':
                // Se obtiene el correo del cliente si está en sesión.
                if (isset($_SESSION['correoCliente'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['correoCliente'];
                } else {
                    $result['error'] = 'Correo de usuario indefinido';
                }
                break;
            case 'logOut':
                // Se cierra la sesión del cliente.
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
            case 'readProfile':
                if ($result['dataset'] = $cliente->readProfile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el perfil';
                }
                break;
            case 'editProfile':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cliente->setId($_POST['idCliente']) or
                    !$cliente->setNombre($_POST['nombreCliente']) or
                    !$cliente->setApellido($_POST['apellidoCliente']) or
                    !$cliente->setCorreo($_POST['correoCliente'], 1) or
                    !$cliente->setDUI($_POST['duiCliente'], 1) or
                    !$cliente->setTelefono($_POST['telefonoCliente'], 1) or
                    !$cliente->setTelefonoFijo($_POST['telefonoFijoCliente'], 1)
                ) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($cliente->editProfile()) {
                    $result['status'] = 1;
                    $result['message'] = 'Perfil modificado correctamente';
                    $_SESSION['idCliente'] = $_POST['idCliente'];
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el perfil';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
                break;
        }
    } else {
        // Se compara la acción a realizar cuando el cliente no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'signUp':
                // Se establecen los datos del cliente.
                if (
                    !$cliente->setNombre($_POST['nombreCliente']) or
                    !$cliente->setApellido($_POST['apellidoCliente']) or
                    !$cliente->setCorreo($_POST['correoCliente'], 0) or
                    !$cliente->setDUI($_POST['duiCliente'], 0) or
                    !$cliente->setTelefono($_POST['telefonoMovil'], 0) or
                    !$cliente->setTelefonoFijo($_POST['telefonoFijo'], 0) or
                    !$cliente->setContra($_POST['claveCliente'])
                ) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($_POST['claveCliente'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($cliente->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cuenta registrada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al registrar la cuenta';
                }
                break;
                // Acción para recuperar la contraseña
            case 'recoverPassword':
                // $data = json_decode(file_get_contents('php://input'), true);
                // $correo = $data['correo'] ?? '';

                echo $_POST['correo'];

                if (empty($correo)) {
                    $result['error'] = 'El correo electrónico es obligatorio';
                } elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
                    $result['error'] = 'El formato del correo electrónico es inválido';
                } elseif ($clientes->recoverPassword($correo)) {
                    $result['status'] = 1;
                    $result['message'] = 'Se ha enviado un enlace para recuperar la contraseña a tu correo electrónico.';
                } else {
                    $result['error'] = 'No se pudo enviar el correo de recuperación';
                }
                break;
            case 'verificarCorreo':
                if (!$cliente->setVerificarCorreo($_POST['correoCliente'])) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($result['dataset'] = $cliente->verificarCorreo()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No se puedo verificar el correo';
                }
                break;
            case 'restablecerContra':
                if (
                    !$cliente->setContra($_POST['contraCliente']) or
                    !$cliente->setId($_POST['idCliente'])
                ) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($_POST['contraCliente'] != $_POST['confirmarContra']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($cliente->restablecerContra()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña restablecida';
                } else {
                    $result['error'] = 'Ocurrió un problema al restablecer la contraseña';
                }
                break;
            case 'logIn':
                // Se validan los campos del form que se encuentran en el array $_POST.
                $_POST = Validator::validateForm($_POST);
                if ($cliente->checkUser($_POST['correo'], $_POST['contra'])) {
                    // Se asigna el valor de status.
                    $result['status'] = 1;
                    // Se asignan los valores de sesión obtenidos de la función checkUser().
                    // Se devuelve el mensaje del resultado de la acción logIn.
                    $result['message'] = 'Autenticación correcta';
                    $result['username'] = $_SESSION['correoCliente'];
                    $result['nombre'] = $_SESSION['nombre'];
                } elseif (isset($_SESSION['estado']) and $_SESSION['estado'] == 0) {
                    $result['error'] = 'Su cuenta ha sido desactivada';
                } else {
                    $result['error'] = 'Las credenciales son incorrectas';
                }
                break;

            default:
                $result['error'] = 'Acción no disponible fuera de la sesión';
                break;
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
