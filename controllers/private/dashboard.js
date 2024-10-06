// Constante para completar la ruta de la API.
const PRODUCTO_API = 'services/admin/productos.php';

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Constante para obtener el número de horas.
    const HOUR = new Date().getHours();
    // Se define una variable para guardar un saludo.
    let greeting = '';
    // Dependiendo del número de horas transcurridas en el día, se asigna un saludo para el usuario.
    if (HOUR < 12) {
        greeting = 'Buenos días';
    } else if (HOUR < 19) {
        greeting = 'Buenas tardes';
    } else if (HOUR <= 23) {
        greeting = 'Buenas noches';
    }

    // Llamada a la función para mostrar el encabezado y pie del documento.
    cargarPlantilla();
    // Llamada a las funciones que generan los gráficos.
    graficoPastelSubcategorias();
    graficoPastelCategorias();
    graficoBarrasTopProductos();
    graficoBarraCantidadProductosSubcategoria();
    graficoBarraCantidadProductosCategoria();
    // Se establece el título del contenido principal.
    LB_TITULO.textContent = `${greeting}, bienvenido`;
});

/*
*   Función asíncrona para mostrar un gráfico de pastel con el porcentaje de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const graficoPastelSubcategorias = async () => {
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(PRODUCTO_API, 'porcentajeProductosSubcategoria');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a gráficar.
        let subcategorias = [];
        let porcentajes = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            subcategorias.push(row.nombre_sub_categoria);
            porcentajes.push(row.porcentaje);
        });
        // Llamada a la función para generar y mostrar un gráfico de pastel. Se encuentra en el archivo components.js
        pieGraph('chart1', subcategorias, porcentajes, 'Porcentaje de productos por subcategoría');
    } else {
        document.getElementById('carouselChart1').remove();
        console.log(DATA.error);
    }
}

/*
*   Función asíncrona para mostrar un gráfico de pastel con el porcentaje de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const graficoPastelCategorias = async () => {
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(PRODUCTO_API, 'porcentajeProductosCategoria');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a gráficar.
        let categorias = [];
        let porcentajes = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            categorias.push(row.nombre_categoria);
            porcentajes.push(row.porcentaje);
        });
        // Llamada a la función para generar y mostrar un gráfico de pastel. Se encuentra en el archivo components.js
        pieGraph('chart2', categorias, porcentajes, 'Porcentaje de productos por categoría');
    } else {
        document.getElementById('carouselChart2').remove();
        console.log(DATA.error);
    }
}


/*
*   Función asíncrona para mostrar un gráfico de pastel con la cantidad de productos por subcategoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const graficoBarraCantidadProductosSubcategoria = async () => {
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(PRODUCTO_API, 'cantidadProductosSubcategoria');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a gráficar.
        let subcategorias = [];
        let cantidades = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            subcategorias.push(row.nombre_sub_categoria);
            cantidades.push(row.cantidad_productos);
        });
        // Llamada a la función para generar y mostrar un gráfico de barra. Se encuentra en el archivo components.js.
        barGraph('chartProdSub', subcategorias, cantidades, 'Cantidad de productos por subcategoría', 'Cantidad de productos por subcategoría');
    } else {
        console.log(DATA.error);
    }
}

/*
*   Función asíncrona para mostrar un gráfico de barras top 5 productos mas vendidos
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const graficoBarrasTopProductos = async () => {
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(PRODUCTO_API, 'topProductosMasVendidos');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a gráficar.
        let productos = [];
        let cantidades = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            productos.push(row.nombre_producto);
            cantidades.push(row.cantidad_vendida);
        });
        // Llamada a la función para generar y mostrar un gráfico de barra. Se encuentra en el archivo components.js.
        barGraph('chart3', productos, cantidades, 'Top 5 Productos Más Vendidos', 'Top 5 Productos Más Vendidos');
    } else {
        document.getElementById('carouselChart3').remove();  // Remover el gráfico si no hay datos
        console.log(DATA.error);
    }
}

/*
*   Función asíncrona para mostrar un gráfico de pastel con la cantidad de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const graficoBarraCantidadProductosCategoria = async () => {
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(PRODUCTO_API, 'cantidadProductosCategoria');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a gráficar.
        let categorias = [];
        let cantidades = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            categorias.push(row.nombre_categoria);
            cantidades.push(row.cantidad_productos);
        });
        // Llamada a la función para generar y mostrar un gráfico de barra. Se encuentra en el archivo components.js.
        barGraph('chartProdCat', categorias, cantidades, 'Cantidad de productos por categoría', 'Cantidad de productos por categoría');
    } else {
        document.getElementById('carouselChartProdCat').remove();
        console.log(DATA.error);
    }
}
