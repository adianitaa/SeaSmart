// Ruta donde se encuentra el servicio de clientes.
const CLIENTE_API = 'services/admin/clientes.php';
// Se declara la constante que almacena la ruta de la API de direcciones.
const DIRECCION_API = 'services/admin/direcciones.php'
// Se almacena el formCliente para agregar o editar un cliente.
const FORM_CLIENTE = document.getElementById('formCliente');
// Se almacenan dentro de constantes los campos del form formCliente.
const ID_CLIENTE = document.getElementById('idCliente'),
    NOMBRE_CLIENTE = document.getElementById('nombreCliente'),
    APELLIDO_CLIENTE = document.getElementById('apellidoCliente'),
    CORREO_CLIENTE = document.getElementById('correoCliente'),
    CONTRA_CLIENTE = document.getElementById('contraCliente'),
    CONFIRMAR_CONTRA_CLIENTE = document.getElementById('confirmarContraCliente'),
    DUI_CLIENTE = document.getElementById('duiCliente'),
    TELEFONO_CLIENTE = document.getElementById('telefonoCliente'),
    TELEFONO_FIJO = document.getElementById('telefonoFijoCliente'),
    ESTADO_CLIENTE = document.getElementById('estadoCliente');
// Se almacena el contenedor con el select estadoCliente.
const CONTENEDOR_ESTADO = document.getElementById('contenedorEstadoCliente');
// Se almacena el modal para eliminar un cliente.
const MODAL_ELIMINAR_CLIENTE = new bootstrap.Modal('#borrarModalCliente');
// Se almacena el modal que muestra las direcciones del cliente.
const MODAL_DIRECCIONES = new bootstrap.Modal('#modalDireccionesCliente');
// Se almacena el form para eliminar un cliente.
const FORM_ELIMINAR_CLIENTE = document.getElementById('formEliminarCliente');
// Se almacena el contenedor que contiene las direcciones.
const CONTENEDOR_DIRECCIONES = document.getElementById('contenedorDirecciones');
// Se almacena el título del modal de direcciones.
const TITULO_MODAL_DIRECCIONES = document.getElementById('tituloModalDirecciones');

// Función que retorna el estado en base del resultado de la bd.
function validarEstado(estadoCliente) {
    if (estadoCliente == 1) {
        return "Activo";
    } else {
        return "Dado de baja";
    }
}

