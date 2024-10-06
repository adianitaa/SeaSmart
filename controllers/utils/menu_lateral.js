const MENU_CUENTA = document.getElementById('menu_cuenta');
 
MENU_CUENTA.insertAdjacentHTML('afterbegin', `
    <!-- Título de menú -->
    <div class="container-fluid px-5">
        <div class="row d-flex align-items-center justify-content-center gap-2">
            <!-- Ícono de menú -->
            <div class="col-auto d-flex">
                <i class="bi bi-columns-gap h3"></i>
            </div>
            <div  class="col-auto d-flex">
                <p class="p-0 m-0 fs-2">Menú</p>
            </div>
        </div>
        <!-- Botones del menú -->
        <div class="row gap-3 d-flex flex-md-row flex-lg-column mb-5 mt-4">
            <!-- Botón mis pedidos -->
            <div class="col d-flex justify-content-center">
                <div class="vr"></div>
                <a href="mis_pedidos.html"><button class="btn btn-primary rounded-0" type="button"><img src="../../resources/img/camion.png" alt="Camion" width="40px" height="25px">
                            Mis pedidos</button></a>
            </div>
            <!-- Botón mi información -->
            <div class="col d-flex justify-content-center">
                <div class="vr"></div>
                    <a href="mi_informacion.html">
                        <button class="btn btn-primary rounded-0" type="button">
                            <img src="../../resources/img/user.png" alt="Camion" width="25px" height="25px"> Mi información
                        </button>
                    </a>
                </div>
                <!-- Botón cerrar sesión -->
                <div class="col d-flex justify-content-center ms-1">
            <button class="btn btn-primary rounded-pill fw-semibold" type="button" onclick="logOut()">
                Cerrar sesión
                <img src="../../resources/img/logout.png" alt="Cerrar Sesion" width="20px">
            </button>
            </div>
        </div>
    </div>
    `
);
 
// if(){
 
// } 