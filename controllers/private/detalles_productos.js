// Ruta de la API de detalles_productos.
const API_DETALLE_PRODUCTO = 'services/admin/detalles_productos.php'
// Se almacena el párrafo donde se cargará el nombre del administrador que agregó el producto.
const ADMIN_PRODUCTO = document.getElementById('adminProducto');
// Se almacena el párrafo donde se cargará el nombre de la categoría a la que pertenece la subcategoría del producto.
const CATEGORIA_PRODUCTO = document.getElementById('categoriaProducto');
// Se almacena el párrafo donde se cargará el nombre de la subcategoría a la que pertenece el producto.
const SUBCATEGORIA_PRODUCTO = document.getElementById('subcategoriaProducto');
// Se almacena el párrafo donde se cargará el nombre del producto.
const NOMBRE_PRODUCTO_DETALLE = document.getElementById('nombreProductoDetalle');
// Se almacena el párrafo donde se cargará el estado del producto.
const ESTADO_PRODUCTO_DETALLE = document.getElementById('estadoProductoDetalle');
// Se almacena el párrafo done se cargará el precio del producto.
const PRECIO_PRODUCTO_DETALLE = document.getElementById('precioProductoDetalle');
// Se almacena el párrafo donde se cargará la descripción del producto.
const DESCRIPCION_PRODUCTO_DETALLE = document.getElementById('descripcionProductoDetalle');

const FORM_FILTRO = document.getElementById('filtroDetalles');

const FILAS_ENCONTRADAS_DETALLES = document.getElementById('filasEncontradasDetalles');

const CUERPO_TABLA_DETALLES = document.getElementById('cuerpoTablaDetalles');

const SELECT_COLOR = document.getElementById('selectColor');

const SELECT_TALLA = document.getElementById('selectTalla');

const INPUT_ID_PRODUCTO_DETALLES = document.getElementById('idProductoDetalles');

