const MAIN = document.querySelector('main');

const BARRA_ELEMENTOS = document.getElementById('barra-elementos');

const USER_API = 'services/public/clientes.php';

function abrirCarro() {
    window.location.href = 'carrito.html';
}

function abrirIndex() {
    window.location.href = 'index.html';
}


const cargarPlantilla = async (tipoNavbar) => {

    // Se valida el navbar que se mostrará en la pantalla.
    // 1 = Índice.
    // 2 = Inicio de sesión, registrarse.
    // 3 = Quiénes somos.
    if (tipoNavbar == 1) {
        MAIN.insertAdjacentHTML('beforebegin', `
        <header>
            <nav class="navbar navbar-expand-lg">
                <div class="container-fluid row-gap-3">
                    <div class="col-12 col-sm-2" id="seasmart-container" onclick="abrirIndex()">
                        <div class="row">
                            <div class="col-12 d-flex align-items-center justify-content-center">
                                <img src="../../resources/img/logo.png" width="55px" height="55px">
                            </div>
                            <div class="col-12 d-flex align-items-center justify-content-center">
                                <p id="texto-ss">S<span>ea</span>S<span>mart</span></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-10 col-sm-8 d-flex justify-content-center" id="divBuscador">
                        <form class="d-flex w-75 bg-light" id="formBuscar">
                            <button type="reset" class="btn input-group-addon d-flex align-items-center justify-content-center"
                                id="btnReset">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                            <input class="form-control bg-light" type="search" placeholder="Buscar una categoría.."
                                aria-label="Buscar" id="busqueda" name="busqueda">
                            <button type="submit" class="btn input-group-addon d-flex align-items-center justify-content-center"
                                id="btnBuscar">
                                <img src="../../resources/img/lupa.png" class="img-fluid" width="18px" height="18px"
                                    alt="buscarimg">
                            </button>
                        </form>
                    </div>
                    <div class="col-1 d-flex justify-content-end pe-3 d-block d-md-none" id="btnCollapse">
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#listaCollapse">
                            <span class="navbar-toggler-icon"></span></button>
                    </div>
                    <div class="collapse navbar-collapse" id="listaCollapse">
                        <div class="container-fluid d-flex justify-content-end">
                            <div class="col-12 d-flex justify-content-center">
                                <ul class="navbar-nav grid gap-3 text-center" id="barra-elementos">
                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-1 d-none d-md-block">
                        <div class="row d-flex justify-content-center align-items-center gap-0" id="contenedorUsuarioCarrito">
                            <div class="dropdown col-auto" id="cuenta">
                                <img src="../../resources/img/user.png" class="dropdown-toggle" type="button" width="35px"
                                    height="35px" data-bs-toggle="dropdown" alt="user">
                                <ul class="dropdown-menu dropdown-menu-end" id="opcionesUsuario">
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        `);

        const FORM_BUSQUEDA = document.getElementById('formBuscar');

        FORM_BUSQUEDA.addEventListener('submit', async (e) => {
        
            e.preventDefault();
        
            if(FORM_BUSQUEDA['busqueda'].value.trim() == ""){
        
                await sweetAlert(3, 'Asegúrese de agregar el nombre de la categoría para filtrar');
        
                FORM_BUSQUEDA['busqueda'].focus();
            } else{
                
                const FORM = new FormData(FORM_BUSQUEDA);

                cargarCategorias(FORM);
            }   
        });

        FORM_BUSQUEDA.addEventListener('reset', async (e) => {
        
            e.preventDefault();
        
            FORM_BUSQUEDA['busqueda'].value = "";

            cargarCategorias();
        });

    } else if (tipoNavbar == 2) {
        MAIN.insertAdjacentHTML('beforebegin', `
        <header>
            <nav class="navbar navbar-expand-lg">
                <div class="container-fluid">
                    <div class="col-12 col-sm-2" id="seasmart-container" onclick="abrirIndex()">
                        <div class="row">
                            <div class="col-12 d-flex align-items-center justify-content-center">
                                <img src="../../resources/img/logo.png" width="55px" height="55px">
                            </div>
                            <div class="col-12 d-flex align-items-center justify-content-center">
                                <p class="parrafoSeaSmart">
                                    S<span class="spanSeaSmart">ea</span class="spanSeaSmart">S<span>mart</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        `);
    } else if (tipoNavbar == 3) {
        MAIN.insertAdjacentHTML('beforebegin', `
        <header>
            <nav class="navbar navbar-expand-lg">
                <div class="container-fluid">
                    <div class="col-12 col-sm-2" id="seasmart-container" onclick="abrirIndex()">
                        <div class="row">
                            <div class="col-12 d-flex align-items-center justify-content-center">
                                <img src="../../resources/img/logo.png" width="55px" height="55px">
                            </div>
                            <div class="col-12 d-flex align-items-center justify-content-center">
                                <p class="parrafoSeaSmart">
                                    S<span class="spanSeaSmart">ea</span class="spanSeaSmart">S<span>mart</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-sm-2 d-flex justify-content-end pe-3 d-block d-md-none" id="btnCollapse">
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#listaCollapse">
                            <span class="navbar-toggler-icon"></span></button>
                    </div>
                    <div class="collapse navbar-collapse" id="listaCollapse">
                        <div class="container-fluid d-flex justify-content-end">
                            <div class="col-12 d-flex justify-content-center">
                                <ul class="navbar-nav grid gap-3 text-center" id="barra-elementos">
                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-1 d-none d-md-block">
                        <div class="row d-flex justify-content-center align-items-center gap-0" id="contenedorUsuarioCarrito">
                            <div class="dropdown col-auto" id="cuenta">
                                <img src="../../resources/img/user.png" class="dropdown-toggle" type="button" width="35px"
                                    height="35px" data-bs-toggle="dropdown" alt="user">
                                <ul class="dropdown-menu dropdown-menu-end" id="opcionesUsuario">
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
        `);
    }

    // Se almacena el contenedor que contiene la imagen de usuario y carrito:
    // Si el usuario ha iniciado sesión: Mostrar imagen de usuario y carrito,
    // si no ha iniciado sesión: Mostrar imagen de usuario.
    const CONTENEDOR_USUARIO_CARRITO = document.querySelector('#contenedorUsuarioCarrito');
    // Se almacena la lista de opciones que se muestra al hacer click en la imagen de usuario:
    // Si el usuario ha iniciado sesión mostrar: Botón mi cuenta,
    // si no ha iniciado sesión mostrar: Iniciar sesión, registrarse.
    const OPCIONES_USUARIO = document.querySelector('#opcionesUsuario');

    const DATA = await fetchData(USER_API, 'getUser');

    if (DATA.status) {
        if (tipoNavbar == 1 || tipoNavbar == 3) {
            CONTENEDOR_USUARIO_CARRITO.insertAdjacentHTML('beforeend', `
            <div class="btn col-auto" type="button" id="carrito" onclick="abrirCarro()">
                <img src="../../resources/img/carrito_de_compras.png" alt="carrito" height="35px" width="35px">
            </div>
            `);

            OPCIONES_USUARIO.insertAdjacentHTML('afterbegin', `
                <li>
                    <a class="dropdown-item px-5 text-center" href="mi_cuenta.html" id="miCuenta">
                        Mi cuenta
                    </a>
                </li>
                <li>
                    <button onclick="logOut()" class="dropdown-item px-5 text-center botonAbajo" id="cerrarSesion" style="background: none; border: none; padding: 0;">
                        Cerrar sesión <img src="../../resources/img/logout.png" alt="salir" class="ms-2" width="20px" height="20px">
                    </button>
                </li>
            `);
        }
    } else {
        // AGREGAR BOTONES DE INICIAR SESIÓN Y REGISTRARSE
        if (tipoNavbar == 1) {
            OPCIONES_USUARIO.insertAdjacentHTML('afterbegin', `
            <li>
                <a class="dropdown-item pe-5 ps-5 text-center" href="inicio_sesion.html" id="btnLogin">
                    Iniciar sesión
                </a>
            </li>
            <li>
                <a class="dropdown-item pe-5 ps-5 text-center botonAbajo" href="registro.html" id="btnRegistro">
                    Registrarse
                </a>
            </li>
            `);
        } else if (tipoNavbar == 3) {
            window.location.href = "index.html";
        }
    }

    // Se carga el footer de la página.
    MAIN.insertAdjacentHTML('afterend', `
    <footer>
        <nav class="navbar">
            <div class="container">
                <div>
                    <img src="../../resources/img/logo.png" alt="logo">
                    <p id="texto-ss">S<span>ea</span>S<span>mart</span></p>
                </div>
                <div>
                    <a href="quienes_somos.html" id="quienes_somos"><p>¿Quiénes somos?</p></a>
                </div>
                <div>
                    <h6>Contáctanos</h6>
                    <div>
                        <a href="https://facebook.com" target="_blank"><img src="../../resources/img/facebook.png" alt="facebook"></a>
                        <a href="https://instagram.com/sea__smart/" target="_blank">
                            <img src="../../resources/img/instagram.png" alt="instagram">
                        </a>
                        <a href="https://web.whatsapp.com/" target="_blank"><img src="../../resources/img/whatsapp.png" alt="whatsapp"></a>
                    </div>
                </div>
            </div>
        </nav>
    </footer>
    `);
}