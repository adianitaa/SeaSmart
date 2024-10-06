// URL de la API para manejar clientes.
const CLIENTES_API = 'services/public/clientes.php';

// Referencias a los elementos del DOM.
const BTNMOSTRAR = document.getElementById('btnMostrar');
const BTNOCULTAR = document.getElementById('btnOcultar');
const TXTCONTRA = document.getElementById('contraRegistro');
const CONTENEDORC = document.getElementById('contenedor_contra');
const BTNMOSTRAR1 = document.getElementById('btnMostrar1');
const BTNOCULTAR1 = document.getElementById('btnOcultar1');
const TXTCONTRA1 = document.getElementById('confirmarContra'); 
const CONTENEDORC1 = document.getElementById('contenedor_contra_2');
const BTNCONTINUAR = document.getElementById('btnContinuar');

// Constante para establecer el formulario de registrar cliente.
const FORM_REGISTRO = document.getElementById('formRegistro');
// Llamada a la función para establecer la mascara del campo teléfono.
// vanillaTextMask.maskInput({
//     inputElement: document.getElementById('telefonoCliente'),
//     mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
// });
// Llamada a la función para establecer la mascara del campo DUI.
// vanillaTextMask.maskInput({
//     inputElement: document.getElementById('duiCliente'),
//     mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]
// });

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    cargarPlantilla(2);
});

// Método del evento para cuando se envía el formulario de registrar cliente.
FORM_REGISTRO.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(FORM_REGISTRO);
    // Petición para registrar un cliente.
    const DATA = await fetchData(CLIENTES_API, 'signUp', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        sweetAlert(1, DATA.message, true, 'inicio_sesion.html');
    } else if(DATA.error == "El correo ingresado ya existe"){
        sweetAlert(3, "El correo ingresado ya está siendo usado", false);
    } else if(DATA.error == "El DUI ingresado ya existe"){
        sweetAlert(3, "El DUI ingresado ya está siendo usado", false);
    } else {
        sweetAlert(2, DATA.error, false);
    }
});


// Función para mostrar la contraseña en el campo "contraRegistro".
function MostrarContra(){
    BTNMOSTRAR.remove();
    CONTENEDORC.appendChild(BTNOCULTAR);
    TXTCONTRA.type = 'text';
    TXTCONTRA.focus();
}

// Función para ocultar la contraseña en el campo "contraRegistro".
function OcultarContra(){
    BTNOCULTAR.remove();
    CONTENEDORC.appendChild(BTNMOSTRAR);
    TXTCONTRA.type = 'password';
    TXTCONTRA.focus();
}

// Función para mostrar la contraseña en el campo "confirmarContra".
function MostrarContra1(){
    BTNMOSTRAR1.remove();
    CONTENEDORC1.appendChild(BTNOCULTAR1);
    TXTCONTRA1.type = 'text';
    TXTCONTRA1.focus();
}

// Función para ocultar la contraseña en el campo "confirmarContra".
function OcultarContra1(){
    BTNOCULTAR1.remove();
    CONTENEDORC1.appendChild(BTNMOSTRAR1);
    TXTCONTRA1.type = 'password';
    TXTCONTRA1.focus();
}

//Remueve los botones "Ocultar" para las contraseñas.
BTNOCULTAR.remove();
BTNOCULTAR1.remove();
