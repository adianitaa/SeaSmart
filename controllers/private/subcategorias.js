// Constante para completar la ruta de la API.
const SUBCATEGORIA_API = 'services/admin/subcategorias.php';
// Constante para almacenar el modal de editar subcategoría.
const MODALSUBCATEGORIA = new bootstrap.Modal('#modalsubCategoria');
// Constante que almacena el form de búsqueda.
const FORM_BUSCAR = document.getElementById('formBuscar');
// Constante para almacenar el modal de eliminar subcategoría.
const MODALBSUBCATEGORIA = new bootstrap.Modal('#borrarModalsubCategoria');
// Constantes para cargar los elementos de la tabla.
const FILAS_ENCONTRADAS = document.getElementById('filasEncontradas'),
    CUERPO_TABLA = document.getElementById('cuerpoTabla');
// Constante para definir el título del modal y botón.
const TITULO_MODAL = document.getElementById('tituloModal'),
    BOTON_ACCION = document.getElementById('btnAccion');
// Constantes para establecer los elementos del formulario.
const FORM_SUBCATEGORIA = document.getElementById('formsubCategoria'),
    ID_SUBCATEGORIA = document.getElementById('idsubCategoria'),
    NOMBRE_SUBCATEGORIA = document.getElementById('nombresubCategoria'),
    DESCRIPCION_SUBCATEGORIA = document.getElementById('descripcionsubCategoria'),
    ID_CATEGORIA = document.getElementById('categoriaSelect');
//
const CATEGORIA_API = 'services/admin/categorias.php';

