// Constante para completar la ruta de la API.
const PRODUCTO_API = 'services/admin/productos.php';
// Constante para completar la ruta de la API de categorías.
const CATEGORIA_API = 'services/admin/categorias.php';
// Constante para completar la ruta de la API de subcategorías.
const SUBCATEGORIA_API = 'services/admin/subcategorias.php';
// Constante para completar la ruta de la API de administrador.
const ADMINISTRADOR_API = 'services/admin/administrador.php';
// Constantes para cargar los elementos de la tabla.
const FILAS_ENCONTRADAS = document.getElementById('filasEncontradas'),
    CUERPO_TABLA = document.getElementById('cuerpoTabla');
// Constante que almacena el modal para agregar o editar un producto.
const MODAL_PRODUCTO = new bootstrap.Modal('#modalProducto');
// Se almacena el modal con la información del producto.
const MODALIPRODUCTO = new bootstrap.Modal('#infoModalProducto');
// Constante que almacena el modal para eliminar un producto.
const MODAL_ELIMINAR = new bootstrap.Modal('#borrarModalProducto');
// Separadores del modal infoModalProdcuto.
const SEPARADORV = document.getElementById('separadorV');
const SEPARADORH = document.getElementById('separadorH');
// Constante que almacena el form de búsqueda.
const FORM_BUSCAR = document.getElementById('formBuscar');
// Constante para definir el título del modal y botón.
const TITULO_MODAL = document.getElementById('tituloModal'),
    BOTON_ACCION = document.getElementById('btnAccion');
// Constantes para establecer los elementos del formulario.
const FORM_PRODUCTO = document.getElementById('formProducto'),
    ID_PRODUCTO = document.getElementById('idProducto'),
    NOMBRE_PRODUCTO = document.getElementById('nombreProducto'),
    DESCRIPCION_PRODUCTO = document.getElementById('descripcionProducto'),
    ESTADO_PRODUCTO = document.getElementById('estadoProducto'),
    PRECIO_PRODUCTO = document.getElementById('precioProducto');
// Constante que almacena los selecet de categorías y subcategorías que se encuentran en el modal.
const SELECT_CATEGORIA = document.getElementById('selectCategoria'),
    SELECT_SUBCATEGORIA = document.getElementById('selectSubcategoria');
// Constante que almacena el contenedor que contiene el select estadoProducto.
const CONTENEDOR_ESTADO = document.getElementById('contenedorEstadoProducto');
// Constante que almacena el form para eliminar un producto.
const FORM_ELIMINAR = document.getElementById('formEliminar');

if (window.screen.width <= 430) {
    SEPARADORV.remove();
    // separacion de los botones de abajo
}
else if (window.screen.width < 992) {
    SEPARADORV.remove();
}
else {
    SEPARADORH.remove();
}

// Evento que carga los recursos de barra de navegación y función de rellenar tabla.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    cargarPlantilla();
    // Llamada a la función para cargar los registros de la tabla.
    cargarTabla();
});

