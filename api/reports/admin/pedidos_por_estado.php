<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/pedido_data.php');

// Se instancian las entidades correspondientes.
$pedido = new PedidoData;

// Generar el reporte de pedidos ordenados por estado.
$pdf->startReport('Reporte de Pedidos Ordenados por Estado');

// Obtener los pedidos ordenados por estado.
$dataPedidos = $pedido->getReportePedidosPorEstado();

// Verificar si hay datos para mostrar.
if ($dataPedidos) {
    // Establecer un color de relleno para los encabezados.
    $pdf->setFillColor(225);
    // Establecer la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Imprimir las celdas con los encabezados.
    $pdf->cell(40, 10, 'Fecha del Pedido', 1, 0, 'C', 1);
    $pdf->cell(35, 10, 'Estado', 1, 0, 'C', 1);
    $pdf->cell(35, 10, 'Productos', 1, 0, 'C', 1);
    $pdf->cell(75, 10, 'Cliente', 1, 1, 'C', 1);

    // Establecer la fuente para los datos de los pedidos
    $pdf->setFont('Arial', '', 11);

    // Recorrer los registros fila por fila.
    foreach ($dataPedidos as $rowPedido) {
        // Asegurarse de que la fecha no es nula ni incorrecta antes de formatearla.
        $fechaPedido = $rowPedido['fecha_pedido'] ? date('m/d/Y', strtotime($rowPedido['fecha_pedido'])) : 'Fecha no disponible';
        // Imprimir las celdas con los datos de los pedidos
        $pdf->cell(40, 10, $fechaPedido, 1, 0);
        $pdf->cell(35, 10, $pdf->encodeString($rowPedido['estado_pedido']), 1, 0);
        $pdf->cell(35, 10, $pdf->encodeString($rowPedido['cantidad']), 1, 0);
        $pdf->cell(75, 10, $pdf->encodeString($rowPedido['nombre_cliente'] . ' ' . $rowPedido['apellido_cliente']), 1, 1);
    }
} else {
    // Si no hay datos, imprimir un mensaje
    $pdf->cell(0, 10, 'No hay pedidos disponibles', 1, 1, 'C');
}

// Enviar el documento al navegador web
$pdf->output('I', 'reporte_pedidos_por_estado.pdf');