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

    if (isNaN(demand) || isNaN(orderQuantity) || isNaN(safetyStock)) {
        console.error("Algunos campos están vacíos o no son válidos");
        return; // No continuar si alguno de los valores es NaN
    }

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
    if (!demand || !orderQuantity || !safetyStock) {
        console.error("Algunos campos están vacíos o no son válidos");
        return; // No guardar registros si falta información
    }

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
    console.log("Cargados de localStorage:", records);
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

//Validacion de los Input
function soloNumeros(event) {
    const key = event.key;
    const inputValue = event.target.value;
    const isNumber = (key >= '0' && key <= '9');
    const isControlKey = key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Delete' || key === 'Backspace' || key === 'Tab';
    const isDecimal = key === '.' && !inputValue.includes('.');
    const newValue = inputValue + key;

    // Check if the new value would be a negative number
    if (newValue.startsWith('-')) {
        mostrarAdvertencia('No se permiten números negativos.');
        return false;
    }

    if (isNumber || isControlKey || isDecimal) {
        return true;
    } else {
        mostrarAdvertencia('Por favor, ingrese solo números.');
        return false;
    }
}

function mostrarAdvertencia(message) {
    let warningPanel = document.getElementById('warningPanel');
    if (!warningPanel) {
        warningPanel = document.createElement('div');
        warningPanel.id = 'warningPanel';
        document.body.appendChild(warningPanel);
    }
    warningPanel.textContent = message;
    warningPanel.style.display = 'block';
    setTimeout(() => {
        warningPanel.style.display = 'none';
    }, 1000);
}