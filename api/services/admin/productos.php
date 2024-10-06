<?php
// Se incluye la clase del modelo.
require_once('../../models/data/producto_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $producto = new ProductoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // La acción searchRows permite buscar productos por su nombre, descripción, nombre de administrador que agregó el registro
                // o nombre de subcategoría a la que corresponde/n la búsqueda.
            case 'searchRows':
                if (!Validator::validateSearch($_POST['buscarProducto'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $producto->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
                // La acción createRow permite crear un nuevo registro de producto.
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$producto->setNombre($_POST['nombreProducto']) or
                    !$producto->setDescripcion($_POST['descripcionProducto']) or
                    !$producto->setSubcategoria($_POST['selectSubcategoria']) or
                    !$producto->setPrecio($_POST['precioProducto'])
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($_POST['precioProducto'] == 0) {
                    $result['error'] = 'El precio del producto no puede ser cero';
                } elseif ($producto->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el producto';
                }
                break;
                // La acción readAll retorna todos los productos registrados.
            case 'readAll':
                if ($result['dataset'] = $producto->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen productos registrados';
                }
                break;
                // La acción readOne retorna la información de un producto específico.
            case 'readOne':
                if (!$producto->setId($_POST['idProducto'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $producto->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Producto inexistente';
                }
                break;
                // La acción updateRow permite editar la información de un producto específico.
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$producto->setId($_POST['idProducto']) or
                    !$producto->setNombre($_POST['nombreProducto']) or
                    !$producto->setDescripcion($_POST['descripcionProducto']) or
                    !$producto->setSubcategoria($_POST['selectSubcategoria']) or
                    !$producto->setEstado($_POST['estadoProducto']) or
                    !$producto->setPrecio($_POST['precioProducto'])
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($_POST['precioProducto'] === 0) {
                    $result['error'] = 'El precio del producto no puede ser cero';
                } elseif ($producto->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el producto';
                }
                break;
                // La acción deleteRow permite eliminar un producto específico.
            case 'deleteRow':
                if (
                    !$producto->setId($_POST['idProducto'])
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el producto';
                }
                break;
                // Si no se encuentra la acción se muestra el mensaje.
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
                break;
                // La acción porcentajeProductosCategoria permite seleccionar los productos agrupados por subcategorías 
            case 'porcentajeProductosSubcategoria':
                // Se verifica que se la sentencia sql se ejecuta y se almacena en el array asociativo.
                if ($result['dataset'] = $producto->porcentajeProductosSubcategoria()) {
                    // Se devuelve el estado de la acción.
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            // Case para porcentaje de productos por categoria. 
            case 'porcentajeProductosCategoria':
                // Se verifica que se la sentencia sql se ejecuta y se almacena en el array asociativo.
                 if ($result['dataset'] = $producto->porcentajeProductosCategoria()) {
                    // Se devuelve el estado de la acción.
                     $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break; 
            // Case para el gráfico de barras top 5 productos más vendidos.
            case 'topProductosMasVendidos':
                // Se verifica que se la sentencia sql se ejecuta y se almacena en el array asociativo.
                if ($result['dataset'] = $producto->topProductosMasVendidos()) {
                    // Se devuelve el estado de la acción.
                    $result['status'] = 1;
               } else {
                   $result['error'] = 'No hay datos disponibles';
               }
               break;    
               // Case para el gráfico de cantidad de productos por subcategoría.
            case 'cantidadProductosSubcategoria':
                // Se verifica que se la sentencia sql se ejecuta y se almacena en el array asociativo.
                if ($result['dataset'] = $producto->cantidadProductosSubcategoria()) {
                    // Se devuelve el estado de la acción.
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
                // Case para el gráfico de cantidad de productos por categoría.
            case 'cantidadProductosCategoria':
                // Se verifica que se la sentencia sql se ejecuta y se almacena en el array asociativo.
                if ($result['dataset'] = $producto->cantidadProductosCategoria()) {
                    // Se devuelve el estado de la acción.
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
