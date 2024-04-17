function calculateEOQ(event) {
    event.preventDefault();

    const demand = document.querySelector("#demand").value;
    const orderCost = document.querySelector("#orderCost").value;
    const holdingCost = document.querySelector("#holdingCost").value;

    if (!demand || !orderCost || !holdingCost) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const eoq = Math.sqrt((2 * (demand) * (365) * orderCost) / holdingCost);

    // Guardar resultados en localStorage
    const calculos = JSON.parse(localStorage.getItem("calculos")) || [];
    calculos.push({ demand, orderCost, holdingCost, eoq });
    localStorage.setItem("calculos", JSON.stringify(calculos));

    // Agregar fila a la tabla
    agregarFilaATabla(demand, orderCost, holdingCost, eoq);
}

function agregarFilaATabla(demand, costoPedido, costoMantenimiento, eoq) {
    const tbody = document.querySelector("#resultadosTabla tbody");
    const fila = document.createElement("tr");

    // Generar un ID único para la fila
    const filaID = `fila-${Date.now()}`;
    fila.setAttribute("id", filaID);

    const celdaDemanda = document.createElement("td");
    celdaDemanda.textContent = demand;
    fila.appendChild(celdaDemanda);

    const celdaCostoPedido = document.createElement("td");
    celdaCostoPedido.textContent = costoPedido;
    fila.appendChild(celdaCostoPedido);

    const celdaCostoMantenimiento = document.createElement("td");
    celdaCostoMantenimiento.textContent = costoMantenimiento;
    fila.appendChild(celdaCostoMantenimiento);

    const celdaEOQ = document.createElement("td");
    celdaEOQ.textContent = eoq.toFixed(0);
    fila.appendChild(celdaEOQ);

    const celdaAnalisis = document.createElement("td");
    celdaAnalisis.textContent = `La cantidad de pedidos que la empresa deberá realizar es de ${eoq.toFixed(0)} unidades para que el inventario no se agote durante el tiempo de entrega.`;
    fila.appendChild(celdaAnalisis);

    tbody.appendChild(fila);

    // Agrega un evento de clic a la fila recién agregada
    fila.addEventListener("click", () => {
        // Extrae los datos de la fila seleccionada
        document.querySelector("#demand").value = demand;
        document.querySelector("#orderCost").value = costoPedido;
        document.querySelector("#holdingCost").value = costoMantenimiento;
        // Puedes hacer lo mismo para otros campos si los tienes en el formulario
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const calculos = JSON.parse(localStorage.getItem("calculos")) || [];
    calculos.forEach((calculo) => {
        agregarFilaATabla(calculo.demand, calculo.orderCost, calculo.holdingCost, calculo.eoq);
    });

    // Agrega un evento de clic a cada fila de la tabla
    const filasTabla = document.querySelectorAll("#resultadosTabla tbody tr");
    filasTabla.forEach((fila) => {
        fila.addEventListener("click", () => {
            // Extrae los datos de la fila seleccionada
            const cells = fila.querySelectorAll("td");
            const demand = cells[0].textContent;
            const orderCost = cells[1].textContent;
            const holdingCost = cells[2].textContent;
            const eoq = cells[3].textContent;

            // Llena el formulario de edición con los datos de la fila seleccionada
            document.querySelector("#demand").value = demand;
            document.querySelector("#orderCost").value = orderCost;
            document.querySelector("#holdingCost").value = holdingCost;
            // Puedes hacer lo mismo para otros campos si los tienes en el formulario
        });
    });
});