// Función para cargar los registros de la tabla.
const cargarTabla = async (form = null) => {
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(PRODUCTO_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se inicializa el contenido de la tabla.
        FILAS_ENCONTRADAS.textContent = '';
        CUERPO_TABLA.innerHTML = '';
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            //Se valida el estado del producto para cargarlo en la columna.
            var estado_producto = validarEstado(row.estado_producto);
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            CUERPO_TABLA.innerHTML += `
                <tr>
                    <td class="text-center">${row.nombre_producto}</td>
                    <td class="text-center">${row.descripcion_producto}</td>
                    <td class="text-center">${row.nombre_sub_categoria}</td>
                    <td class="text-center">${estado_producto}</td>
                    <td class="text-center">${row.nombre_administrador}</td>
                    <td class="celda-agregar-eliminar text-center">
                        <button type="button" class="btn btn-success" onclick="abrirModal('Editar producto',${row.id_producto})">
                            <img src="../../resources/img/lapiz.png" alt="lapizEditar" width="30px">
                        </button>
                        <button type="button" class="btn btn-danger" onclick="abrirEliminar(${row.id_producto})">
                            <img src="../../resources/img/eliminar.png" alt="lapizEliminar" width="30px">
                        </button>
                        <button type="button" class="btn" onclick="abrirInfoProducto(${row.id_producto})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="blue" class="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                               <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
        });
        console.log(DATA)
        // Se muestra un mensaje de acuerdo con el resultado.
        FILAS_ENCONTRADAS.textContent = DATA.message;
    } else {
        // En caso de que no existan productos registrados o no se encuentren coincidencias de búsqeuda. 
        if (DATA.error == 'No existen productos registrados' || DATA.error == 'No hay coincidencias') {
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

// Función que retorna el estado del producto verificando el resultado de la bd.
function validarEstado(estadoProducto) {
    if (estadoProducto == 1) {
        return "Activo";
    } else {
        return "Inactivo";
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

// Función que verifica cuando el input de búsqueda
// se encuentra vacío para recargar los registros de la tabla.
function verificarReset() {
    // Se valida que el input esté vacío.
    if (document.getElementById('buscarProducto').value == "") {
        // Se llama a la función para cargar los registros.
        cargarTabla();
    }
}

// Función para abrir el modal crear o editar producto.
const abrirModal = async (tituloModal, idProducto) => {
    // Se configura el título del modal.
    TITULO_MODAL.textContent = tituloModal;
    // Si el valor del parámetro es nulo la acción es agregar administrador
    if (idProducto == null) {
        // Se remueve el antiguo color del botón.
        BOTON_ACCION.classList.remove('btn-success');
        // Se configura el nuevo color del botón.
        BOTON_ACCION.classList.add('btn-primary');
        // Se configura el título del botón.
        BOTON_ACCION.innerHTML = 'Agregar producto';
        // Se oculta el combobox del estado del producto.
        CONTENEDOR_ESTADO.classList.add('d-none');
        // Se limpian los input para dejarlos vacíos.
        FORM_PRODUCTO.reset();
        // Cargar los registros de la tabla categorías en el select.
        await fillSelect(CATEGORIA_API, 'readAll', 'selectCategoria');
        //Llamada a la función para cargar subcategorías.
        await cargarSubCategorias();
        // Se abre el modal agregar producto.
        MODAL_PRODUCTO.show();
    }
    else {
        // Se define una constante tipo objeto que almacenará el idProducto.
        const FORM = new FormData();
        // Se almacena el nombre del campo y el valor (idProducto) en el formulario.
        FORM.append('idProducto', idProducto);
        // Petición para obtener los datos del registro solicitado.
        const DATA = await fetchData(PRODUCTO_API, 'readOne', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se remueve el antiguo color del botón.
            BOTON_ACCION.classList.remove('btn-primary');
            // Se configura el nuevo color del botón.
            BOTON_ACCION.classList.add('btn-success');
            // Se configura el título del botón.
            BOTON_ACCION.innerHTML = 'Editar producto';
            // Se muestra el combobox del estado del producto.
            CONTENEDOR_ESTADO.classList.remove('d-none');
            // Se prepara el formulario para cargar los input de la producto.
            FORM_PRODUCTO.reset();
            // Cargar los registros de la tabla categorías en el select.
            await fillSelect(CATEGORIA_API, 'readAll', 'selectCategoria');
            // Se cargan los campos de la base en una variable.
            const ROW = DATA.dataset;
            // Se carga el id de producto en el input idProducto.
            ID_PRODUCTO.value = ROW.id_producto;
            // Se carga el nombre del producto en el input nombreProducto.
            NOMBRE_PRODUCTO.value = ROW.nombre_producto;
            // Se carga la descripción del producto en el input descripcionProducto.
            DESCRIPCION_PRODUCTO.value = ROW.descripcion_producto;
            // Se carga el valor del selectCategoria.
            SELECT_CATEGORIA.value = ROW.id_categoria;
            //Llamada a la función para cargar subcategorías.
            await cargarSubCategorias();
            // Se carga el valor del selectSubcategoria.
            SELECT_SUBCATEGORIA.value = ROW.id_sub_categoria;
            // Se carga el estado del producto en el select estadoProducto.
            ESTADO_PRODUCTO.value = ROW.estado_producto;
            // Se carga el precio del producto en el input precioProducto.
            PRECIO_PRODUCTO.value = ROW.precio_producto;
            // Se abre el modal editar categoría.
            MODAL_PRODUCTO.show();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

const cargarSubCategorias = async () => {
    SELECT_SUBCATEGORIA.innerHTML = '';
    if (SELECT_CATEGORIA.value) {
        // Se vacía el contenido del select categoría.
        SELECT_SUBCATEGORIA.innerHTML = '';
        // Se almacena el campo con el valor del id_categoria.
        const FORM = new FormData(FORM_PRODUCTO);
        // Petición para obtener registros específicos de la tabla subcategorías.
        const DATA = await fetchData(SUBCATEGORIA_API, 'readWithId', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            SELECT_SUBCATEGORIA.innerHTML += '<option value="" selected>Seleccione una opción</option>';
            // Se recorre el conjunto de registros fila por fila.
            DATA.dataset.forEach(row => {
                // Se crean y concatenan las etiquetas option con los datos de cada registro.
                SELECT_SUBCATEGORIA.innerHTML += `
                <option value="${row.id_sub_categoria}">${row.nombre_sub_categoria}</option>`;
            });
        } else {
            if (DATA.error == 'No existen subcategorías registradas') {
                sweetAlert(3, DATA.error, false);
            }
            else {
                sweetAlert(2, DATA.error, false);
            }
        }
    }
    else {
        SELECT_SUBCATEGORIA.innerHTML += '<option value="" selected>Seleccione una opción</option>';
    }
}

// Método del evento para cuando se envía el formulario de agregar o editar.
FORM_PRODUCTO.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    if (SELECT_SUBCATEGORIA.value) {
        // Se verifica la acción a realizar.
        (ID_PRODUCTO.value) ? action = 'updateRow' : action = 'createRow';
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(FORM_PRODUCTO);
        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(PRODUCTO_API, action, FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se cierra la caja de diálogo.
            MODAL_PRODUCTO.hide();
            // Se muestra un mensaje de éxito.
            sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            cargarTabla();
        } else {
            if (DATA.error == 'El precio del producto no puede ser cero') {
                sweetAlert(3, DATA.error, false);
            } else if (DATA.exception == 'Violación de restricción de integridad') {
                sweetAlert(2, 'El producto ya ha sido agregado', false);
            } else {
                sweetAlert(2, DATA.error, false);
            }
        }
    } else {
        sweetAlert(3, 'Asegúrese de seleccionar una subcategoría', false);
    }
});

// Función para abrir el modal eliminar producto.
const abrirEliminar = async (idProducto) => {
    // Se define una constante tipo objeto que almacenará el idProducto.
    const FORM = new FormData();
    // Se almacena el nombre del campo y el valor (idProducto) en el formulario.
    FORM.append('idProducto', idProducto);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(PRODUCTO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cargan los campos de la base en una variable.
        const ROW = DATA.dataset;
        // Se define el título del modal.
        document.getElementById('tituloModalEliminar').innerHTML = "¿Desea eliminar el producto " + ROW.nombre_producto + "?";
        // Se carga el id producto en el input inputIdProducto.
        document.getElementById('inputIdProducto').value = ROW.id_producto;
        // Se abre el modal borrar producto.
        MODAL_ELIMINAR.show();
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

// Función asíncrona que elimina un producto.
FORM_ELIMINAR.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una constante tipo objeto donde se almacenará el Form para eliminar con el idProducto.
    const FORM = new FormData(FORM_ELIMINAR);
    // Petición para eliminar el registro seleccionado.
    const DATA = await fetchData(PRODUCTO_API, 'deleteRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        //Se oculta el modal.
        MODAL_ELIMINAR.hide();
        // Se muestra un mensaje de éxito.
        await sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        cargarTabla();
    } else {
        if (DATA.exception == 'Violación de restricción de integridad') {
            MODAL_ELIMINAR.hide();
            sweetAlert(2, 'Asegúrese de eliminar las existencias del producto', false);
        } else {
            MODAL_ELIMINAR.hide();
            sweetAlert(2, DATA.error, false);
        }
    }
});

//Función para abrir reporte de todos los registros "Productos ordenados por categoria y subcategoria"
const openReport = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte.
    const PATH = new URL(`${SERVER_URL}reports/admin/productos_orden_sub_cat.php`);    
    
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}