// Constante que abre y carga la información del modal infoModalProducto.
const abrirInfoProducto = async (idProducto) => {
    // Se define una constante tipo objeto que almacenará el idProducto.
    const FORM = new FormData();
    // Se almacena el nombre del campo y el valor (idProducto) en el formulario.
    FORM.append('idProducto', idProducto);
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(PRODUCTO_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se almacenan los campos de la base en una variable.
        const ROW = DATA.dataset;
        // Se carga el nombre del administrador que agregó el producto.
        ADMIN_PRODUCTO.textContent = ROW.nombre_administrador;
        // Se carga el nombre de la categoría a la que pertenece la subcategoría del producto.
        CATEGORIA_PRODUCTO.textContent = ROW.nombre_categoria;
        // Se carga el nombre de la subcategoría a la que pertenece el producto.
        SUBCATEGORIA_PRODUCTO.textContent = ROW.nombre_sub_categoria;
        // Se carga el nombre del producto.
        NOMBRE_PRODUCTO_DETALLE.textContent = ROW.nombre_producto;
        // Se carga el estado del producto.
        ESTADO_PRODUCTO_DETALLE.textContent = validarEstado(ROW.estado_producto);
        // Se carga el precio del producto.
        PRECIO_PRODUCTO_DETALLE.textContent = '$' + ROW.precio_producto;
        // Se carga la descripción del producto.
        DESCRIPCION_PRODUCTO_DETALLE.textContent = ROW.descripcion_producto;
        // Se cargan los registros de la tabla detalles_productos.
        cargarTablaDetalles(idProducto);
        // Se muestra el modal.
        MODALIPRODUCTO.show();
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

const cargarTablaDetalles = async (idProducto) => {
    // Constante tipo objeto que almacenará el id del producto.
    const FORM = new FormData();
    // Se almacena el id del producto en el form.
    FORM.append('idProducto', idProducto);
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(API_DETALLE_PRODUCTO, 'readAll', FORM);
    // Petición para obtener las existencias del producto con color asignado.
    const DATA_COLOR = await fetchData(API_DETALLE_PRODUCTO, 'readAllWithColor', FORM);
    // Petición para obtener las existencias del producto con talla asignada.
    const DATA_TALLA = await fetchData(API_DETALLE_PRODUCTO, 'readAllWithSize', FORM);
    // Petición para obtener las existencias del producto sin talla ni color asignado.
    const DATA_VACIO = await fetchData(API_DETALLE_PRODUCTO, 'readAllEmpty', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status || DATA_COLOR.status || DATA_TALLA.status || DATA_VACIO.status) {
        // Se inicializa el contenido de la tabla.
        FILAS_ENCONTRADAS_DETALLES.textContent = '';
        CUERPO_TABLA_DETALLES.innerHTML = '';
        // Se declaran constantes dónde se almacenarán los id's y nombres de colores y tallas para cargarlos en combobox de filtrado.
        const COLORES = [];
        const TALLAS = [];
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            CUERPO_TABLA_DETALLES.innerHTML += `
                <tr>
                    <td class="text-center"><img src="${SERVER_URL}images/detalles_productos/${row.imagen_producto}" height="50"></td>
                    <td class="text-center">${row.color_producto}</td>
                    <td class="text-center">${row.talla}</td>
                    <td class="text-center">${row.existencia_producto}</td>
                    <td class="celda-agregar-eliminar text-center">
                        <button type="button" class="btn btn-success" onclick="abrirModalDetalle('Editar detalle de producto',${row.id_detalle_producto})">
                            <img src="../../resources/img/lapiz.png" alt="lapizEditar" width="30px">
                        </button>
                        <button type="button" class="btn btn-danger" onclick="abrirEliminarDetalle(${row.id_detalle_producto})">
                            <img src="../../resources/img/eliminar.png" alt="lapizEliminar" width="30px">
                        </button>
                    </td>
                </tr>
            `;
            // Se asigna el valor del campo idProductoDetalles en caso de que existan detalles del producto con color y talla.
            INPUT_ID_PRODUCTO_DETALLES.value = row.id_producto;
            // Se agregan los id's y nombres de colores y tallas encontrados en el conjunto de datos al array asociativo.
            COLORES.push({ id_color: row.id_producto_color, color: row.color_producto });
            TALLAS.push({ id_talla: row.id_producto_talla, talla: row.talla });
        });

        // Se crea una nueva fila en la tabla por cada registro con color asignado.
        DATA_COLOR.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            CUERPO_TABLA_DETALLES.innerHTML += `
                <tr>
                    <td class="text-center"><img src="${SERVER_URL}images/detalles_productos/${row.imagen_producto}" height="50"></td>
                    <td class="text-center">${row.color_producto}</td>
                    <td class="text-center">Sin talla asignada</td>
                    <td class="text-center">${row.existencia_producto}</td>
                    <td class="celda-agregar-eliminar text-center">
                        <button type="button" class="btn btn-success" onclick="abrirModalDetalle('Editar detalle de producto',${row.id_detalle_producto})">
                            <img src="../../resources/img/lapiz.png" alt="lapizEditar" width="30px">
                        </button>
                        <button type="button" class="btn btn-danger" onclick="abrirEliminarDetalle(${row.id_detalle_producto})">
                            <img src="../../resources/img/eliminar.png" alt="lapizEliminar" width="30px">
                        </button>
                    </td>
                </tr>
            `;
            // Se asigna el valor del campo idProductoDetalles en caso de que existan detalles del producto solo con color.
            INPUT_ID_PRODUCTO_DETALLES.value = row.id_producto;
            // Se agregan los id's y nombres de colores encontrados en el conjunto de datos al array asociativo.
            COLORES.push({ id_color: row.id_producto_color, color: row.color_producto });
        });

        // Se crea una nueva fila en la tabla por cada registro con talla asignada.
        DATA_TALLA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            CUERPO_TABLA_DETALLES.innerHTML += `
                <tr>
                    <td class="text-center"><img src="${SERVER_URL}images/detalles_productos/${row.imagen_producto}" height="50"></td>
                    <td class="text-center">Sin color asignado</td>
                    <td class="text-center">${row.talla}</td>
                    <td class="text-center">${row.existencia_producto}</td>
                    <td class="celda-agregar-eliminar text-center">
                        <button type="button" class="btn btn-success" onclick="abrirModalDetalle('Editar detalle de producto',${row.id_detalle_producto})">
                            <img src="../../resources/img/lapiz.png" alt="lapizEditar" width="30px">
                        </button>
                        <button type="button" class="btn btn-danger" onclick="abrirEliminarDetalle(${row.id_detalle_producto})">
                            <img src="../../resources/img/eliminar.png" alt="lapizEliminar" width="30px">
                        </button>
                    </td>
                </tr>
            `;
            // Se asigna el valor del campo idProductoDetalles en caso de que existan detalles del producto solo con talla.
            INPUT_ID_PRODUCTO_DETALLES.value = row.id_producto;
            // Se agregan los id's y nombres de tallas encontradas en el conjunto de datos al array asociativo.
            TALLAS.push({ id_talla: row.id_producto_talla, talla: row.talla });
        });

        // Se crea una nueva fila en la tabla por cada registro sin talla ni color asignado.
        DATA_VACIO.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            CUERPO_TABLA_DETALLES.innerHTML += `
                <tr>
                    <td class="text-center"><img src="${SERVER_URL}images/detalles_productos/${row.imagen_producto}" height="50"></td>
                    <td class="text-center">Sin color asignado</td>
                    <td class="text-center">Sin talla asignada</td>
                    <td class="text-center">${row.existencia_producto}</td>
                    <td class="celda-agregar-eliminar text-center">
                        <button type="button" class="btn btn-success" onclick="abrirModalDetalle('Editar detalle de producto',${row.id_detalle_producto})">
                            <img src="../../resources/img/lapiz.png" alt="lapizEditar" width="30px">
                        </button>
                        <button type="button" class="btn btn-danger" onclick="abrirEliminarDetalle(${row.id_detalle_producto})">
                            <img src="../../resources/img/eliminar.png" alt="lapizEliminar" width="30px">
                        </button>
                    </td>
                </tr>
            `;
            // Se asigna el valor del campo idProductoDetalles en caso de que existan detalles del producto sin color ni talla.
            INPUT_ID_PRODUCTO_DETALLES.value = row.id_producto;
        });

        // Se vacían los select de colores y tallas.
        SELECT_COLOR.innerHTML = '';
        SELECT_TALLA.innerHTML = '';

        // EL SIGUIENTE PROCESO DE ITERACIONES PERMITE ELIMINAR DUPLICADOS DEL ARRAY ASOCIATIVO COLORES.
        // Se declara una variable que permitirá almacenar los valores sin duplicar.
        var colores = {};
        // Por cada item en el array asociativo COLORES se crea un ítem en el array colores
        // con el nombre item.id_color -  item.color, y se asignan los valores correspondientes (id_color => 'id_color', color => 'color').
        for (i = 0, n = COLORES.length; i < n; i++) {
            var item = COLORES[i];
            colores[item.id_color + "-" + item.color] = item;
        }

        // UNA VEZ ELIMINADOS LOS DUPLICADOS SE GUARDAN LOS VALORES ÚNICOS EN UN NUEVO ARRAY.
        // Se declara una variable que servirá para realizar una iteración.
        var i = 0;
        // Se declara un array asociativo vacío que permitirá almacenar los valores únicos de id's y nombres de colores.
        var coloresFiltro = [];
        for (var item in colores) {
            // Se asigna el nombre del item y el valor del item.
            coloresFiltro[i++] = colores[item];
        }

        // Se agrega un valor al select de colores.
        SELECT_COLOR.innerHTML = '<option value="">Seleccione un color</option>';

        // Se cargan los valores del array coloresFiltro en el combobox SELECT_COLOR.
        coloresFiltro.forEach(color => {
            SELECT_COLOR.innerHTML += `<option value="${color.id_color}">${color.color}</option>`;
        });

        // EL SIGUIENTE PROCESO DE ITERACIONES PERMITE ELIMINAR DUPLICADOS DEL ARRAY ASOCIATIVO TALLAS.
        // Se declara una variable que permitirá almacenar los valores sin duplicar.
        var tallas = {};
        // Por cada item en el array asociativo TALLAS se crea un ítem en el array tallas
        // con el nombre item.id_talla -  item.talla, y se asignan los valores correspondientes (id_talla => 'id_talla', talla => 'talla').
        for (i = 0, n = TALLAS.length; i < n; i++) {
            var item = TALLAS[i];
            tallas[item.id_talla + "-" + item.talla] = item;
        }

        // UNA VEZ ELIMINADOS LOS DUPLICADOS SE GUARDAN LOS VALORES ÚNICOS EN UN NUEVO ARRAY.
        // Se declara una variable que servirá para realizar una iteración.
        var i = 0;
        // Se declara un array asociativo vacío que permitirá almacenar los valores únicos de id's y nombres de tallas.
        var tallasFiltro = [];
        for (var item in tallas) {
            // Se asigna el nombre del item y el valor del item.
            tallasFiltro[i++] = tallas[item];
        }

        // Se agrega un valor al select de tallas.
        SELECT_TALLA.innerHTML = '<option value="">Seleccione una talla</option>';

        // Se cargan los valores del array tallasFiltro en el combobox SELECT_TALLA.
        tallasFiltro.forEach(talla => {
            SELECT_TALLA.innerHTML += `<option value="${talla.id_talla}">${talla.talla}</option>`;
        });

        // Se almacena en una variable la suma de la cantidad de registros encontrados.
        var registrosEncontrados = parseInt(DATA.message.replace(/^\D+|\D+$/g, "")) + parseInt(DATA_COLOR.message.replace(/^\D+|\D+$/g, "")) + parseInt(DATA_TALLA.message.replace(/^\D+|\D+$/g, "")) + parseInt(DATA_VACIO.message.replace(/^\D+|\D+$/g, ""));

        // Se muestra un mensaje de acuerdo con el resultado.
        FILAS_ENCONTRADAS_DETALLES.textContent = "Existen " + registrosEncontrados + " registros";
    } else {
        if (DATA.error == 'No hay existencias registradas') {
            SELECT_COLOR.innerHTML = '';
            SELECT_TALLA.innerHTML = '';
            CUERPO_TABLA_DETALLES.innerHTML = '';
            sweetAlert(3, DATA.error, false);
        }
    }
}

