// Ruta donde se encuentra el servicio de administradores.
const ADMINISTRADOR_API = 'services/admin/administrador.php';
// Se almacena el select con las opciones de usuarios.
const SELECT_USUARIOS = document.getElementById('selectUsuarios');
// Se almacena la columna donde se cargan la cantidad de registros de 
// administradores y clientes.
const FILAS_ADMINISTRADORES = document.getElementById('filasAdministradores'),
    FILAS_CLIENTES = document.getElementById('filasClientes');
// Se almacena el cuerpo de la tabla de administradores y clientes.
const CUERPO_ADMIN = document.getElementById('cuerpoTablaAdmin'),
    CUERPO_CLIENTES = document.getElementById('cuerpoTablaClientes');
// Se almacena el form para buscar un usuario.
const FORM_BUSCAR = document.getElementById('formBuscar');
// Se crea una instancia del modal para agregar o editar administradores.
const MODAL_ADMIN = new bootstrap.Modal('#modalAdmin');
// Se crea una instancia del modal para agregar o editar clientes.
const MODAL_CLIENTE = new bootstrap.Modal('#modalCliente');
// Se crea una instancia del modal para eliminar administradores.
const MODAL_ELIMINAR_ADMIN = new bootstrap.Modal('#borrarModalAdministrador');
// Se almacena el formAdmin para agregar o editar un administrador.
const FORM_ADMIN = document.getElementById('formAdmin');
// Se almacenan dentro de constantes los campos del formAdmin.
const NOMBRE_ADMIN = document.getElementById('nombreAdministrador'),
    ID_ADMIN = document.getElementById('idAdministrador'),
    APELLIDO_ADMIN = document.getElementById('apellidoAdministrador'),
    CORREO_ADMIN = document.getElementById('correoAdministrador'),
    CONTRA_ADMIN = document.getElementById('contraAdministrador'),
    CONFIRMAR_CONTRA_ADMIN = document.getElementById('confirmarContraAdmin');
// Se almacenan las etiquetas que contienen los títulos de los modals.
const TITULO_ADMIN = document.getElementById('tituloModalAdmin'),
    TITULO_CLIENTE = document.getElementById('tituloModalCliente');
// Se almacenan los botones que realizan las acciones de agregar y editar
// en los modals de administrador y cliente.
const BOTON_ACCION_ADMIN = document.getElementById('btnAccionAdmin'),
    BOTON_ACCION_CLIENTE = document.getElementById('btnAccionCliente');
// Se almacena el boton que abre el modal para editar o eliminar.
const BOTON_AGREGAR = document.getElementById('botonAgregar');
// Se almacena el input que sirve para filtrar registros.
const INPUT_BUSQUEDA = document.getElementById('buscarUsuario');
// Se almacena el form para eliminar un administrador (Contiene inputIdAdministrador).
const FORM_ELIMINAR_ADMIN = document.getElementById('formEliminarAdmin');
// Se almacena el contenedor con el select estadoAdmin.
const CONTENEDOR_ESTADO_ADMIN = document.getElementById('contenedorEstadoAdmin');
// Se almacena el select estadoAdmin.
const ESTADO_ADMIN = document.getElementById('estadoAdministrador');
// Se almacena el botón para generar el reporte en la constante.
const BOTON_REPORTE_CLIENTES = document.getElementById('botonReporteClientes');

// Evento que carga los recursos de barra de navegación y función de rellenar tabla.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    cargarPlantilla();
    //Se carga la tabla de administradores con los registros de la base de datos.
    cargarTabla();
});

