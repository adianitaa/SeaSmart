// Constante para completar la ruta de la API.
const COLOR_API = 'services/admin/colores.php';
// Constante para almacenar el modal de editar color.
const MODALCOLOR = new bootstrap.Modal('#modalColor');
// Constante que almacena el form de búsqueda.
const FORM_BUSCAR = document.getElementById('formBuscar');
// Constante para almacenar el modal de eliminar color.
const MODALBCOLOR = new bootstrap.Modal('#borrarModalColor');
// Constantes para cargar los elementos de la tabla.
const FILAS_ENCONTRADAS = document.getElementById('filasEncontradas'),
    CUERPO_TABLA = document.getElementById('cuerpoTabla');
// Constante para definir el título del modal y botón.
const TITULO_MODAL = document.getElementById('tituloModal'),
    BOTON_ACCION = document.getElementById('btnAccion');
// Constantes para establecer los elementos del formulario.
const FORM_COLOR = document.getElementById('formColor'),
    ID_COLOR = document.getElementById('idColor'),
    NOMBRE_COLOR = document.getElementById('nombreColor');

// Función para abrir el modal crear o editar color.
const abrirModal = async (tituloModal, idColor) => {
    // Se configura el título del modal.
    TITULO_MODAL.textContent = tituloModal;

    if (idColor == null) {
        // Se remueve el antiguo color del botón.
        BOTON_ACCION.classList.remove('btn-success');
        // Se configura el nuevo color del botón.
        BOTON_ACCION.classList.add('btn-primary');
        // Se configura el título del botón.
        BOTON_ACCION.innerHTML = 'Agregar color';
        // Se limpian los input para dejarlos vacíos.
        FORM_COLOR.reset();
        // Se abre el modal agregar categoría.
        MODALCOLOR.show();
    }
    else {
        // Se define una constante tipo objeto que almacenará el idColor
        const FORM = new FormData();
        // Se almacena el nombre del campo y el valor (idColor) en el formulario.
        FORM.append('idColor', idColor);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(COLOR_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se configura el título del modal.
            TITULO_MODAL.textContent = 'Actualizar color';
            // Se remueve el antiguo color del botón.
            BOTON_ACCION.classList.remove('btn-primary');
            // Se configura el nuevo color del botón.
            BOTON_ACCION.classList.add('btn-success');
            // Se configura el título del botón.
            BOTON_ACCION.innerHTML = 'Editar color';
            // Se prepara el formulario para cargar los input del color.
            FORM_COLOR.reset();
            // Se cargan los campos de la base en una variable.
            const ROW = DATA.dataset;
            // Se carga el id del color en el input idColor.
            ID_COLOR.value = ROW.id_producto_color;
            // Se carga el nombre del color en el input nombreColor.
            NOMBRE_COLOR.value = ROW.color_producto;
            // Se abre el modal editar categoría.
            MODALCOLOR.show();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

function verificarReset() {
    if (document.getElementById('buscarColor').value == "") {
        cargarTabla();
    }
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

// Función para abrir el modal eliminar color.
const abrirEliminar = async (idColor) => {
    // Se define una constante tipo objeto que almacenará el idColor.
    const FORM = new FormData();
    // Se almacena el nombre del campo y el valor (idColor) en el formulario.
    FORM.append('idColor', idColor);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(COLOR_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cargan los campos de la base en una variable.
        const ROW = DATA.dataset;
        // Se define el título del modal.
        document.getElementById('tituloModalEliminar').innerHTML = "¿Desea eliminar el color " + ROW.color_producto + "?";
        // Se carga el id color en el input inputIdColor.
        document.getElementById('inputIdColor').value = ROW.id_producto_color;
        // Se abre el modal borrar color.
        MODALBCOLOR.show();
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

const eliminarColor = async () => {

    // Se define una variable con el valor del input inputIdColor.
    var idColor = document.getElementById('inputIdColor').value;
    // Se define una constante tipo objeto donde se almacenará el idColor.
    const FORM = new FormData();
    // Se almacena el nombre del campo y el valor (idColor).
    FORM.append('idColor', idColor);
    // Petición para eliminar el registro seleccionado.
    const DATA = await fetchData(COLOR_API, 'deleteRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        //Se oculta el modal.
        MODALBCOLOR.hide();
        // Se muestra un mensaje de éxito.
        await sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        cargarTabla();
    } else {
        sweetAlert(2, DATA.error, false);
    }
}


// Evento que carga los recursos de barra de navegación y función de rellenar tabla.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    cargarPlantilla();
    //Llamar la función para cargar los datos de la tabla.
    cargarTabla();
});

// Método del evento para cuando se envía el formulario de guardar.
FORM_COLOR.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_COLOR.value) ? action = 'updateRow' : action = 'createRow';
    console.log(ID_COLOR.value);
    console.log(action);
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(FORM_COLOR);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(COLOR_API, action, FORM);
    console.log(DATA);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        MODALCOLOR.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        cargarTabla();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

const cargarTabla = async (form = null) => {
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(COLOR_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializa el contenido de la tabla.
        FILAS_ENCONTRADAS.textContent = '';
        CUERPO_TABLA.innerHTML = '';
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            CUERPO_TABLA.innerHTML += `
                <tr>
                    <td class="text-center">${row.color_producto}</td>
                    <td class="celda-agregar-eliminar text-right text-center">
                        <button type="button" class="btn btn-success text-center" onclick="abrirModal('Editar color',${row.id_producto_color})">
                            <img src="../../resources/img/lapiz.png" alt="lapizEditar" width="30px">
                        </button>
                        <button type="button" class="btn btn-danger text-center" onclick="abrirEliminar(${row.id_producto_color})">
                            <img src="../../resources/img/eliminar.png" alt="lapizEditar" width="30px">
                        </button>
                    </td>
                </tr>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        FILAS_ENCONTRADAS.textContent = DATA.message;
    } else {
        // En caso de que no existan colores registrados o no se encuentren coincidencias de búsqeuda. 
        if (DATA.error == 'No existen colores registrados' || DATA.error == 'No hay coincidencias') {
            // Se muestra el mensaje de la API.
            sweetAlert(4, DATA.error, true);
            // Se restablece el contenido de la tabla.
            FILAS_ENCONTRADAS.textContent = '';
            CUERPO_TABLA.innerHTML = '';
        } else if (DATA.error == 'Ingrese un valor para buscar') {
            // Se muestra el mensaje de la API.
            sweetAlert(4, DATA.error, true);
        } else {
            // Se muestra el error de la API.
            sweetAlert(2, DATA.error, true);
        }
    }
}