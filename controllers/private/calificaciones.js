// Constante que almacena el form de búsqueda.
const FORM_BUSCAR = document.getElementById('formBuscar');
// Constante para completar la ruta de la API.
const CALIFICACION_API = 'services/admin/valoracion.php';
// Constantes para cargar los elementos de la tabla.
const FILAS_ENCONTRADAS = document.getElementById('filasEncontradas'),
    CUERPO_TABLA = document.getElementById('cuerpoTabla');

const FILTRO = document.getElementById('selectedFiltro');

//Buscador para buscar por nombre de cliente o producto
function verificarReset() {
    if (document.getElementById('buscarValoracion').value == "") {
        cargarTabla();
    }
}

// Evento que carga los recursos de barra de navegación y función de rellenar tabla.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    cargarPlantilla(); 
    //Llamar la función para cargar los datos de la tabla.
    cargarTabla('desc');
});

FILTRO.addEventListener("change", function()
{
    const valorSeleccionado = FILTRO.value;
    (valorSeleccionado == 0) ? order = 'asc' : order = 'desc';
    cargarTabla(order);
});

const estadoComentario = async (id, valor) =>{
    const FORM = new FormData();
    // Se almacena el nombre del campo y el valor (idsubCategoria).
    (valor == 1) ? newvalor = 0 : newvalor = 1;
    FORM.append('id_valoracion', id);
    FORM.append('estado_comentario', newvalor);
    const DATA = await fetchData(CALIFICACION_API, 'updateRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra un mensaje de éxito.
        await sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        cargarTabla('desc');
    } else {
        sweetAlert(2, DATA.error, false);
    }
}
const cargarTabla = async (order) => {
    // Se inicializa el contenido de la tabla.
    CUERPO_TABLA.innerHTML = '';
    // Se verifica la acción a realizar.
    (order == 'desc') ? action = 'readAll' : action = 'readAllasc';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(CALIFICACION_API, action, null);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros fila por fila.
        DATA.dataset.forEach(row => {
            // Se define la ruta de la imagen basada en el estado del comentario.
            const imagenSrc = (row.estado_comentario === 1) ? "../../resources/img/ojo_abierto.jpg" : "../../resources/img/ojo_cerrado.jpg";

            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            CUERPO_TABLA.innerHTML += `
                <tr>
                    <td>${row.nombre_cliente}</td>
                    <td>${row.nombre_producto_color}</td>
                    <td>${row.fecha_valoracion}</td>
                    <td>${row.calificacion_producto}/5</td>
                    <td>${row.comentario_producto}</td>
                    <td>
                        <button style="border: none; background: none; padding: 0; margin: 0;" onclick="estadoComentario(${row.id_valoracion}, ${row.estado_comentario})">
                            <img src="${imagenSrc}" class="rounded float-start" alt="...">
                        </button>
                    </td>
                </tr>
            `;
        });
    } else {
        sweetAlert(4, DATA.error, true);
    }
}