const cargarTabla = async (form = null) => {
    if (SELECT_USUARIOS.value == "Administradores") {
        // Se oculta el botón de reporte.
        BOTON_REPORTE_CLIENTES.classList.add('d-none');
        // Se cambia el texto dentro del botón de agregar.
        BOTON_AGREGAR.innerHTML = '+ Agregar administrador';
        //Se cambia el placeholder dentro del input para filtrar registros.
        INPUT_BUSQUEDA.placeholder = 'Buscar administrador por nombre, apellido o correo...';
        // Se muestra la tabla de administradores.
        document.getElementById('tablaAdmin').classList.remove('d-none');
        // Se oculta la tabla de clientes.
        document.getElementById('tablaClientes').classList.add('d-none');
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(ADMINISTRADOR_API, action, form);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se inicializa el contenido de la tabla.
            FILAS_ADMINISTRADORES.textContent = '';
            CUERPO_ADMIN.innerHTML = '';
            // Se recorre el conjunto de registros fila por fila.
            DATA.dataset.forEach(row => {
                // Se valida el estado del administrador.
                estadoCliente = validarEstado(row.estado_administrador);
                // Se crean y concatenan las filas de la tabla con los datos de cada registro.

                CUERPO_ADMIN.innerHTML += `
                <tr>
                    <td>${row.nombre_administrador}</td>
                    <td>${row.apellido_administrador}</td>
                    <td>${row.correo_administrador}</td>
                    <td>${row.fecha_registro}</td>
                    <td>${estadoCliente}</td>
                    <td>
                        <button type="button" class="btn btn-success" onclick="abrirModalAdmin('Editar administrador',${row.id_administrador})">
                            <img src="../../resources/img/lapiz.png" alt="lapizEditar" width="30px">
                        </button>
                        <button type="button" class="btn btn-danger" onclick="abrirEliminarAdmin(${row.id_administrador})">
                            <img src="../../resources/img/eliminar.png" alt="lapizEliminar" width="30px">
                        </button>
                    </td>
                </tr>
            `;
            });
            // Se muestra un mensaje de acuerdo con el resultado.
            FILAS_ADMINISTRADORES.textContent = DATA.message;
        } else {
            // En caso de que no existan clientes registrados o no se encuentren coincidencias de búsqueda. 
            if (DATA.error == 'No existen administradores registrados' || DATA.error == 'No hay coincidencias') {
                // Se muestra el mensaje de la API.
                sweetAlert(4, DATA.error, true);
                // Se restablece el contenido de la tabla.
                FILAS_ADMINISTRADORES.textContent = '';
                CUERPO_ADMIN.innerHTML = '';
            } else if (DATA.error == 'Ingrese un valor para buscar') {
                // Se muestra el mensaje de la API.
                sweetAlert(4, DATA.error, true);
            } else {
                // Se muestra el error de la API.
                sweetAlert(2, DATA.error, true);
            }
        }
    }
    else {
        // Se muestra el botón de reporte.
        BOTON_REPORTE_CLIENTES.classList.remove('d-none');
        // Se cambia el texto dentro del botón de agregar.
        BOTON_AGREGAR.innerHTML = '+ Agregar cliente';
        //Se cambia el placeholder dentro del input para filtrar registros.
        INPUT_BUSQUEDA.placeholder = 'Buscar cliente por nombre, apellido o correo...';
        // Se muestra la tabla de clientes.
        document.getElementById('tablaClientes').classList.remove('d-none');
        // Se oculta la tabla de administradores.
        document.getElementById('tablaAdmin').classList.add('d-none');
        // Se verifica la acción a realizar.
        (form) ? action = 'searchRows' : action = 'readAll';
        // Petición para obtener los registros disponibles.
        const DATA = await fetchData(CLIENTE_API, action, form);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se inicializa el contenido de la tabla.
            FILAS_CLIENTES.textContent = '';
            CUERPO_CLIENTES.innerHTML = '';
            // Se recorre el conjunto de registros fila por fila.
            DATA.dataset.forEach(row => {
                //Se valida el estado del cliente para cargarlo en la columna.
                var estadoCliente = validarEstado(row.estado_cliente);
                // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                CUERPO_CLIENTES.innerHTML += `
                        <tr>
                            <td>${row.nombre_cliente}</td>
                            <td>${row.apellido_cliente}</td>
                            <td>${row.correo_cliente}</td>
                            <td>${row.dui_cliente}</td>
                            <td>${estadoCliente}</td>
                            <td class="text-center">
                                <button type="button" class="btn btn-success" onclick="abrirModalCliente('Editar administrador',${row.id_cliente})">
                                    <img src="../../resources/img/lapiz.png" alt="lapizEditar" width="30px">
                                </button>
                                <button type="button" class="btn btn-danger" onclick="abrirEliminarCliente(${row.id_cliente})">
                                    <img src="../../resources/img/eliminar.png" alt="lapizEliminar" width="30px">
                                </button>
                                <button type="button" class="btn btn-primary" onclick="abrirDirecciones(${row.id_cliente})">
                                    <img src="../../resources/img/hogar.png" alt="direccionesVer" width="30px">
                                </button>
                                <button type="button" class="btn btn-warning" onclick="cargarReporte(${row.id_cliente})">
                                    <i class="bi bi-filetype-pdf fs-5 text-light"></i>
                                </button>
                            </td>
                        </tr>
                    `;
            });
            // Se muestra un mensaje de acuerdo con el resultado.
            FILAS_CLIENTES.textContent = DATA.message;
        } else {
            // En caso de que no existan clientes registrados o no se encuentren coincidencias de búsqueda. 
            if (DATA.error == 'No existen clientes registrados' || DATA.error == 'No hay coincidencias') {
                // Se muestra el mensaje de la API.
                sweetAlert(4, DATA.error, true);
                // Se restablece el contenido de la tabla.
                FILAS_CLIENTES.textContent = '';
                CUERPO_CLIENTES.innerHTML = '';
            } else if (DATA.error == 'Ingrese un valor para buscar') {
                // Se muestra el mensaje de la API.
                sweetAlert(4, DATA.error, true);
            } else {
                // Se muestra el error de la API.
                sweetAlert(2, DATA.error, true);
            }
        }
    }
}

// Función que permite cargar un reporte formato pdf con la información del cliente.
async function cargarReporte(id_cliente) {
    // Se crea el form dónde se almacenará el id del cliente.
    const FORM = new FormData();
    // Se almacena el id del cliente en el form.
    FORM.append('idCliente', id_cliente);
    // Se realiza una petición a la API para obtener la información del cliente.
    const DATA = await fetchData(CLIENTE_API, 'readProfile', FORM);
    // Si la respuesta es satisfactoria se ejecuta el código.
    if (DATA.status) {
        // Se crea el contenedor padre.
        const CONTENEDOR_PADRE = document.createElement('div');
        // Se agregan las clases del framework de diseño,
        CONTENEDOR_PADRE.classList.add('container-fluid', 'p-5');
        // Se carga la información del cliente en el contenedor principal.
        CONTENEDOR_PADRE.innerHTML = `
            <div class="row">
                <div class="col-4 d-flex align-items-center">
                    <img src="../../resources/img/logo_grande.png" class="img-fluid" style="height:50px; width:50px">
                </div>
                <div class="col d-flex align-items-center">
                    <p class="fw-bold fs-5 text-start psinmargen">Información del cliente</p>
                </div>
            </div>
            <div class="row mt-5">
                <p class="fw-semibold">Datos personales</p>
                <hr>
            </div>
            <div class="row mt-2">
                <div class="col-6 d-flex align-items-center">
                    <p class="fw-semibold">Nombre: ${DATA.dataset.nombre_cliente}</p>
                </div>
                <div class="col-6 d-flex align-items-center">
                    <p class="fw-semibold">Correo electrónico: ${DATA.dataset.correo_cliente}</p>
                </div>
                <div class="col-6 d-flex align-items-center">
                    <p class="fw-semibold">Teléfono Móvil: ${DATA.dataset.telefono_movil}</p>
                </div>
                <div class="col-6 d-flex align-items-center">
                    <p class="fw-semibold">Teléfono Fijo: ${DATA.dataset.telefono_fijo}</p>
                </div>
                <div class="col-6 d-flex align-items-center">
                    <p class="fw-semibold">DUI: ${DATA.dataset.dui_cliente}</p>
                </div>
                <hr>
                <div class="col-6 d-flex align-items-center">
                    <p class="fw-semibold">Pedidos realizados: ${DATA.dataset.pedidos}</p>
                </div>
            </div>
        `;
        // Se carga el pdf y se guarda en el equipo del cliente.
        html2pdf().from(CONTENEDOR_PADRE).toPdf().get('pdf').then((pdf) => descargarPdf(pdf));
    } else {
        // Se muestra el mensaje con el error.
        sweetAlert(2, DATA.error, false);
    }
}

// Función que permite descargar el pdf en el equipo del cliente.
function descargarPdf(pdf){
    // Se crea la etiqueta a para abrir el documento en una nueva pestaña.
    let link = document.createElement('a');
    // Se indica que el documento se abrirá en una nueva pestaña.
    link.target = '_blank';
    // Se almacena el pdf en la etiqueta.
    link.href = pdf.output('bloburl');
    // Se configura el nombre del documento.
    link.download = 'Informacion Personal.pdf';
    // Se abre el link para comenzar la descarga y se quita el link posteriormente.
    link.click();
    link.remove();
}

// Método del evento para cuando se envía el formulario de buscar.
FORM_BUSCAR.addEventListener('submit', (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(FORM_BUSCAR);
    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    cargarTabla(FORM);
});

// Función que vuelve a cargar los registros de la tabla
// cuando la barra de búsqueda está vacía
function verificarReset() {
    if (document.getElementById('buscarUsuario').value == "") {
        cargarTabla();
    }
}

// Función para determinar que modal se abrirá
// en base al valor del dropdown (select)
function validarAbrirModal() {
    if (SELECT_USUARIOS.value == "Administradores") {
        abrirModalAdmin('Agregar usuario');
    } else {
        abrirModalCliente('Agregar cliente');
    }
}

// Función para mostrar el modal que agrega o edita administradores.
const abrirModalAdmin = async (tituloModal, idAdministrador) => {
    // Se configura el título del modal.
    TITULO_ADMIN.textContent = tituloModal;
    if (idAdministrador == null) {
        // Se remueve el antiguo color del botón.
        BOTON_ACCION_ADMIN.classList.remove('btn-success');
        // Se configura el nuevo color del botón.
        BOTON_ACCION_ADMIN.classList.add('btn-primary');
        // Se configura el título del botón.
        BOTON_ACCION_ADMIN.innerHTML = tituloModal;
        // Se limpian los input para dejarlos vacíos.
        FORM_ADMIN.reset();
        // Se habilitan los campos de contraseña y confirmar contraseña.
        CONTRA_ADMIN.disabled = false;
        CONFIRMAR_CONTRA_ADMIN.disabled = false;
        // Se restablece el atributo type de los input de contraseña y confirmar contraseña.
        CONTRA_ADMIN.type = 'password';
        CONFIRMAR_CONTRA_ADMIN.type = 'password';
        // Se esconde el contenedor con select estadoAdmin.
        CONTENEDOR_ESTADO_ADMIN.classList.add('d-none');
        // Se muestra el modal para agregar administradores.
        MODAL_ADMIN.show();
    } else {
        // Se define una constante tipo objeto que almacenará el idAdministrador.
        const FORM = new FormData();
        // Se almacena el nombre del campo y el valor (idAdministrador) en el formulario.
        FORM.append('idAdministrador', idAdministrador);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(ADMINISTRADOR_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se remueve el antiguo color del botón.
            BOTON_ACCION_ADMIN.classList.remove('btn-primary');
            // Se configura el nuevo color del botón.
            BOTON_ACCION_ADMIN.classList.add('btn-success');
            // Se configura el título del botón.
            BOTON_ACCION_ADMIN.innerHTML = 'Editar administrador';
            // Se prepara el formulario para cargar los input del administrador.
            FORM_ADMIN.reset();
            // Se muestra el contenedor con select estadoAdmin.
            CONTENEDOR_ESTADO_ADMIN.classList.remove('d-none');
            // Se cargan los campos de la base en una variable.
            const ROW = DATA.dataset;
            // Se valida el estado del administrador.
            if (ROW.estado_administrador == 0) {
                // Se carga el estado del administrador en el select estadoAdministrador.
                ESTADO_ADMIN.selectedIndex = 1;
            } else {
                ESTADO_ADMIN.selectedIndex = 0;
            }
            // Se carga el id de administrador en el input idAdministrador.
            ID_ADMIN.value = ROW.id_administrador;
            // Se carga el nombre del administrador en el input nombreAdministrador.
            NOMBRE_ADMIN.value = ROW.nombre_administrador;
            // Se carga el apellido del administrador en el input apellidoAdministrador.
            APELLIDO_ADMIN.value = ROW.apellido_administrador;
            // Se carga el correo del administrador en el input correoAdministrador.
            CORREO_ADMIN.value = ROW.correo_administrador;
            // Se deshabilitan los campos de contraseña y confirmar contraseña.
            CONTRA_ADMIN.disabled = true;
            CONFIRMAR_CONTRA_ADMIN.disabled = true;
            // Se abre el modal editar administrador.
            MODAL_ADMIN.show();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

// Función para abrir el modal eliminar administrador.
const abrirEliminarAdmin = async (idAdministrador) => {
    // Se define una constante tipo objeto que almacenará el idAdministrador.
    const FORM = new FormData();
    // Se almacena el nombre del campo y el valor (idAdministrador) en el formulario.
    FORM.append('idAdministrador', idAdministrador);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(ADMINISTRADOR_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cargan los campos de la base en una variable.
        const ROW = DATA.dataset;
        // Se define el título del modal.
        document.getElementById('tituloModalEliminarAdmin').innerHTML = "¿Desea eliminar el administrador " + ROW.nombre_administrador + "?";
        // Se carga el idAdministrador en el input inputIdAdministrador.
        document.getElementById('inputIdAdministrador').value = ROW.id_administrador;
        // Se abre el modal borrar administrador.
        MODAL_ELIMINAR_ADMIN.show();
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

// Método del evento para cuando se envía el formulario de eliminar administrador.
FORM_ELIMINAR_ADMIN.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una constante tipo objeto donde se almacenará el idAdministrador.
    const FORM = new FormData(FORM_ELIMINAR_ADMIN);
    // Petición para eliminar el registro seleccionado.
    const DATA = await fetchData(ADMINISTRADOR_API, 'deleteRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        //Se oculta el modal.
        MODAL_ELIMINAR_ADMIN.hide();
        // Se muestra un mensaje de éxito.
        await sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        cargarTabla();
    } else {
        sweetAlert(2, DATA.error, false);
        //Se oculta el modal.
        MODAL_ELIMINAR_ADMIN.hide();
    }
});

// Función para ocultar o mostrar la contraseña en input.
function mostrarContra(inputContra) {
    // Se almacena el elemento con el id en la variable input.
    var input = document.getElementById(inputContra);

    // Se valida que el elemento tenga asignado el atributo type
    // con el valor text.
    if (input.type == 'text') {
        // Se cambia el atributo type a password.
        input.type = 'password';
    }
    else {
        // Se cambia el atributo type a text.
        input.type = 'text';
    }

    // Se cambia el focus hacia el input.
    input.focus();
}

// Método del evento para cuando se envía el formulario de agregar o editar administrador.
FORM_ADMIN.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(FORM_ADMIN);
    // Se verifica la acción a realizar.
    if (ID_ADMIN.value) {
        action = 'updateRow';
        // Se verifica el valor del select y se guarda en el form
        (ESTADO_ADMIN.selectedIndex) ? estadoAdministrador = 0 : estadoAdministrador = 1;
        FORM.append('estadoAdministrador', estadoAdministrador);
    } else {
        action = 'createRow';
    }
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(ADMINISTRADOR_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        MODAL_ADMIN.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        cargarTabla();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

