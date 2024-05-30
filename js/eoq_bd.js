// URL base para las solicitudes REST
const API_URL = 'http://localhost:4000/cantidad_Pedido';

// Función para generar un UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Función para calcular EOQ
function calculateEOQ(demand, orderCost, holdingCost) {
    if (isNaN(demand) || demand == null || isNaN(orderCost) || orderCost == null || isNaN(holdingCost) || holdingCost == null) {
        console.error("Error: Alguno de los valores de entrada no es válido.");
        return null;
    }
    return Math.sqrt((2 * demand * 365 * orderCost) / holdingCost);
}

// Función para mostrar un registro en la tabla
function displayRecord(record) {
    const tableBody = document.getElementById("data-body");
    const newRow = document.createElement("tr");
    newRow.dataset.id = record.id;
    newRow.innerHTML = `
        <td class="demand">${record.demand}</td>
        <td>${record.orderCost}</td>
        <td>${record.holdingCost}</td>
        <td class="eoq">${record.eoq.toFixed(2)}</td>
        <td>${analyzeEOQ(record.eoq)}</td>
        <td>
            <button class="edit">Editar</button>
            <button class="delete">Eliminar</button>
        </td>
    `;
    tableBody.appendChild(newRow);
}

// Función para agregar un nuevo registro
async function addRecord(demand, orderCost, holdingCost, eoq) {
    const id = generateUUID();
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, demand, orderCost, holdingCost, eoq })
    });

    if (response.ok) {
        const newRecord = await response.json();
        displayRecord(newRecord);
    } else {
        console.error('Error al agregar el registro');
    }
}

// Función para eliminar un registro
async function deleteRecord(event) {
    if (event.target.classList.contains("delete")) {
        const row = event.target.closest("tr");
        const id = row.dataset.id;

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            row.remove();
        } else {
            console.error('Error al eliminar el registro');
        }
    }
}

// Función para editar un registro
async function editRecord(event) {
    if (event.target.classList.contains("edit")) {
        const row = event.target.closest("tr");
        const cells = row.querySelectorAll("td");

        const demand = parseFloat(cells[0].innerText);
        const orderCost = parseFloat(cells[1].innerText);
        const holdingCost = parseFloat(cells[2].innerText);
        const id = row.dataset.id;

        document.getElementById("demand").value = demand;
        document.getElementById("order-cost").value = orderCost;
        document.getElementById("holding-cost").value = holdingCost;

        row.remove();

        const eoq = calculateEOQ(demand, orderCost, holdingCost);
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, demand, orderCost, holdingCost, eoq })
        });

        if (!response.ok) {
            console.error('Error al actualizar el registro');
        }
    }
}

// Función para analizar el resultado EOQ
function analyzeEOQ(eoq) {
    const eoqValue = parseFloat(eoq);
    return `La cantidad de pedidos que la empresa deberá realizar es de ${eoqValue.toFixed(0)} unidades para que el inventario no se agote durante el tiempo de entrega.`;
}

// Manejo del evento submit del formulario
document.getElementById("crud-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const demand = parseFloat(document.getElementById("demand").value);
    const orderCost = parseFloat(document.getElementById("order-cost").value);
    const holdingCost = parseFloat(document.getElementById("holding-cost").value);

    const eoq = calculateEOQ(demand, orderCost, holdingCost);

    await addRecord(demand, orderCost, holdingCost, eoq);

    this.reset();
});

// Manejo del evento click en los botones editar y eliminar
document.getElementById("data-table").addEventListener("click", function (event) {
    editRecord(event);
    deleteRecord(event);
});

// Cargar registros guardados en el CRM al cargar la página
window.addEventListener("DOMContentLoaded", async function () {
    const response = await fetch(API_URL);
    const records = await response.json();

    records.forEach(record => {
        displayRecord(record);
    });
});
