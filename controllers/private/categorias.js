// Constante para completar la ruta de la API.
const CATEGORIA_API = 'services/admin/categorias.php';
// Constante para almacenar el modal de agregar o editar categoría.
const MODAL_CATEGORIA = new bootstrap.Modal('#modalCategoria');
// Constante que almacena el form de búsqueda.
const FORM_BUSCAR = document.getElementById('formBuscar');
// Constante para almacenar el modal de eliminar categoría.
const MODALBCATEGORIA = new bootstrap.Modal('#borrarModalCategoria');
// Constantes para cargar los elementos de la tabla.
const FILAS_ENCONTRADAS = document.getElementById('filasEncontradas'),
    CUERPO_TABLA = document.getElementById('cuerpoTabla');
// Constante para definir el título del modal y botón.
const TITULO_MODAL = document.getElementById('tituloModal'),
    BOTON_ACCION = document.getElementById('btnAccion'),
    IMG_CATEGORIA = document.getElementById('imgCategoria');
// Constantes para establecer los elementos del formulario.
const FORM_CATEGORIA = document.getElementById('formCategoria'),
    ID_CATEGORIA = document.getElementById('idCategoria'),
    NOMBRE_CATEGORIA = document.getElementById('nombreCategoria'),
    DESCRIPCION_CATEGORIA = document.getElementById('descripcionCategoria'),
    IMAGEN_CATEGORIA = document.getElementById('imagenCategoria');

const FORM_ELIMINAR = document.getElementById('formEliminar');

