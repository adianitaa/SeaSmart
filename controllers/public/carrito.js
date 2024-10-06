// Se declara la constante que almacena la ruta de la API de detalles de pedidos.
const DETALLES_PEDIDOS_API = 'services/public/detalles_pedidos.php';
// Se declara la constante que almacena la ruta de la API de detalles de productos.
const DETALLES_PRODUCTOS_API = 'services/public/detalles_productos.php';
// Se declara la constante que almacena la ruta de la API de direcciones.
const DIRECCIONES_API = 'services/public/direcciones.php';
// Se declara la constante que almacena la ruta de la API de pedidos.
const PEDIDOS_API = 'services/public/pedido.php';
// Se almacenan las etiquetas de texto dónde se cargará información general del pedido.
const CANTIDAD_PRODUCTOS = document.getElementById('cantidadProductos'),
    TOTAL_PEDIDO = document.getElementById('totalPedido');
// Se almacena el contenedor donde se cargarán los productos.
const CONTENEDOR_PRODUCTOS = document.getElementById('contenedorProductos');
// Se almacena el modal dónde se muestra la información del pedido antes de realizar el pedido.
const MODAL_PEDIDO = new bootstrap.Modal('#modalPedido');
// Se almacena la etiqueta de texto dónde se cargará el total del producto.
const TOTAL_PEDIDO_MODAL = document.getElementById('totalPedidoModal');
// Se almacena el select dónde se cargarán las direcciones del cliente.
const SELECT_DIRECCIONES = document.getElementById('selectDirecciones');
// Se almacena el contenedor donde se muestra el total del pedido.
const RESUMEN_ORDEN = document.getElementById('resumenOrden');
// Se almacena el contenedor donde se carga un mensaje en caso de no haber productos en el carrito.
const MENSAJE_CARRO = document.getElementById('mensajeCarro');
// Variable donde se almacena el total del pedido.
let TOTAL = 0;


// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    cargarPlantilla(3);
    // Llamada a la función para cargar los detalles de productos encontrados en el carrito.
    cargarProductos();
});

