
//Formula de Cantidad Económica de Pedidos
/*
function calculateEOQ() {
    var D = document.getElementById('demand').value;
    var S = document.getElementById('orderCost').value;
    var H = document.getElementById('holdingCost').value;
    
    var EOQ = Math.sqrt((2 * (D) * (365) * S) / H);
    document.getElementById('result').innerText = 'EOQ: ' + EOQ.toFixed(0);
}
*/

//Formula de Costo Promedio Por Pieza
function calcularCPP() {
    event.preventDefault(); // Detener el comportamiento predeterminado del formulario
    
    var demanda = parseInt(document.getElementById('demanda').value);
    var ciclo = parseInt(document.getElementById('ciclo').value);
    var seguridad = parseInt(document.getElementById('seguridad').value);
    
    var nivelInventarioPromedio = (demanda * ciclo / 2) + seguridad;
    var rotacionInventario = demanda / nivelInventarioPromedio;

    // Redondear la rotación de inventario a 1 si es menor que 1
    rotacionInventario = rotacionInventario < 1 ? 1 : rotacionInventario;

    var resultadoHTML = `
      <p>Nivel de Inventario Promedio: ${nivelInventarioPromedio.toFixed(0)}</p>
      <p>Rotación de Inventario: ${rotacionInventario.toFixed(0)}</p>
    `;

    document.getElementById('resultado').innerHTML = resultadoHTML;
}