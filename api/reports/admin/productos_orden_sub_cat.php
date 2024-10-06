<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/categoria_data.php');
require_once('../../models/data/subcategoria_data.php');
require_once('../../models/data/producto_data.php');

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Productos Ordenados por Categoría y Subcategoría');

// Se instancia el módelo Categoría para obtener los datos.
$categoria = new CategoriaData;
// Se instancia el módelo SubCategoria para procesar los datos.
$sub_categoria = new subCategoriaData;
// Se instancian las entidades correspondientes.
$producto = new ProductoData;

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataCategorias = $categoria->readAll()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(225);
    // Se establece la fuente para los encabezados.
    //setFont(Nombre de la fuente, Estilo, Tamaño)
    $pdf->setFont('Arial', 'B', 11);

    // Se imprimen las celdas con los encabezados.
    //cell(Ancho de la celda, Alto de la celda, Valor de la celda, Tendrá Borde o no, Salto de linea, Alineado del texto C: center, Relleno de la celda)
    $pdf->cell(126, 10, 'Nombre', 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Precio (US$)', 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Estado', 1, 1, 'C', 1);

    // Se recorren los registros fila por fila.
    foreach ($dataCategorias as $rowCategoria) {
        // Se establece un color de relleno para el fondo de la celda de la categoría.
        $pdf->setFillColor(43, 158, 216);
        // Se establece un color de relleno para el color de texto de la categoría.
        $pdf->SetTextColor(255, 255, 255);
        //setFont(Nombre de la fuente, Estilo, Tamaño)
        $pdf->setFont('Arial', 'B', 11);
        // Se imprime una celda con el nombre de la categoría.
        $pdf->cell(0, 10, $pdf->encodeString('Categoría: ' . $rowCategoria['nombre_categoria']), 1, 1, 'C', 1);
        // Se establece el id de la categoría para obtener sus subcategorías, de lo contrario se imprime un mensaje de error.
        if ($sub_categoria->setIdCategoria($rowCategoria['id_categoria'])) {
            // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
            if ($dataSubCategorias = $sub_categoria->readAllCategoria()) {
                // Se recorren los registros fila por fila.
                foreach ($dataSubCategorias as $rowSubCategoria) {
                    // Se establece un color de relleno para el fondo de la celda de la subcategoría.
                    $pdf->setFillColor(255, 255, 255);
                    // Se establece un color de relleno para el color de texto de la subcategoría.
                    $pdf->SetTextColor(0);
                    //setFont(Nombre de la fuente, Estilo, Tamaño)
                    $pdf->setFont('Arial', 'B', 11);
                    // Se imprime una celda con el nombre de la subcategoría.
                    $pdf->cell(0, 10, $pdf->encodeString('Subcategoría: ' . $rowSubCategoria['nombre_sub_categoria']), 1, 1, 'C', 1);
                    // Se establece el id de la subcategoría para obtener sus productos, de lo contrario se imprime un mensaje de error.
                    if ($producto->setSubcategoria($rowSubCategoria['id_sub_categoria'])) {
                        // Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
                        if ($dataProductos = $producto->productosSubCategoria()) {
                            // Se recorren los registros fila por fila.
                            foreach ($dataProductos as $rowProducto) {
                                // Se establece un color de relleno para el fondo de la celda de la subcategoría.
                                $pdf->setFillColor(225);
                                // Se establece la fuente para los datos de los productos.
                                $pdf->setFont('Arial', '', 11);
                                ($rowProducto['estado_producto']) ? $estado = 'Activo' : $estado = 'Inactivo';
                                // Se imprimen las celdas con los datos de los productos.
                                $pdf->cell(126, 10, $pdf->encodeString($rowProducto['nombre_producto']), 1, 0);
                                $pdf->cell(30, 10, $rowProducto['precio_producto'], 1, 0);
                                $pdf->cell(30, 10, $estado, 1, 1);
                            }
                        } else {
                            // Se establece la fuente para los datos de los productos.
                            $pdf->setFont('Arial', '', 11);
                            // Se establece un color de relleno para el color de texto de la subcategoría.
                            $pdf->SetTextColor(0);
                            $pdf->cell(0, 10, $pdf->encodeString('No hay productos para la subcategoría'), 1, 1);
                        }
                    } else {
                        // Se establece la fuente para los datos de los productos.
                        $pdf->setFont('Arial', '', 11);
                        // Se establece un color de relleno para el color de texto de la subcategoría.
                        $pdf->SetTextColor(0);
                        $pdf->cell(0, 10, $pdf->encodeString('Subcategoría incorrecta o inexistente'), 1, 1);
                    }
                }
            } else {
                // Se establece la fuente para los datos de los productos.
                $pdf->setFont('Arial', '', 11);
                // Se establece un color de relleno para el color de texto de la subcategoría.
                $pdf->SetTextColor(0);
                $pdf->cell(0, 10, $pdf->encodeString('No hay subcategorías para mostrar'), 1, 1);
            }
        } else {
            // Se establece la fuente para los datos de los productos.
            $pdf->setFont('Arial', '', 11);
            // Se establece un color de relleno para el color de texto de la subcategoría.
            $pdf->SetTextColor(0);
            $pdf->cell(0, 10, $pdf->encodeString('Categoría incorrecta o inexistente'), 1, 1);
        }
    }
} else {
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);
    // Se establece un color de relleno para el color de texto de la subcategoría.
    $pdf->SetTextColor(0);
    $pdf->cell(0, 10, $pdf->encodeString('No hay categorías para mostrar'), 1, 1);
}
// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'productosordenados.pdf');