// Función para abrir el modal crear o editar categoría.
const abrirModal = async (tituloModal, idCategoria) => {
    // Se configura el título del modal.
    TITULO_MODAL.textContent = tituloModal;

    // Si el valor del parámetro es nulo la acción es agregar administrador
    if (idCategoria == null) {
        // Se remueve el antiguo color del botón.
        BOTON_ACCION.classList.remove('btn-success');
        // Se configura el nuevo color del botón.
        BOTON_ACCION.classList.add('btn-primary');
        // Se configura el título del botón.
        BOTON_ACCION.innerHTML = 'Agregar categoría';
        // Se limpian los input para dejarlos vacíos.
        FORM_CATEGORIA.reset();
        // Se cambia la imagen por defecto.
        IMG_CATEGORIA.src = "../../api/images/categorias/categoria_imageholder.png";
        // Se activa el atributo required del input imagenCategoria.
        IMAGEN_CATEGORIA.required = true;
        // Se abre el modal agregar categoría.
        MODAL_CATEGORIA.show();
    }
    else {
        // Se desactiva el atributo required del input imagenCategoria.
        IMAGEN_CATEGORIA.required = false;
        // Se define una constante tipo objeto que almacenará el idCategoria.
        const FORM = new FormData();
        // Se almacena el nombre del campo y el valor (idCategoria) en el formulario.
        FORM.append('idCategoria', idCategoria);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(CATEGORIA_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se remueve el antiguo color del botón.
            BOTON_ACCION.classList.remove('btn-primary');
            // Se configura el nuevo color del botón.
            BOTON_ACCION.classList.add('btn-success');
            // Se configura el título del botón.
            BOTON_ACCION.innerHTML = 'Editar categoría';
            // Se prepara el formulario para cargar los input de la categoría.
            FORM_CATEGORIA.reset();
            // Se cargan los campos de la base en una variable.
            const ROW = DATA.dataset;
            // Se carga el id de categoría en el input idCategoria.
            ID_CATEGORIA.value = ROW.id_categoria;
            // Se carga el nombre de categoría en el input nombreCategoria.
            NOMBRE_CATEGORIA.value = ROW.nombre_categoria;
            // Se carga la descripción de la categoría en el input descripcionCategoria.
            DESCRIPCION_CATEGORIA.value = ROW.descripcion_categoria;
            // Se define la ruta de la imagen almacenada en la API.
            IMG_CATEGORIA.src = "../../api/images/categorias/" + ROW.imagen_categoria;
            // Se abre el modal editar categoría.
            MODAL_CATEGORIA.show();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

// Función que verifica cuando el input de búsqueda
// se encuentra vacío para recargar los registros de la tabla.
function verificarReset() {
    // Se valida que el input esté vacío.
    if (document.getElementById('buscarCategoria').value == "") {
        // Se llama a la función para cargar los registros.
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

// Función para abrir el modal eliminar categoría.
const abrirEliminar = async (idCategoria) => {
    // Se define una constante tipo objeto que almacenará el idCategoria.
    const FORM = new FormData();
    // Se almacena el nombre del campo y el valor (idCategoria) en el formulario.
    FORM.append('idCategoria', idCategoria);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(CATEGORIA_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cargan los campos de la base en una variable.
        const ROW = DATA.dataset;
        // Se define el título del modal.
        document.getElementById('tituloModalEliminar').innerHTML = "¿Desea eliminar la categoría " + ROW.nombre_categoria + "?";
        // Se carga el id categoría en el input inputIdCategoria.
        document.getElementById('inputIdCategoria').value = ROW.id_categoria;
        // Se abre el modal borrar categoría.
        MODALBCATEGORIA.show();
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

FORM_ELIMINAR.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una constante tipo objeto donde se almacenará el idCategoria.
    const FORM = new FormData(FORM_ELIMINAR);
    // Petición para eliminar el registro seleccionado.
    const DATA = await fetchData(CATEGORIA_API, 'deleteRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        //Se oculta el modal.
        MODALBCATEGORIA.hide();
        // Se muestra un mensaje de éxito.
        await sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        cargarTabla();
    } else {
        if (DATA.exception == 'Violación de restricción de integridad') {
            MODALBCATEGORIA.hide();
            sweetAlert(2, 'Asegúrese de eliminar las subcategorías correspondientes a esta categoría', false);
        } else {
            MODALBCATEGORIA.hide();
            sweetAlert(2, DATA.error, false);
        }
    }
});

// Función para cargar la imagen al cargar un archivo en input file.
function cargarImagen(event) {
    // Se almacena el archivo cargado en la variable archivoSeleccionado.
    var archivoSeleccionado = event.target.files[0];
    // Se crea el objeto reader.
    var reader = new FileReader();
    // Se define una variable con el mismo valor que la constante IMG_CATEGORIA.
    var imgtag = IMG_CATEGORIA;
    // El reader lee la cadena de caracteres.
    reader.readAsDataURL(archivoSeleccionado);
    // Cuando el reader termina de leer la cadena de caracteres se 
    // dispara el evento que configura la imagen en la etiqueta imgCategoria.
    reader.onload = function (event) {
        imgtag.src = event.target.result;
    };
}

// Evento que carga los recursos de barra de navegación y función de rellenar tabla.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    cargarPlantilla();
    //Llamar la función para cargar los datos de la tabla.
    cargarTabla();
});

// Método del evento para cuando se envía el formulario de agregar o editar.
FORM_CATEGORIA.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(FORM_CATEGORIA);
    // Se valida el valor del input idCategoria para definir la acción a realizar.
    if(ID_CATEGORIA.value){
        // Se configura la acción.
        action = 'updateRow';
        // En caso de que se agregó una nueva imagen.
        if(IMAGEN_CATEGORIA.value){
            // El estado de la imagen tiene el valor de 1.
            estadoImagen = 1;
        } else{
            // El estado de la imagen tiene el valor de 0.
            estadoImagen = 0;
        }
        // Se agrega el estado de la imagen al form.
        FORM.append('estadoImagen', estadoImagen);
    } else{
        // Se configura la acción.
        action = 'createRow';
    }
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(CATEGORIA_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        MODAL_CATEGORIA.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        cargarTabla();
    } else {
        if(DATA.exception == 'Violación de restricción de integridad'){
            sweetAlert(2, 'La categoría ya ha sido ingresada', false);
        } else{
            sweetAlert(2, DATA.error, false);
        }
    }
});

// Función para cargar los registros de la tabla.
const cargarTabla = async (form = null) => {
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(CATEGORIA_API, action, form);
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
                    <td class="text-center"><img src="${SERVER_URL}images/categorias/${row.imagen_categoria}" height="50"></td>
                    <td class="text-center">${row.nombre_categoria}</td>
                    <td class="text-center">${row.descripcion_categoria}</td>
                    <td class="celda-agregar-eliminar text-center">
                        <button type="button" class="btn btn-success" onclick="abrirModal('Editar categoría',${row.id_categoria})">
                            <img src="../../resources/img/lapiz.png" alt="lapizEditar" width="30px">
                        </button>
                        <button type="button" class="btn btn-danger" onclick="abrirEliminar(${row.id_categoria})">
                            <img src="../../resources/img/eliminar.png" alt="lapizEliminar" width="30px">
                        </button>
                    </td>
                </tr>
            `;
        });
        // Se muestra un mensaje de acuerdo con el resultado.
        FILAS_ENCONTRADAS.textContent = DATA.message;
    } else {
        // En caso de que no existan categorías registradas o no se encuentren coincidencias de búsqueda. 
        if (DATA.error == 'No existen categorías registradas' || DATA.error == 'No hay coincidencias') {
            // Se muestra el mensaje de la API.
            sweetAlert(4, DATA.error, true);
            // Se restablece el contenido de la tabla.
            FILAS_ENCONTRADAS.textContent = '';
            CUERPO_TABLA.innerHTML = '';
        } else if(DATA.error == 'Ingrese un valor para buscar'){
            // Se muestra el mensaje de la API.
            sweetAlert(4, DATA.error, true);
        } else {
            // Se muestra el error de la API.
            sweetAlert(2, DATA.error, true);
        }
    }
}