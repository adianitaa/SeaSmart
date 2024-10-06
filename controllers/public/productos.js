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

const CONTAINER = document.getElementById('contenedor');

const PRODUCTO_API = "services/public/producto.php"
const SUB_CATEGORIA_API = "services/public/subcategoria.php"
// Evento que carga los recursos de barra de navegación y función de rellenar tabla.
document.addEventListener('DOMContentLoaded', () => {
    // Llamada a la función para mostrar el encabezado y pie del documento.
    cargarPlantilla(1);


    cargarSub();
});

function goToSubCategoria(id){
    //Aca adentro poner el codigo para ir a la pagina sub_categoria.html y guardar el id de la subcategoria
    localStorage.setItem("idSubCategoria", id);
    window.location.href = 'sub_categoria.html';
}

const cargarSub = async () => {
    const FORM = new FormData();
    FORM.append('idCategoria',1); //cambiar el uno por el id de la categoria que traes desde la pagina donde elegis la categoria que queres ver
    const DATA = await fetchData(SUB_CATEGORIA_API, 'readAllCategoria', FORM);
    if(DATA.status){
        let contador = 1;
        DATA.dataset.forEach(item => {
            //1 2 3 4 ...
            //En el boton de la etiqueta a deberias poner un atributo onclick que te lleve a una funcion para navegar a la pantalla de la subcategoria y asi poder mandar el id necesario
            CONTAINER.innerHTML += `
            
            <h2 class="mt-5">${item.nombre_sub_categoria}</h2>
            <a href="../../views/public/sub_categoria.html"><button  onclick = "goToSubCategoria(${item.id_sub_categoria})" type="button" class="btn btn-link">Ver
                    más</button></a>

            <!-- Creamos el carrusel de los productos más vendidos de una categoría -->
            <!-- Swiper -->
            <!-- Slider main container -->
            <div class="swiper mt-3">
                <!-- Additional required wrapper -->
                <div class="swiper-wrapper" id="wrapper${contador}">
                    <!-- Slides -->
                </div>

                <div class="swiper-button-prev custom-prev"></div>
                <div class="swiper-button-next custom-next"></div>
            </div>

            `;
            cargarCarrusel(contador, item.id_sub_categoria);
            contador++;
        });
    }
}

const cargarCarrusel = async (contador, id) => {
    FORM = new FormData();
    FORM.append('idSubCategoria',id);
    const DATA = await fetchData(PRODUCTO_API, 'readAllSub', FORM);
    if (DATA.status) {
        DATA.dataset.forEach(item => {
            document.getElementById('wrapper'+contador).innerHTML += `

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