// Función para mostrar el modal que agrega o edita clientes.
const abrirModalCliente = async (tituloModal, idCliente) => {
    // Se configura el título del modal.
    TITULO_CLIENTE.textContent = tituloModal;
    if (idCliente == null) {
        // Se remueve el antiguo color del botón.
        BOTON_ACCION_CLIENTE.classList.remove('btn-success');
        // Se configura el nuevo color del botón.
        BOTON_ACCION_CLIENTE.classList.add('btn-primary');
        // Se configura el título del botón.
        BOTON_ACCION_CLIENTE.innerHTML = tituloModal;
        // Se limpian los input para dejarlos vacíos.
        FORM_CLIENTE.reset();
        // Se cambia el estado del select a activo.
        ESTADO_CLIENTE.selectedIndex = 0;
        // Se esconde el select.
        CONTENEDOR_ESTADO.classList.add('d-none');
        // Se habilitan los campos de contraseña y confirmar contraseña.
        CONTRA_CLIENTE.disabled = false;
        CONFIRMAR_CONTRA_CLIENTE.disabled = false;
        // Se restablece el atributo type de los input de contraseña y confirmar contraseña.
        CONTRA_CLIENTE.type = 'password';
        CONFIRMAR_CONTRA_CLIENTE.type = 'password';
        // Se muestra el modal para agregar clientes.
        MODAL_CLIENTE.show();
    } else {
        // Se define una constante tipo objeto que almacenará el idCliente.
        const FORM = new FormData();
        // Se almacena el nombre del campo y el valor (idCliente) en el formulario.
        FORM.append('idCliente', idCliente);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(CLIENTE_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se remueve el antiguo color del botón.
            BOTON_ACCION_CLIENTE.classList.remove('btn-primary');
            // Se configura el nuevo color del botón.
            BOTON_ACCION_CLIENTE.classList.add('btn-success');
            // Se configura el título del botón.
            BOTON_ACCION_CLIENTE.innerHTML = tituloModal;
            // Se prepara el formulario para cargar los input del idCliente.
            FORM_CLIENTE.reset();
            // Se cargan los campos de la base en una variable.
            const ROW = DATA.dataset;
            // Se carga el id de cliente en el input idCliente.
            ID_CLIENTE.value = ROW.id_cliente;
            // Se carga el nombre del cliente en el input nombreCliente.
            NOMBRE_CLIENTE.value = ROW.nombre_cliente;
            // Se carga el apellido del cliente en el input apellidoCliente.
            APELLIDO_CLIENTE.value = ROW.apellido_cliente;
            // Se carga el correo del cliente en el input correoCliente.
            CORREO_CLIENTE.value = ROW.correo_cliente;
            // Se carga el DUI del cliente en el input duiCliente.
            DUI_CLIENTE.value = ROW.dui_cliente
            // Se valida el estado del cliente.
            if (ROW.estado_cliente == 0) {
                // Se carga el estado del cliente en el select estadoCliente.
                ESTADO_CLIENTE.selectedIndex = 1;
            } else {
                ESTADO_CLIENTE.selectedIndex = 0;
            }
            // Se muestra el select.
            CONTENEDOR_ESTADO.classList.remove('d-none');
            // Se carga el teléfono del cliente.
            TELEFONO_CLIENTE.value = ROW.telefono_movil;
            // Se carga el teléfono fijo del cliente.
            TELEFONO_FIJO.value = ROW.telefono_fijo;
            // Se deshabilitan los campos de contraseña y confirmar contraseña.
            CONTRA_CLIENTE.disabled = true;
            CONFIRMAR_CONTRA_CLIENTE.disabled = true;
            // Se abre el modal editar cliente.
            MODAL_CLIENTE.show();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

// Método del evento para cuando se envía el formulario de agregar o editar cliente.
FORM_CLIENTE.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(FORM_CLIENTE);
    // Se verifica la acción a realizar.
    if (ID_CLIENTE.value) {
        action = 'updateRow';
        // Se verifica el valor del select
        // y se guarda en el form
        (ESTADO_CLIENTE.selectedIndex) ? estadoCliente = 0 : estadoCliente = 1;
        FORM.append('estadoCliente', estadoCliente);
    } else {
        action = 'createRow';
    }
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(CLIENTE_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        MODAL_CLIENTE.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        cargarTabla();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

// Función para abrir el modal eliminar cliente.
const abrirEliminarCliente = async (idCliente) => {
    // Se define una constante tipo objeto que almacenará el idCliente.
    const FORM = new FormData();
    // Se almacena el nombre del campo y el valor (idCliente) en el formulario.
    FORM.append('idCliente', idCliente);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(CLIENTE_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cargan los campos de la base en una variable.
        const ROW = DATA.dataset;
        // Se define el título del modal.
        document.getElementById('tituloModalEliminarCliente').innerHTML = "¿Desea eliminar el cliente " + ROW.nombre_cliente + "?";
        // Se carga el idCliente en el input inputIdCliente.
        document.getElementById('inputIdCliente').value = ROW.id_cliente;
        // Se abre el modal borrar cliente.
        MODAL_ELIMINAR_CLIENTE.show();
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

// La función abrirDirecciones permite mostrar el modal con las direcciones del cliente.
const abrirDirecciones = async (idCliente) => {
    // Se define una constante tipo objeto que almacenará el idCliente.
    const FORM = new FormData();
    // Se almacena el nombre del campo y el valor (idCliente) en el formulario.
    FORM.append('idCliente', idCliente);
    // Petición para obtener las direcciones del cliente.
    const DATA = await fetchData(DIRECCION_API, 'readAll', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializa el contenedor de direcciones.
        CONTENEDOR_DIRECCIONES.innerHTML = '';
        // Se cargan las direcciones dentro del contenedor.
        DATA.dataset.forEach(row => {
            CONTENEDOR_DIRECCIONES.innerHTML += `
            <div class="col-12">
                <div class="row">
                    <p class="fw-bold fs-4">Dirección ${row.id_direccion}</p>
                </div>
                <div class="row">
                    <p>${row.direccion}</p>
                </div>
            </div>
            `;
        });
        // Se asigna el título del modal.
        TITULO_MODAL_DIRECCIONES.textContent = 'Direcciones de ' + DATA.dataset[0].nombre_cliente + ' ' + DATA.dataset[0].apellido_cliente;
        // Se abre el modal para mostrar las direcciones del cliente.
        MODAL_DIRECCIONES.show();
    } else {
        if(DATA.error == 'No se han agregado direcciones'){
            sweetAlert(3, DATA.error, false);
        } else{
            sweetAlert(2, DATA.error, false);
        }
    }
}

// Método del evento para cuando se envía el formulario de eliminar cliente.
FORM_ELIMINAR_CLIENTE.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una constante tipo objeto donde se almacenará el idCliente.
    const FORM = new FormData(FORM_ELIMINAR_CLIENTE);
    // Petición para eliminar el registro seleccionado.
    const DATA = await fetchData(CLIENTE_API, 'deleteRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        //Se oculta el modal.
        MODAL_ELIMINAR_CLIENTE.hide();
        // Se muestra un mensaje de éxito.
        await sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        cargarTabla();
    } else {
        if (DATA.exception == 'Violación de restricción de integridad') {
            MODAL_ELIMINAR_CLIENTE.hide();
            sweetAlert(2, 'El cliente está involucrado en un pedido o cuenta con una o más direcciones', false);
        } else {
            MODAL_ELIMINAR_CLIENTE.hide();
            sweetAlert(2, DATA.error, false);
        }
    }
});

//Función para abrir reporte con la información de los clientes
const openReport = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte.
    const PATH = new URL(`${SERVER_URL}reports/admin/informacion_cliente.php`);    
    
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}