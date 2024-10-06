const TALLAS_API = 'services/admin/tallas.php';
const FILAS_ENCONTRADAS = document.getElementById('filasEncontradas'),
    CUERPO_TABLA = document.getElementById('cuerpoTabla');
const FORM_BUSCAR = document.getElementById('formBuscar')

const MODALTALLA = new bootstrap.Modal('#crearModal_talla');
const MODALETALLA = new bootstrap.Modal('#editModal_talla');
const MODALBTALLA = new bootstrap.Modal('#borrarModal_talla');

function abrirCrear() {
    MODALTALLA.show();
}

function abrirEditar() {
    MODALETALLA.show();
}

function abrirEliminar() {
    MODALBTALLA.show();
}

document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    cargarPlantilla();

    cargarTabla();
});

function verificarReset(){
    if (document.getElementById('buscarTalla').value==""){
        cargarTabla();
    }
}

FORM_BUSCAR.addEventListener('submit', (event) => { 
    event.preventDefault();

    const FORM = new FormData(FORM_BUSCAR);
    cargarTabla(FORM)
});


const cargarTabla = async (form = null) => {
    FILAS_ENCONTRADAS.textContent = '';
    CUERPO_TABLA.innerHTML = '';

    (form) ? action = 'searchRows' : action = 'readAll';

    const DATA = await fetchData (TALLAS_API, action, form)

    if (DATA.status) {
        DATA.dataset.forEach(row => {
            CUERPO_TABLA.innerHTML += `
            <tr>
                <td>${row.id_producto_talla}</td>
                <td>${row.talla}</td>
                <td class="celda-editar-eliminar">
                    <button type="button" class="btn btn-success" onclick="">
                        <img src="../../resources/img/lapiz.png" alt="lapizEditar" width="30px">
                    </button>
                    <button type="button" class="btn btn-danger" onclick="">
                    <img src="../../resources/img/eliminar.png" alt="lapizEditar" width="30px">
                </button>
                
                </td>
            </tr>
            `
        })

        FILAS_ENCONTRADAS.textContent = DATA.message;
    } 
    else{
        console.log('No funciono')
    }
}