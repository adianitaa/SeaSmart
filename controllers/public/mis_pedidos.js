// Se declara la constante que almacena la ruta de la API de pedidos.
const PEDIDOS_API = 'services/public/pedido.php';
// Se declara la constante que almacena la ruta de la API de detalles de pedidos.
const DETALLES_PEDIDOS_API = 'services/public/detalles_pedidos.php';
// Se almacena el contenedor donde se mostrarán los pedidos realizados por el cliente.
const CONTENEDOR_PEDIDOS = document.getElementById('contenedorPedidos');
// Se almacena el modal que muestra los detalles del pedido.
const MODAL_DETALLES = new bootstrap.Modal('#modalDetalles');
// Se almacena el contenedor donde se cargarán los productos del pedido.
const CONTENEDOR_PRODUCTOS = document.getElementById('contenedorProductos');
// Se declara la constante global dónde se almacenará la información del detalle de pedido.
let detallesPedido = [];

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    cargarPlantilla(3);
    // Llamada a la función para cargar los pedidos del cliente.
    cargarPedidos();
});

// La función cargarPedidos permite cargar dinámicamente los pedidos realizados por el cliente.
const cargarPedidos = async () => {
    // Se realiza una petición para obtener los pedidos realizados por el cliente.
    const DATA = await fetchData(PEDIDOS_API, "readOrders");
    // Si la respuesta es satisfactoria se ejecuta el código.
    if (DATA.status) {
        // Variable que se utiliza para agregar la numeración de los pedidos.
        let nPedido = 1;
        // Se agregan dinámicamente los pedidos por cada resultado.
        DATA.dataset.forEach(row => {
            CONTENEDOR_PEDIDOS.innerHTML += `
            <div class="row mt-5">
                <h3>Pedido ${nPedido}</h3>
                <div class="container">
                    <div class="row">
                        <div class="col-12 col-sm-3 col-md-2 col-lg-2">
                            <img src="../../resources/img/camion-envio.png" alt="camion" class="img-fluid">
                        </div>
                        <div class="col-12 col-sm-2 d-flex align-items-center justify-content-center flex-column">
                            <p class="fw-bold fs-6">${row.estado_pedido}</p>
                            <p class="fw-bold fs-6">${row.fecha_pedido}</p>
                            <p class="fw-bold fs-6">${row.direccion}</p>
                        </div>
                        <div class="col-12 col-sm-7 d-flex align-items-center justify-content-center">
                            <div class="row d-flex flex-column">
                                <div class="col">
                                    <p class="text-center"><a href="#" onclick="verDetalles(${row.id_pedido})">Ver detalles</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
            </div>
            `;
        });
    } else {
        // Se muestra el mensaje.
        sweetAlert(4, "No se han realizado pedidos", false);
        // Se muestra el texto.
        CONTENEDOR_PEDIDOS.innerHTML = '<p class="fs-3 fw-bold text-center">No se han realizado pedidos</p>';
    }
}

// La función verDetalles muestra el modal con la información del pedido.
const verDetalles = async (idPedido) => {
    // Se declara la constante donde se cargará el idPedido.
    const FORM = new FormData();
    // Se carga el idPedido al form.
    FORM.append("idPedido", idPedido);
    // Se realiza una petición para obtener los productos del pedido.
    const DATA = await fetchData(DETALLES_PEDIDOS_API, 'readDetails', FORM);
    // Si la respuesta es satisfactoria se ejecuta el código.
    if (DATA.status) {
        // Se almacena el conjunto de datos provenientes de la petición en la variable global.
        detallesPedido = DATA.dataset;
        // Se inicializa el contenido del contenedor.
        CONTENEDOR_PRODUCTOS.innerHTML = '';
        // Se agregan los productos del pedido al contenedor dinámicamente.
        DATA.dataset.forEach(row => {
            CONTENEDOR_PRODUCTOS.innerHTML += `
            <div class="row">
                <div class="col-12">
                    <p class="fs-5 fw-semibold">${row.nombre_producto}</p>
                </div>
                <div class="col-12 col-md-6">
                    <img src="${SERVER_URL}images/detalles_productos/${row.imagen_producto}" width="100px" height="100px">
                </div>
                <div class="col-12 col-md-6">
                    <p>Precio: $${row.precio_producto}</p>
                    <p>Cantidad: ${row.cantidad_producto}</p>
                    <p>Subtotal: $${row.precio_producto * row.cantidad_producto}</p>
                </div>
                <hr>
            </div>
            `;
        });

        MODAL_DETALLES.show();
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

// Función que permite cargar pdf con información del pedido.
async function mostrarPdf() {
    // Se crea el contenedor padre.
    const CONTENEDOR_PADRE = document.createElement('div');
    // Se agregan las clases del framework de diseño,
    CONTENEDOR_PADRE.classList.add('container-fluid', 'p-5');
    // Se separa la fecha obtenida del pedido.
    let fecha = detallesPedido[0].fecha_pedido.split('-');
    // Se instancia la variable dónde se almacenará el total del pedido.
    var total = 0;
    // Se agrega la información principal del documento.
    CONTENEDOR_PADRE.innerHTML = `
            <div class="row">
                <div class="col d-flex align-items-center">
                    <img src="../../resources/img/logo_grande.png" class="img-fluid" style="height:50px; width:50px">
                </div>
                <div class="col d-flex align-items-center">
                    <p class="fw-bold fs-5 text-start psinmargen">Factura de pedido</p>
                </div>
                <div class="col d-flex align-items-center">
                    <p class="fw-semibold text-end fs-6 psinmargen">Fecha del pedido: ${fecha[1]}/${fecha[2]}/${fecha[0]}</p>
                </div>
            </div>
            <div class="row">
                <p class="fw-semibold text-end">Estado del pedido: ${detallesPedido[0].estado_pedido}</p>
            </div>
            <div class="row mt-5">
                <p class="fw-semibold">Productos del pedido</p>
                <hr>
            </div>
    `;
    // Se itera el conjunto de datos para cargar la información de los productos en el documento.
    detallesPedido.forEach(row => {
        // Se agrega la información del producto.
        CONTENEDOR_PADRE.innerHTML += `
            <div class="row d-flex gap-3 p-5">
                <div class="col d-flex justify-content-center align-items-center">
                    <img src="${SERVER_URL}images/detalles_productos/${row.imagen_producto}" width="100px" height="100px">
                </div>
                <div class="col-7 d-flex flex-column gap-1">
                    <p class="">Nombre del producto: ${row.nombre_producto}</p>
                    <p class="">Cantidad: ${row.cantidad_producto}</p>
                    <p class="">Precio: $${row.precio_producto}</p>
                    <p class="text-danger fw-semibold">Subtotal: $${row.precio_producto * row.cantidad_producto}</p>
                </div>
                <hr>
            </div>
        `;
        // Se agrega el subtotal del producto actual a la variable.
        total += row.precio_producto * row.cantidad_producto;
    });
    // Se muestra el total del pedido en la etiqueta de texto.
    CONTENEDOR_PADRE.innerHTML += '<p class="text-danger text-end fw-semibold fs-5">Total del pedido: $'+total+'</p>';
    // Se carga el pdf y se guarda en el equipo del cliente.
    html2pdf().from(CONTENEDOR_PADRE).toPdf().get('pdf').then((pdf) => descargarPdf(pdf));
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
    link.download = 'factura.pdf';
    // Se abre el link para comenzar la descarga y se quita el link posteriormente.
    link.click();
    link.remove();
}