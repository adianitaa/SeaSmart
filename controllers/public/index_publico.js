// Constante para completar la ruta de la API.
const CATEGORIAS_API = 'services/public/categorias.php';
// Se almacena el contenedor donde se cargarán las cards de categorías.
const CONTENEDOR_CATEGORIAS = document.getElementById('contenedorCategorias'), CONTENEDOR_MENSAJE = document.getElementById('mensajeCategorias');


// Evento que carga los recursos de barra de navegación y función de rellenar tabla.
document.addEventListener('DOMContentLoaded', async () => {
    // Se verifica que la ruta actual sea el archivo index.html.
    if (location.href.substring(location.href.length - 10) != 'index.html') {
        location.href = 'index.html';
    }
    // Llamada a la función para mostrar el encabezado y pie del documento.
    await cargarPlantilla(1);
    // Llamada a la función para cargar las categorías registradas.
    cargarCategorias();
});


const cargarCategorias = async (form = null) => {
    // Se verifica si el form está vacío para asignar el valor de la acción.
    form != null ? accion = "searchRows" : accion = "readAll";
    // Se realiza una petición a la API para retornas las categorías registradas.
    const DATA = await fetchData(CATEGORIAS_API, accion, form);
    // Si la respuesta es satisfactoria se ejecuta el código.
    if (DATA.status) {
        // Se inicializa el contenido del contenedor.
        CONTENEDOR_CATEGORIAS.innerHTML = '';
        // Se carga una card de categoría por cada categoría encontrada.
        DATA.dataset.forEach(row => {
            CONTENEDOR_CATEGORIAS.innerHTML += `
                <div class="card d-flex align-items-center col-1">
                    <img src="${SERVER_URL}images/categorias/${row.imagen_categoria}" class="img-fluid" width="150px" height="150px"
                        alt="categoriaImagen">
                    <div class="card-body d-flex align-items-center justify-content-center flex-column">
                        <h5 class="card-title text-center">${row.nombre_categoria}</h5>
                        <p class="card-text text-center">Echa un vistazo a los productos de la categoría ${row.nombre_categoria}</p>
                        <a href="#" class="btn btn-primary" id="verProductos(${row.id_categoria})">Ver productos</a>
                    </div>
                </div>
            `;
        });
        
        // Se verifica si el form está vacío para asignar el valor de la acción.
        form != null ? window.scrollTo(0, CONTENEDOR_CATEGORIAS.offsetTop) : "";

    } else if (DATA.error == "No existen categorías registradas") {

        CONTENEDOR_MENSAJE.classList.add('d-none');

        sweetAlert(4, 'Por el momento no tenemos productos para mostrarle\nEsperamos pronto tener todo listo para usted', false);
    } else if (DATA.error == "No hay coincidencias") {

        sweetAlert(3, DATA.error, false);
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

