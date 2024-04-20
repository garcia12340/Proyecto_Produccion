document.addEventListener('DOMContentLoaded', function () {
    loadRecordsFromStorage();
});

document.getElementById('costForm').addEventListener('submit', function (event) {
    event.preventDefault();
    calculateCFP();
});

function calculateCFP() {
    var demand = parseInt(document.getElementById('demand').value);
    var orderMethod = document.getElementById('orderMethod').value;
    var orderQuantity = parseInt(document.getElementById('orderQuantity').value);
    var safetyStock = parseInt(document.getElementById('safetyStock').value);

    var orderQuantityCalculated = 0;
    if (orderMethod === 'percentage') {
        orderQuantityCalculated = orderQuantity * demand / 100;
    } else {
        orderQuantityCalculated = orderQuantity;
    }

    var averageInventory = (orderQuantityCalculated / 2) + safetyStock;
    var inventoryTurnover = demand / averageInventory;

    var resultadoHTML = "<p>Nivel de Inventario Promedio: " + averageInventory.toFixed(0) + " unidades</p>" +
        "<p>Rotación de Inventario: " + inventoryTurnover.toFixed(0) + " veces al año</p>";
    document.getElementById('resultado').innerHTML = resultadoHTML;

    saveRecordToStorage(demand, orderMethod, orderQuantity, safetyStock, resultadoHTML);
}

function saveRecordToStorage(demand, orderMethod, orderQuantity, safetyStock, resultadoHTML) {
    var record = {
        demand: demand,
        orderMethod: orderMethod,
        orderQuantity: orderQuantity,
        safetyStock: safetyStock,
        resultado: resultadoHTML
    };

    var records = JSON.parse(localStorage.getItem('records')) || [];
    records.push(record);
    localStorage.setItem('records', JSON.stringify(records));

    displayRecords(records);
}

function loadRecordsFromStorage() {
    var records = JSON.parse(localStorage.getItem('records')) || [];
    displayRecords(records);
}

function displayRecords(records) {
    var tableBody = document.getElementById('recordsBody');
    tableBody.innerHTML = '';

    records.forEach(function (record, index) {
        var row = "<tr>" +
            "<td>" + record.demand + "</td>" +
            "<td>" + record.orderMethod + "</td>" +
            "<td>" + record.orderQuantity + "</td>" +
            "<td>" + record.safetyStock + "</td>" +
            "<td>" + record.resultado + "</td>" +
            "<td class='actions'>" +
            "<button class='edit' onclick='editRecord(" + index + ")'>Editar</button>" +
            "<button class='delete' onclick='deleteRecord(" + index + ")'>Eliminar</button>" +
            "</td>" +
            "</tr>";
        tableBody.innerHTML += row;
    });
}

function deleteRecord(index) {
    var records = JSON.parse(localStorage.getItem('records')) || [];
    records.splice(index, 1);
    localStorage.setItem('records', JSON.stringify(records));
    displayRecords(records);
}

function editRecord(index) {
    var records = JSON.parse(localStorage.getItem('records')) || [];
    var record = records[index];
    document.getElementById('demand').value = record.demand;
    document.getElementById('orderMethod').value = record.orderMethod;
    document.getElementById('orderQuantity').value = record.orderQuantity;
    document.getElementById('safetyStock').value = record.safetyStock;

    // Eliminar el registro editado de la lista
    records.splice(index, 1);
    localStorage.setItem('records', JSON.stringify(records));
    displayRecords(records);
}