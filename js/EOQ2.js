// Función para calcular EOQ
/*
function calculateEOQ(demand, orderCost, holdingCost) {
    return Math.sqrt((2 * demand * (365) * orderCost) / holdingCost);
}
*/
// Función para calcular EOQ
function calculateEOQ(demand, orderCost, holdingCost) {
    // Validar que los valores sean numéricos y no sean ni null ni undefined
    if (isNaN(demand) || demand == null || isNaN(orderCost) || orderCost == null || isNaN(holdingCost) || holdingCost == null) {
        console.error("Error: Alguno de los valores de entrada no es válido.");
        return null; // Retorna null para indicar un error en el cálculo
    }

    // Proceder con el cálculo si las entradas son válidas
    return Math.sqrt((2 * demand * 365 * orderCost) / holdingCost);
}




// Función para agregar un nuevo registro
function addRecord(demand, orderCost, holdingCost, eoq, isPdfDownload = false) {
    if (!isPdfDownload) {
        const tableBody = document.getElementById("data-body");
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
                    <td class="demand">${demand}</td>
                    <td>${orderCost}</td>
                    <td>${holdingCost}</td>
                    <td class="eoq">${eoq.toFixed(2)}</td>
                    <td>${analyzeEOQ(eoq)}</td>
                    <td>
                        <button class="edit">Editar</button>
                        <button class="delete">Eliminar</button>
                    </td>
                `;
        tableBody.appendChild(newRow);
    }
}

// Función para eliminar un registro
function deleteRecord(event) {
    if (event.target.classList.contains("delete")) {
        const row = event.target.closest("tr");
        row.remove();
        updateLocalStorage();
    }
}

// Función para editar un registro
function editRecord(event) {
    if (event.target.classList.contains("edit")) {
        const row = event.target.closest("tr");
        const cells = row.querySelectorAll("td");

        const demand = parseFloat(cells[0].innerText);
        const orderCost = parseFloat(cells[1].innerText);
        const holdingCost = parseFloat(cells[2].innerText);

        document.getElementById("demand").value = demand;
        document.getElementById("order-cost").value = orderCost;
        document.getElementById("holding-cost").value = holdingCost;

        row.remove();
        updateLocalStorage();
    }
}

// Función para analizar el resultado EOQ
function analyzeEOQ(eoq) {
    const eoqValue = parseFloat(eoq);
    return `La cantidad de pedidos que la empresa deberá realizar es de ${eoqValue.toFixed(0)} unidades para que el inventario no se agote durante el tiempo de entrega.`;
}

// Actualizar los datos en localStorage después de eliminar o editar un registro
function updateLocalStorage() {
    const tableRows = document.querySelectorAll("#data-body tr");
    const records = [];
    tableRows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const demand = parseFloat(cells[0].innerText);
        const orderCost = parseFloat(cells[1].innerText);
        const holdingCost = parseFloat(cells[2].innerText);
        const eoq = parseFloat(cells[3].innerText);
        records.push({ demand, orderCost, holdingCost, eoq });
    });
    localStorage.setItem("records", JSON.stringify(records));
}

// Manejo del evento submit del formulario
document.getElementById("crud-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const demand = parseFloat(document.getElementById("demand").value);
    const orderCost = parseFloat(document.getElementById("order-cost").value);
    const holdingCost = parseFloat(document.getElementById("holding-cost").value);

    const eoq = calculateEOQ(demand, orderCost, holdingCost);

    addRecord(demand, orderCost, holdingCost, eoq);

    // Guardar en localStorage
    let records = JSON.parse(localStorage.getItem("records")) || [];
    records.push({ demand, orderCost, holdingCost, eoq });
    localStorage.setItem("records", JSON.stringify(records));

    // Limpiar campos del formulario
    this.reset();
});

// Manejo del evento click en los botones editar y eliminar
document.getElementById("data-table").addEventListener("click", function (event) {
    editRecord(event);
    deleteRecord(event);
});

// Cargar registros guardados en localStorage al cargar la página
window.addEventListener("DOMContentLoaded", function () {
    // Intenta obtener los registros desde localStorage o establece un arreglo vacío si no hay ninguno
    const records = JSON.parse(localStorage.getItem("records")) || [];

    // Verificar si realmente estamos obteniendo registros
    console.log("Registros cargados:", records);

    // Agrega cada registro al cuerpo de la tabla
    records.forEach(record => {
        const eoqCalculated = calculateEOQ(record.demand, record.orderCost, record.holdingCost);
        addRecord(record.demand, record.orderCost, record.holdingCost, eoqCalculated);
    });
});