// Evento que se desencadena al hacer click en el botón buscar y permite filtrar registros por color y talla. 
FORM_FILTRO.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica el tipo de búsqueda: Filtro de color y talla.
    if (SELECT_COLOR.value && SELECT_TALLA.value) {
        // Se almacena el form con el campo idProductoDetalles.
        const FORM = new FormData(FORM_FILTRO);
        // Petición para obtener registros específicos de la tabla detalles_productos.
        const DATA = await fetchData(API_DETALLE_PRODUCTO, 'searchRows', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se inicializa el contenido de la tabla.
            FILAS_ENCONTRADAS_DETALLES.textContent = '';
            CUERPO_TABLA_DETALLES.innerHTML = '';
            // Se recorre el conjunto de registros fila por fila.
            DATA.dataset.forEach(row => {
                // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                CUERPO_TABLA_DETALLES.innerHTML += `
                <tr>
                    <td class="text-center"><img src="${SERVER_URL}images/detalles_productos/${row.imagen_producto}" height="50"></td>
                    <td class="text-center">${row.color_producto}</td>
                    <td class="text-center">${row.talla}</td>
                    <td class="text-center">${row.existencia_producto}</td>
                    <td class="celda-agregar-eliminar text-center">
                        <button type="button" class="btn btn-success" onclick="abrirModalDetalle('Editar detalle de producto',${row.id_detalle_producto})">
                            <img src="../../resources/img/lapiz.png" alt="lapizEditar" width="30px">
                        </button>
                        <button type="button" class="btn btn-danger" onclick="abrirEliminarDetalle(${row.id_detalle_producto})">
                            <img src="../../resources/img/eliminar.png" alt="lapizEliminar" width="30px">
                        </button>
                    </td>
                </tr>
            `;
            });
            // Se muestra la cantidad de coincidencias encontradas.
            FILAS_ENCONTRADAS_DETALLES.textContent = DATA.message;
        } else {
            sweetAlert(3, DATA.error, false);
        }
    } else if (SELECT_COLOR.value) {
        // Se almacena el form con el campo idProductoDetalles.
        const FORM = new FormData(FORM_FILTRO);
        // Petición para obtener registros específicos de la tabla detalles_productos con color asignado (Y sin talla asignada).
        const DATA = await fetchData(API_DETALLE_PRODUCTO, 'searchRowsWithColor', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se inicializa el contenido de la tabla.
            FILAS_ENCONTRADAS_DETALLES.textContent = '';
            CUERPO_TABLA_DETALLES.innerHTML = '';

            // Se crea una nueva fila en la tabla por cada registro con color asignado.
            DATA.dataset.forEach(row => {
                if(row.talla){
                    // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                    CUERPO_TABLA_DETALLES.innerHTML += `
                    <tr>
                        <td class="text-center"><img src="${SERVER_URL}images/detalles_productos/${row.imagen_producto}" height="50"></td>
                        <td class="text-center">${row.color_producto}</td>
                        <td class="text-center">${row.talla}</td>
                        <td class="text-center">${row.existencia_producto}</td>
                        <td class="celda-agregar-eliminar text-center">
                            <button type="button" class="btn btn-success" onclick="abrirModalDetalle('Editar detalle de producto',${row.id_detalle_producto})">
                                <img src="../../resources/img/lapiz.png" alt="lapizEditar" width="30px">
                            </button>
                            <button type="button" class="btn btn-danger" onclick="abrirEliminarDetalle(${row.id_detalle_producto})">
                                <img src="../../resources/img/eliminar.png" alt="lapizEliminar" width="30px">
                            </button>
                        </td>
                    </tr>
                    `;
                } else{
                    row.forEach(row => {
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        CUERPO_TABLA_DETALLES.innerHTML += `
                        <tr>
                            <td class="text-center"><img src="${SERVER_URL}images/detalles_productos/${row.imagen_producto}" height="50"></td>
                            <td class="text-center">${row.color_producto}</td>
                            <td class="text-center">Sin talla asignada</td>
                            <td class="text-center">${row.existencia_producto}</td>
                            <td class="celda-agregar-eliminar text-center">
                                <button type="button" class="btn btn-success" onclick="abrirModalDetalle('Editar detalle de producto',${row.id_detalle_producto})">
                                    <img src="../../resources/img/lapiz.png" alt="lapizEditar" width="30px">
                                </button>
                                <button type="button" class="btn btn-danger" onclick="abrirEliminarDetalle(${row.id_detalle_producto})">
                                    <img src="../../resources/img/eliminar.png" alt="lapizEliminar" width="30px">
                                </button>
                            </td>
                        </tr>
                        `;
                    });
                }
            });
            // Se muestra un mensaje de acuerdo con el resultado.
            FILAS_ENCONTRADAS_DETALLES.textContent = DATA.message;
        }
    } else if (SELECT_TALLA.value) {

    } else {
        sweetAlert(3, 'Seleccione un color y/o una talla para buscar existencias', false);
    }
});

// Evento que se desencadena al hacer click en el botón recargar, permite recargar los registros de la tabla. 
FORM_FILTRO.addEventListener('reset', async () => {
    // Se llama a la función cargarTablaDetalles para cargar los datos de la tabla.
    cargarTablaDetalles(INPUT_ID_PRODUCTO_DETALLES.value);
});