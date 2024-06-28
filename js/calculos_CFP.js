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
        mostrarAdvertencia("Algunos campos están vacíos o no son válidos");
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
    mostrarExito();
    resetForm();
}

function saveRecordToStorage(demand, orderMethod, orderQuantity, safetyStock, resultadoHTML) {
    if (!demand || !orderQuantity || !safetyStock) {
        mostrarAdvertencia("Algunos campos están vacíos o no son válidos");
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
    mostrarEliminacionExito();
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

// Validacion de los Input
function soloNumeros(event) {
    const input = event.target;
    const value = input.value;
    
    // Expresión regular para permitir solo números y un punto decimal
    const validPattern = /^(\d+\.?\d*)?$/;

    if (!validPattern.test(value)) {
        mostrarAdvertencia('Por favor, ingrese solo números.');
        input.value = value.slice(0, -1); // Eliminar el último carácter ingresado
    }
}

// Función para mostrar advertencia usando SweetAlert
function mostrarAdvertencia(message) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
}

// Función para mostrar notificación de éxito usando SweetAlert
function mostrarExito() {
    Swal.fire({
        icon: 'success',
        title: 'Buen trabajo!',
        text: 'Registro guardado exitosamente!',
        confirmButtonText: 'Listo!',
    });
}

// Función para mostrar notificación de éxito al eliminar un registro usando SweetAlert
function mostrarEliminacionExito() {
    Swal.fire({
        icon: 'success',
        title: 'Registro Eliminado',
        text: 'El registro ha sido eliminado exitosamente.',
        confirmButtonText: 'OK'
    });
}

// Función para resetear el formulario
function resetForm() {
    document.getElementById('costForm').reset();
}