// Función para abrir el modal crear o editar subcategoría.
const abrirModal = async (tituloModal, idsubCategoria) => {
    // Se configura el título del modal.
    TITULO_MODAL.textContent = tituloModal;

    if (idsubCategoria == null) {
        // Se remueve el antiguo color del botón.
        BOTON_ACCION.classList.remove('btn-success');
        // Se configura el nuevo color del botón.
        BOTON_ACCION.classList.add('btn-primary');
        // Se configura el título del botón.
        BOTON_ACCION.innerHTML = 'Agregar subcategoría';
        // Se limpian los input para dejarlos vacíos.
        FORM_SUBCATEGORIA.reset();
        await fillSelect(CATEGORIA_API, 'readAll1', 'categoriaSelect');
        // Se abre el modal agregar categoría.
        MODALSUBCATEGORIA.show();
    }
    else {
        // Se define una constante tipo objeto que almacenará el idsubCategoria.
        const FORM = new FormData();
        // Se almacena el nombre del campo y el valor (idsubCategoria) en el formulario.
        FORM.append('idsubCategoria', idsubCategoria);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(SUBCATEGORIA_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se configura el título del modal.
            TITULO_MODAL.textContent = 'Actualizar subcategoría';
            // Se remueve el antiguo color del botón.
            BOTON_ACCION.classList.remove('btn-primary');
            // Se configura el nuevo color del botón.
            BOTON_ACCION.classList.add('btn-success');
            // Se configura el título del botón.
            BOTON_ACCION.innerHTML = 'Editar subcategoría';
            // Se prepara el formulario para cargar los input de la subcategoría.
            FORM_SUBCATEGORIA.reset();
            // Se cargan los campos de la base en una variable.
            const ROW = DATA.dataset;
            // Se carga el id de subcategoría en el input idsubCategoria.
            ID_SUBCATEGORIA.value = ROW.id_sub_categoria;
            // Se carga el nombre de subcategoría en el input nombresubCategoria.
            NOMBRE_SUBCATEGORIA.value = ROW.nombre_sub_categoria;
            // Se carga la descripción de la subcategoría en el input descripcionsubCategoria.
            DESCRIPCION_SUBCATEGORIA.value = ROW.descripcion_sub_categoria;
            await fillSelect(CATEGORIA_API, 'readAll1', 'categoriaSelect', ROW.id_categoria);
            // Se abre el modal editar subcategoría.
            MODALSUBCATEGORIA.show();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

function verificarReset() {
    if (document.getElementById('buscarsubCategoria').value == "") {
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

// Función para abrir el modal eliminar subcategoría.
const abrirEliminar = async (idsubCategoria) => {
    // Se define una constante tipo objeto que almacenará el idCategoria.
    const FORM = new FormData();
    // Se almacena el nombre del campo y el valor (idCategoria) en el formulario.
    FORM.append('idsubCategoria', idsubCategoria);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(SUBCATEGORIA_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cargan los campos de la base en una variable.
        const ROW = DATA.dataset;
        // Se define el título del modal.
        document.getElementById('tituloModalEliminar').innerHTML = "¿Desea eliminar la subcategoría " + ROW.nombre_sub_categoria + "?";
        // Se carga el id subcategoría en el input inputIdsubCategoria.
        document.getElementById('inputIdsubCategoria').value = ROW.id_sub_categoria;
        // Se abre el modal borrar subcategoría.
        MODALBSUBCATEGORIA.show();
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

const eliminarsubCategoria = async () => {

    // Se define una variable con el valor del input inputIdsubCategoria.
    var idsubCategoria = document.getElementById('inputIdsubCategoria').value;
    // Se define una constante tipo objeto donde se almacenará el idsubCategoria.
    const FORM = new FormData();
    // Se almacena el nombre del campo y el valor (idsubCategoria).
    FORM.append('idsubCategoria', idsubCategoria);
    // Petición para eliminar el registro seleccionado.
    const DATA = await fetchData(SUBCATEGORIA_API, 'deleteRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        //Se oculta el modal.
        MODALBSUBCATEGORIA.hide();
        // Se muestra un mensaje de éxito.
        await sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        cargarTabla();
    } else {
        if (DATA.exception == 'Violación de restricción de integridad') {
            MODALBSUBCATEGORIA.hide();
            sweetAlert(2, 'Asegúrese de eliminar los productos con la subcategoría correspondiente', false);
        } else {
            MODALBSUBCATEGORIA.hide();
            sweetAlert(2, DATA.error, false);
        }
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
FORM_SUBCATEGORIA.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se valida que se haya seleccionado un item del select categoría.
    if (ID_CATEGORIA.value) {
        // Se verifica la acción a realizar.
        (ID_SUBCATEGORIA.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(FORM_SUBCATEGORIA);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(SUBCATEGORIA_API, action, FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            MODALSUBCATEGORIA.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            cargarTabla();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    } else {
        sweetAlert(3, 'Asegúrese de seleccionar una categoría', false);
    }
});


const cargarTabla = async (form = null) => {
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(SUBCATEGORIA_API, action, form);
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
                    <td class="text-center">${row.nombre_sub_categoria}</td>
                    <td class="text-center">${row.descripcion_sub_categoria}</td>
                    <td class="celda-agregar-eliminar text-center">
                        <button type="button" class="btn btn-success" onclick="abrirModal('Editar subcategoría',${row.id_sub_categoria})">
                            <img src="../../resources/img/lapiz.png" alt="lapizEditar" width="30px">
                        </button>
                        <button type="button" class="btn btn-danger" onclick="abrirEliminar(${row.id_sub_categoria})">
                            <img src="../../resources/img/eliminar.png" alt="lapizEditar" width="30px">
                        </button>
                        <button type="button" class="btn btn-warning" onclick="openReport(${row.id_sub_categoria})">
                            <i class="bi bi-filetype-pdf fs-5 text-light"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        FILAS_ENCONTRADAS.textContent = DATA.message;
    } else {
        // En caso de que no existan subcategorías registradas o no se encuentren coincidencias de búsqeuda. 
        if (DATA.error == 'No existen subcategorías registradas' || DATA.error == 'No hay coincidencias') {
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


//Función para abrir reporte de un registro "Productos por subcategoria"
const openReport = (id) => {
    // Se declara una constante tipo objeto con la ruta específica del reporte.
    const PATH = new URL(`${SERVER_URL}reports/admin/productos_subcategoria.php`);    // Se agrega un parámetro a la ruta con el valor de la subcategoria seleccionada.
    PATH.searchParams.append('id_sub_categoria', id);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}