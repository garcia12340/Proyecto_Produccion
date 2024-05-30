
//Formula de Cantidad Económica de Pedidos
document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('formulario');
  var calcularButton = document.getElementById('calcularButton');

  form.addEventListener('submit', function(event) {
      event.preventDefault(); // Evitar que el formulario se envíe y recargue la página
      calcularCMT();
  });

  function calcularCMT() {
      var horas = parseFloat(document.getElementById('horas').value);
      var mtbf = document.getElementById('mtbf').value;
      var valorMtbf = parseFloat(document.getElementById('valorMtbf').value);
      var duracion = parseFloat(document.getElementById('duracion').value);
      var costoHora = parseFloat(document.getElementById('costoHora').value);
      var repuestos = parseFloat(document.getElementById('repuestos').value);
      var costosOperacionales = parseFloat(document.getElementById('costosOperacionales').value);
      var retrasoLogistico = parseFloat(document.getElementById('retrasoLogistico').value);
      var costoUnitario = parseFloat(document.getElementById('costoUnitario').value);
      var costosFallas = parseFloat(document.getElementById('costosFallas').value);

      // Calcular MTBF
      var MTBF;
      if (mtbf === 'hours') {
          MTBF = valorMtbf;
      } else if (mtbf === 'percentage') {
          MTBF = horas * (valorMtbf / 100);
      } else {
          console.error('Tipo de MTBF no válido');
          return;
      }

      // Calcular el número de fallas esperadas durante el tiempo de mantenimiento
      var numeroFallas = horas / MTBF;

      // Calcular el costo correctivo
      // Corregi la formula del mant correctivo para cuando tenemos el retraso logistico
      var costoCorrectivo = numeroFallas.toFixed(0) * ((duracion * costoHora + repuestos + costosOperacionales+retrasoLogistico) + (duracion* costoUnitario + costosFallas));


      // Realizar el análisis en texto
      var analisis = "Basado en los datos ingresados, se estima que habrá aproximadamente " + numeroFallas.toFixed(0) + " fallas durante el tiempo de mantenimiento. Estas fallas tienen un costo total estimado de $" + costoCorrectivo.toFixed(0) + ".";

      // Mostrar el resultado con el análisis
      document.getElementById('resultado').innerText = analisis;
  }
});

//Formula de Cantidad Económica de Pedidos
function calculateEOQ() {
  event.preventDefault(); // Detener el comportamiento predeterminado del formulario
  var D = document.getElementById('demand').value;
  var S = document.getElementById('orderCost').value;
  var H = document.getElementById('holdingCost').value;
  
  var EOQ = Math.sqrt((2 * (D) * (365) * S) / H);

  var analisis = 
  `La cantidad de pedidos que la empresa deberá realizar es de ${EOQ.toFixed(0)} unidades para que el inventario no se agote durante el tiempo de
  entrega.`;

  document.getElementById('resultado').innerText = analisis;
}

//Formula de Costo Fijo Por Pieza
function calculateCFP() {
  event.preventDefault(); // Detener el comportamiento predeterminado del formulario
  
  var demand = parseInt(document.getElementById('demand').value);
  var orderMethod = document.getElementById('orderMethod').value;
  var orderQuantityInput = document.getElementById('orderQuantityInput');
  var orderQuantity = 0;

  if (orderMethod === 'percentage') {
      orderQuantity = parseInt(document.getElementById('orderQuantity').value) * demand / 100;
  } else {
      orderQuantity = parseInt(document.getElementById('orderQuantity').value);
  }

  var safetyStock = parseInt(document.getElementById('safetyStock').value);
  
  var averageInventory = (orderQuantity / 2) + safetyStock;
  var inventoryTurnover = demand / averageInventory;
  
  document.getElementById('resultado').innerHTML = "<p>Nivel de Inventario Promedio: " + averageInventory.toFixed(0) + " unidades</p>" +
                                                    "<p>Rotación de Inventario: " + inventoryTurnover.toFixed(0) + " veces al año</p>";
}

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