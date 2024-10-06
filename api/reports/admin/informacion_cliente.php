<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/cliente_data.php');
require_once('../../models/data/pedido_data.php');
require_once('../../models/data/direccion_data.php');

// Se instancian las entidades correspondientes.
$clientes = new ClienteData;
$pedido = new PedidoData;
$direccion = new DireccionData;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Reporte de Clientes y Pedidos');

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataClientes = $clientes->readAll2()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(225);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(70, 10, 'Nombre', 1, 0, 'C', 1);
    $pdf->cell(55, 10, 'Correo', 1, 0, 'C', 1);
    $pdf->cell(25, 10, 'DUI', 1, 0, 'C', 1);
    $pdf->cell(20, 10, 'Tel. Movil', 1, 0, 'C', 1);
    $pdf->cell(20, 10, 'Tel. Fijo', 1, 1, 'C', 1);

    // Se establece la fuente para los datos de los clientes.
    $pdf->setFont('Arial', '', 11);

    // Se recorren los registros fila por fila.
    foreach ($dataClientes as $rowClientes) {
        // Se imprimen las celdas con los datos de los clientes.
        $pdf->cell(70, 10, $pdf->encodeString($rowClientes['nombre_cliente'] . " " . $rowClientes['apellido_cliente']), 1, 0);
        $pdf->cell(55, 10, $pdf->encodeString($rowClientes['correo_cliente']), 1, 0);
        $pdf->cell(25, 10, $pdf->encodeString($rowClientes['dui_cliente']), 1, 0);
        $pdf->cell(20, 10, $pdf->encodeString(isset($rowClientes['telefono_movil']) ? $rowClientes['telefono_movil'] : 'N/A'), 1, 0);
        $pdf->cell(20, 10, $pdf->encodeString(isset($rowClientes['telefono_fijo']) ? $rowClientes['telefono_fijo'] : 'N/A'), 1, 1);

        // Se imprimen las direcciones del cliente.
        if ($dataDirecciones = $direccion->readByCliente($rowClientes['id_cliente'])) {
            $pdf->setFillColor(43, 158, 216);
            $pdf->setTextColor(255, 255, 255);
            $pdf->setFont('Arial', 'B', 10);
            $pdf->cell(190, 10, 'Direcciones:', 1, 1, 'C', 1);
            $pdf->setTextColor(0, 0, 0);
            $pdf->setFont('Arial', '', 10);
            foreach ($dataDirecciones as $rowDireccion) {
                $pdf->cell(190, 10, $pdf->encodeString($rowDireccion['direccion']), 1, 1);
            }
        }

        // Se imprimen los pedidos del cliente.
        if ($dataPedidos = $pedido->readByCliente($rowClientes['id_cliente'])) {
            $pdf->setFillColor(43, 158, 216);
            $pdf->setTextColor(255, 255, 255);
            $pdf->setFont('Arial', 'B', 10);
            $pdf->cell(190, 10, 'Pedidos:', 1, 1, 'C', 1);
            $pdf->setTextColor(0, 0, 0);
            $pdf->setFont('Arial', 'B', 10);
            $pdf->cell(50, 10, 'Fecha', 1, 0, 'C');
            $pdf->cell(50, 10, 'Estado', 1, 0, 'C');
            $pdf->cell(90, 10, 'Direccion', 1, 1, 'C');
            $pdf->setFont('Arial', '', 10);
            foreach ($dataPedidos as $rowPedido) {
                $pdf->cell(50, 10, $pdf->encodeString($rowPedido['fecha_pedido']), 1, 0);
                $pdf->cell(50, 10, $pdf->encodeString($rowPedido['estado_pedido']), 1, 0);
                $pdf->cell(90, 10, $pdf->encodeString($rowPedido['direccion']), 1, 1);
            }
        }
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay clientes para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'reporte_clientes.pdf');