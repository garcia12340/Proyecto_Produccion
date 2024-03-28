function calculateEOQ() {
    var D = document.getElementById('demand').value;
    var S = document.getElementById('orderCost').value;
    var H = document.getElementById('holdingCost').value;
    
    var EOQ = Math.sqrt((2 * (D) * (365) * S) / H);
    document.getElementById('result').innerText = 'EOQ: ' + EOQ.toFixed(0);
}

function calcular() {
    var horas = parseFloat(document.getElementById('horas').value);
    var mtbf = parseFloat(document.getElementById('mtbf').value) / 100;
    var duracion = parseFloat(document.getElementById('duracion').value);
    var costoHora = parseFloat(document.getElementById('costoHora').value);
    var repuestos = parseFloat(document.getElementById('repuestos').value);
    var costosOperacionales = parseFloat(document.getElementById('costosOperacionales').value);
    var retrasoLogistico = parseFloat(document.getElementById('retrasoLogistico').value);
    var costoUnitario = parseFloat(document.getElementById('costoUnitario').value);
    var costosFallas = parseFloat(document.getElementById('costosFallas').value);

    // Calcular MTBF
    var MTBF = horas * mtbf;

    // Calcular el número de fallas esperadas durante el tiempo de mantenimiento
    var numeroFallas = horas / MTBF;

    // Calcular el costo correctivo
    var costoCorrectivo = numeroFallas.toFixed(0) * ((duracion * costoHora + repuestos + costosOperacionales + retrasoLogistico) + (duracion * costoUnitario + costosFallas));

    // Realizar el análisis en texto
    var analisis = "Basado en los datos ingresados, se estima que habrá aproximadamente " + numeroFallas.toFixed(0) + " fallas durante el tiempo de mantenimiento. Estas fallas tienen un costo total estimado de $" + costoCorrectivo.toFixed(0) + ".";

    // Mostrar el resultado con el análisis
    document.getElementById('resultado').innerText = analisis;

    // Mostrar el resultado
   // document.getElementById('resultado').innerText = "Costo de Mantenimiento Correctivo: $" + costoCorrectivo.toFixed(0);
}





