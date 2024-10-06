// Ejemplo de productos (esto ya luego se tiene que configurar con la bd)
var productos = [
    { nombre: "Producto 1", imagen: "imagen1.jpg" },
    { nombre: "Producto 2", imagen: "imagen2.jpg" },
    { nombre: "Producto 3", imagen: "imagen3.jpg" },
    { nombre: "Producto 1", imagen: "imagen4.jpg" },
    { nombre: "Producto 2", imagen: "imagen5.jpg" },
    { nombre: "Producto 3", imagen: "imagen6.jpg" },
];

// Función para mostrar los productos en columnas y filas
function mostrarProductos() {
    var productosHTML = "";
    productos.forEach(function (producto) {
        productosHTML += `
        <div class="col-md-3 row-cols-5">
          <div class="card mb-3">
            <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
            <div class="card-body">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
      `;
    });
    document.getElementById("productosRow").innerHTML = productosHTML;
}

// Llama a la función para mostrar los productos al cargar la página
mostrarProductos();