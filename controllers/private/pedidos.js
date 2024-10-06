const IMGFILTRO = document.getElementById('contenedor-img-filtro');
const PEDIDO_API = 'services/admin/pedido.php';
const FILAS_ENCONTRADAS = document.getElementById('filasEncontradas'),
    CUERPO_TABLA = document.getElementById('cuerpoTabla');
const FORM_BUSCAR = document.getElementById('formBuscar')

if (window.screen.width < 995) {
    IMGFILTRO.remove();
}

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    cargarPlantilla();

    cargarPantalla();
});

function verificarReset(){
    if(document.getElementById('buscarPedido').value==""){
        cargarTabla();  
    }
}

document.addEventListener('submit', (event) => {
    event.preventDefault();
    const FORM = new FormData(FORM_BUSCAR);
    cargarPlantilla();

    cargarTabla();
});


const cargarTabla = async (form = null) => {
    FILAS_ENCONTRADAS.textContent = '';
    CUERPO_TABLA.innerHTML = '';

    (form) ? action = 'searchRows' : action = 'readAll';

    const DATA = await fetchData(PEDIDO_API, action, form);

    if (DATA.status) {
        DATA.dataset.forEach(row => {
            CUERPO_TABLA.innerHTML += `
            <tr>
            <td>${row.talla}</td>
            </tr>
            `
        })
    }
}

//Función para abrir reporte con los pedidos ordenados por estado
const openReport = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte.
    const PATH = new URL(`${SERVER_URL}reports/admin/pedidos_por_estado.php`);    
    
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}