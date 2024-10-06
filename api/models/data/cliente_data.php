<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/cliente_handler.php');

/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla ADMINISTRADOR.
 */
class ClienteData extends ClienteHandler
{
    // Atributo para el manejo de errores.
    private $info_error = null;

    /*
    *  Métodos para validar y asignar los valores de los atributos.
    */

    // Método para establecer el ID del cliente.
    public function setId($valor)
    {
        if (Validator::validateNaturalNumber($valor)) {
            $this->id = $valor;
            return true;
        } else {
            $this->info_error = 'El identificador del cliente es correcto';
            return false;
        }
    }

    // Método para establecer el nombre del cliente.
    public function setNombre($valor, $min = 4, $max = 50)
    {
        if (!Validator::validateAlphabetic($valor)) {
            $this->info_error = 'El nombre debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($valor, $min, $max)) {
            $this->nombre = $valor;
            return true;
        } else {
            $this->info_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para establecer el apellido del cliente.
    public function setApellido($valor, $min = 4, $max = 50)
    {
        if (!Validator::validateAlphabetic($valor)) {
            $this->info_error = 'El apellido debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($valor, $min, $max)) {
            $this->apellido = $valor;
            return true;
        } else {
            $this->info_error = 'El apellido debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para establecer el correo del cliente.
    public function setCorreo($valor, $boolean = null, $min = 8, $max = 100)
    {
        if (!Validator::validateEmail($valor)) {
            $this->info_error = 'El correo no es válido';
            return false;
        } elseif (Validator::validateLength($valor, $min, $max)) {
            // Verifica si el correo ya existe en la base de datos
            if ($boolean and $this->checkDuplicateWithId($valor)) {
                $this->info_error = 'El correo ingresado ya está siendo utilizado';
                return false;
            } elseif (!$boolean and $this->checkDuplicate($valor)) {
                $this->info_error = 'El correo ingresado ya está siendo utilizado';
                return false;
            } else {
                // Si todas las validaciones pasan, establece el correo
                $this->correo = $valor;
                return true;
            }
        } else {
            $this->info_error = 'El correo debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setVerificarCorreo($valor)
    {
        if (!Validator::validateEmail($valor)) {
            $this->info_error = 'El correo no es válido';
            return false;
        } else {
            $this->correo = $valor;
            return true;
        }
    }

    // Método para establecer la contraseña del cliente.
    public function setContra($valor)
    {
        if (Validator::validatePassword($valor)) {
            $this->contra = password_hash($valor, PASSWORD_DEFAULT);
            return true;
        } else {
            $this->info_error = Validator::getPasswordError();
            return false;
        }
    }

    // Método para establecer el DUI del cliente.
    public function setDUI($value, $boolean)
    {
        if (!Validator::validateDUI($value)) {
            $this->info_error = 'El DUI debe tener el formato ########-#' . $value;
            return false;
        } else if ($boolean and $this->checkDuplicateWithId($value)) {
            $this->info_error = 'El DUI ingresado ya está siendo utilizado por otro cliente';
            return false;
        } elseif (!$boolean and $this->checkDuplicate($value)) {
            $this->info_error = 'El DUI ingresado ya está siendo utilizado por otro cliente';
            return false;
        } else {
            $this->dui = $value;
            return true;
        }
    }

    // Método para establecer el estado del cliente.
    public function setEstado($value)
    {
        if (Validator::validateBoolean($value)) {
            $this->estado = $value;
            return true;
        } else {
            $this->info_error = 'Estado incorrecto';
            return false;
        }
    }

    // Método para establecer el teléfono móvil del cliente.
    public function setTelefono($value, $boolean)
    {
        if (!Validator::validatePhone($value)) {
            $this->info_error = 'El teléfono debe iniciar con el formato ###-####';
            return false;
        } elseif ($boolean and $this->checkDuplicateWithId($value)) {
            $this->info_error = 'El teléfono ingresado ya está siendo usado por otro cliente';
            return false;
        } elseif (!$boolean and $this->checkDuplicate($value)) {
            $this->info_error = 'El teléfono ingresado ya está siendo usado por otro cliente';
            return false;
        } elseif ($this->telefono_fijo && $this->telefono_fijo == $value) {
            $this->info_error = 'El teléfono móvil no puede ser igual al teléfono fijo de otro cliente';
            return false;
        } else {
            $this->telefono = $value;
            return true;
        }
    }

    // Método para establecer el teléfono fijo del cliente.
    public function setTelefonoFijo($value, $boolean)
    {
        if (!Validator::validatePhone($value)) {
            $this->info_error = 'El teléfono fijo debe iniciar con el formato ####-####';
            return false;
        } elseif ($boolean and $this->checkDuplicateWithId($value)) {
            $this->info_error = 'El teléfono fijo ingresado ya está siendo usado por otro cliente';
            return false;
        } elseif (!$boolean and $this->checkDuplicate($value)) {
            $this->info_error = 'El teléfono fijo ingresado ya está siendo usado por otro cliente';
            return false;
        } elseif ($this->telefono && $this->telefono == $value) {
            $this->info_error = 'El teléfono fijo no puede ser igual al teléfono móvil';
            return false;
        } else {
            $this->telefono_fijo = $value;
            return true;
        }
    }
    //  if ($result) {
    //         // Generar un enlace de recuperación
    //         $token = bin2hex(random_bytes(32)); // Generar un token único

    //         // Guardar el token en la base de datos asociado al correo electrónico
    //         $query = 'UPDATE clientes SET contra_cliente = ? WHERE correo_cliente = ?';
    //         $params = array($token, $correo);
    //         Database::executeRow($query, $params);

    //         // Enviar el correo electrónico con el enlace de recuperación
    //         $subject = 'Recuperación de contraseña';
    //         $message = 'Utiliza el siguiente token para recuperar tu contraseña: ' . $token;
    //         $headers = 'From: 20220356@ricaldone.edu.sv';

    //         return mail($correo, $subject, $message, $headers);
    //     } else {
    //         return false; // Correo no encontrado
    //     }


    // Método para obtener el mensaje de error.
    public function getDataError()
    {
        return $this->info_error;
    }
}
