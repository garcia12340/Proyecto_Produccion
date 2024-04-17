// Función para guardar un nuevo pedido en el localStorage y actualizar la tabla
function createPedido(D, S, H, EOQ) {
    var pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.push({ D: D, S: S, H: H, EOQ: EOQ });
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    
    // Actualizar la tabla en el localStorage
    updateTablaPedidos(pedidos);
}

// Función para actualizar la tabla de pedidos en el localStorage
function updateTablaPedidos(pedidos) {
    var tablaPedidosHTML = '<table border="1"><tr><th>Demand</th><th>Order Cost</th><th>Holding Cost</th><th>EOQ</th></tr>';
    pedidos.forEach(function(pedido) {
        tablaPedidosHTML += '<tr><td>' + pedido.D + '</td><td>' + pedido.S + '</td><td>' + pedido.H + '</td><td>' + pedido.EOQ + '</td></tr>';
    });
    tablaPedidosHTML += '</table>';
    localStorage.setItem('tablaPedidos', tablaPedidosHTML);
}

// Función para leer la tabla de pedidos del localStorage
function readTablaPedidos() {
    return localStorage.getItem('tablaPedidos') || '';
}

// Función para calcular la Cantidad Económica de Pedidos (EOQ)
function calculateEOQ() {
    event.preventDefault();
    var D = document.getElementById('demand').value;
    var S = document.getElementById('orderCost').value;
    var H = document.getElementById('holdingCost').value;
    var EOQ = Math.sqrt((2 * D * 365 * S) / H);
    var analisis = `La cantidad de pedidos que la empresa deberá realizar es de ${EOQ.toFixed(0)} unidades para que el inventario no se agote durante el tiempo de entrega.`;
    document.getElementById('resultado').innerText = analisis;

    // Guardar el pedido calculado en el localStorage
    createPedido(D, S, H, EOQ);
    
    // Actualizar la tabla en el HTML
    document.getElementById('tablaPedidos').innerHTML = readTablaPedidos();
}
