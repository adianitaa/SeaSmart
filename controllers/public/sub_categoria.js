const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    slidesPerView: 5,
    spaceBetween: 10,


    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

const CONTAINER = document.getElementById('galeria');
const ID_SUB_CATEGORIA = localStorage.getItem('idSubCategoria');

const SUB_CATEGORIA_API = "services/public/subcategoria.php"
// Evento que carga los recursos de barra de navegación y función de rellenar tabla.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    cargarPlantilla(1);

    // LLamada  a la función para llenar el carrusel
    cargarContainer();
});

const cargarContainer = async () => {
    FORM = new FormData();
    FORM.append('idSubcategoria',1);
    const DATA = await fetchData(SUB_CATEGORIA_API, 'readAllSub');
    if (DATA.status) {
        DATA.dataset.forEach(item => {
            CONTAINER.innerHTML += `

            <div class="swiper-slide">

                <div class="cloth-card">
                    <img class="cloth-card-img" src="../../resources/img/${item.imagen_producto}" />
                    <span class="cloth-card-info">${item.descripcion_producto}</span>
                    <b class="cloth-card-price">${item.precio_producto}</b>

                    <button class="cloth-card-buy">Agregar al carrito</button>
                </div>

            </div>

            `;
        });
    }
}