const cargarProductos = async () => {
    // Se realiza una petición para conseguir los productos agregados al carrito.
    const DATA = await fetchData(DETALLES_PEDIDOS_API, 'readCart');
    // Si la respuesta es satisfactoria se ejecuta el código.
    if (DATA.status) {
        // Se inicializa el contenido del contenedor de productos.
        CONTENEDOR_PRODUCTOS.innerHTML = '';
        // Se cargan los productos dinámicamente utilizando la respuesta de la API.
        DATA.dataset.forEach(row => {
            // Se carga la información del producto.
            CONTENEDOR_PRODUCTOS.innerHTML += `
            <div class="col-12">
                <div class="row d-flex flex-row justify-content-center align-items-center row-gap-5">
                    <div class="col-12 col-sm-8 col-md-4 d-flex justify-content-center">
                        <img src="${SERVER_URL}images/detalles_productos/${row.imagen_producto}" alt="productocarro" class="img-fluid" width="275px" height="275px"">
                    </div>
                    <div class="col-12 col-sm-12 col-md-4 d-flex align-items-center d-flex flex-column gap-3">
                        <p class="fw-bold fs-5">${row.nombre_producto}</p>
                        <div class="d-flex gap-3 align-items-center">
                            <p class="fw-bold fs-6 cantidad">Cantidad:</p>
                            <p class="fs-6 cantidad">${row.cantidad_producto}</p>
                        </div>
                        <div class="d-flex gap-2 text-danger">
                            <p class="fw-semibold">Precio:</p>
                            <p class="fw-semibold">$${row.precio_producto}</p>
                        </div>
                        <div class="d-flex justify-content-end">
                            <hr width="100px" class="p-0 m-0">
                        </div>
                        <div class="d-flex gap-2 text-danger">
                            <p class="fw-semibold">Sub-total:</p>
                            <p class="fw-semibold">$${calcularSubTotal(row.cantidad_producto, row.precio_producto)}</p>
                        </div>
                    </div>
                    <div class="col-2">
                        <div class="btn btn-danger" onclick="eliminarProducto(${row.id_detalle_producto}, ${row.id_detalle_pedido})">
                            <img src="../../resources/img/eliminar.png" alt="eliminarCan" width="30px">
                        </div>
                    </div>
                    <div class="d-flex justify-content-end">
                        <hr class="w-100 producto_hr">
                    </div>
                </div>
            </div>
            `;
        });
        // Se muestra el mensaje en la etiqueta de texto.
        CANTIDAD_PRODUCTOS.textContent = DATA.message;
        // Se calcula el total del pedido.
        TOTAL_PEDIDO.textContent = "$" + TOTAL;
    } else if (DATA.error == "No se ha agregado ningún producto al carrito") {
        // Se muestra el mensaje.
        sweetAlert(4, DATA.error, false);
        // Se esconde el contenedor dónde se muestra el resumen de la orden.
        RESUMEN_ORDEN.classList.add('d-none');
        // Se muestra el contenedor con el mensaje.
        MENSAJE_CARRO.classList.remove('d-none');
        // Se vacía el contenido del contenedor de productos.
        CONTENEDOR_PRODUCTOS.innerHTML = '';
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

// Función que calcula el subtotal de un producto (El producto del precio por la cantidad de un detalle de pedido).
function calcularSubTotal(cantidad, precio){
    // Se realiza la operación para calcular el subtotal.
    var subTotal = cantidad * precio;
    // Se suma el subtotal al total del pedido.
    TOTAL += subTotal;
    // Se retorna el subtotal.
    return subTotal;
}

// La función abrirModal permite abrir el modal como paso previo a finalizar el pedido.
const abrirModal = async () => {
    // Se configura el texto de la etiqueta al total del pedido.
    TOTAL_PEDIDO_MODAL.textContent = "Total del pedido: $"+TOTAL;
    // Se realiza una petición para obtener las direcciones del cliente. 
    const DATA = await fetchData(DIRECCIONES_API, 'readAll');
    // Si la respuesta es satisfactoria se ejecuta el código.
    if(DATA.status){
        // Se inicializa el contenido del select de direcciones.
        SELECT_DIRECCIONES.innerHTML = '<option value="0">Seleccione una opción</option>';
        // Se cargan las direcciones en el select.
        DATA.dataset.forEach(row => {
            SELECT_DIRECCIONES.innerHTML += `<option value="${row.id_direccion}">${row.direccion}</option>`;
        });
    } else{
        // Si no se han agregado direcciones se le solicita al usuario agregar una dirección.
        sweetAlert(3, 'Para realizar un pedido agregue una dirección: Mi cuenta > Mi información > Agregar dirección.', false);
        // Se inicializa el contenido del select de direcciones.
        SELECT_DIRECCIONES.innerHTML = '<option value="0">Seleccione una opción</option>';
    }
    // Se muestra el modal.
    MODAL_PEDIDO.show();
}

// La función finalizarPedido permite realizar un pedido.
const finalizarPedido = async () => {
    if(SELECT_DIRECCIONES.value != 0){
        // Se establece la constante donde se almacenará la dirección del pedido.
        const FORM = new FormData();
        // Se agrega la dirección al form.
        FORM.append("direccion", SELECT_DIRECCIONES.options[SELECT_DIRECCIONES.selectedIndex].text);
        // Se realiza una petición para finalizar el pedido.
        const DATA = await fetchData(PEDIDOS_API, 'finishOrder', FORM);
        // Si la respuesta es satisfactoria se ejecuta el código.
        if(DATA.status){
            // Se muestra el mensaje con el éxito de la acción.
            await sweetAlert(1, 'Pedido realizado', false);
            // Se esconde el modal.
            MODAL_PEDIDO.hide();
            // Se vuelve a cargar la página.
            cargarProductos();
        } else{
            sweetAlert(2, DATA.error, false);
        }
    } else{
        sweetAlert(3, "Asegúrese de seleccionar una dirección", false);
    }
}

// La función eliminarProducto permite remover un producto del carrito de compras.
const eliminarProducto = async (idDetalleProducto, idDetallePedido) =>{
    // Se declara una constante dónde se almacenará el idDetalleProducto y el idDetallePedido.
    const FORM = new FormData();
    // Se agrega el id del detalle de producto al form.
    FORM.append('idDetalleProducto', idDetalleProducto);
    // Se agrega el id del detalle de pedido al form.
    FORM.append('idDetallePedido', idDetallePedido);
    // Se realiza una petición a la API para eliminar el detalle del pedido del pedido.
    const DATA = await fetchData(DETALLES_PEDIDOS_API, 'removeDetail', FORM);
    // Si la respuesta es satisfactoria se ejecuta el código.
    if(DATA.status){
        // Se muestra el mensaje con el éxito de la acción.
        sweetAlert(1, "Producto removido del carrito", false);
        // Se recargan los productos del carrito.
        cargarProductos();
    } else{
        sweetAlert(2, DATA.error, false);
    }
}