/*
document.addEventListener('DOMContentLoaded', function () {
    loadRecordsFromStorage();
});

document.getElementById('costForm').addEventListener('submit', function (event) {
    event.preventDefault();
    calculateCFP();
});

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

function mostrarAdvertencia(message) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
}

function mostrarExito() {
    Swal.fire({
        icon: 'success',
        title: 'Buen trabajo!',
        text: 'Haz clic en el botón!',
        confirmButtonText: 'Listo!',
    });
}

function mostrarEliminacionExito() {
    Swal.fire({
        icon: 'success',
        title: 'Registro Eliminado',
        text: 'El registro ha sido eliminado exitosamente.',
        confirmButtonText: 'OK'
    });
}

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

    var resultadoText = "Nivel de Inventario Promedio: " + averageInventory.toFixed(0) + " unidades<br>" +
        "<br>Rotación de Inventario: " + inventoryTurnover.toFixed(0) + " veces al año";

    saveRecordToStorage(demand, orderMethod, orderQuantity, safetyStock, resultadoText);
    resetForm(); // Resetear el formulario después de guardar el registro
    mostrarExito(); // Mostrar notificación de éxito después de guardar
}

function saveRecordToStorage(demand, orderMethod, orderQuantity, safetyStock, resultadoText) {
    var record = {
        demand: demand,
        orderMethod: orderMethod,
        orderQuantity: orderQuantity,
        safetyStock: safetyStock,
        resultado: resultadoText
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
    mostrarEliminacionExito(); // Mostrar notificación de éxito al eliminar
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

function resetForm() {
    document.getElementById('costForm').reset();
}
*/
document.addEventListener('DOMContentLoaded', function () {
    openDatabase();
});

document.getElementById('costForm').addEventListener('submit', function (event) {
    event.preventDefault();
    calculateCFP();
});

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

function mostrarAdvertencia(message) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
}

function mostrarExito() {
    Swal.fire({
        icon: 'success',
        title: 'Buen trabajo!',
        text: 'Haz clic en el botón!',
        confirmButtonText: 'Listo!',
    });
}

function mostrarEliminacionExito() {
    Swal.fire({
        icon: 'success',
        title: 'Registro Eliminado',
        text: 'El registro ha sido eliminado exitosamente.',
        confirmButtonText: 'OK'
    });
}

function calculateCFP() {
    var recordId = document.getElementById('recordId').value;
    var demand = parseInt(document.getElementById('demand').value);
    var orderMethod = document.getElementById('orderMethod').value;
    var orderQuantity = parseInt(document.getElementById('orderQuantity').value);
    var safetyStock = parseInt(document.getElementById('safetyStock').value);
    
    console.log("Valores actuales del formulario:", {recordId, demand, orderMethod, orderQuantity, safetyStock});

    // Validar solo si no es una edición (es decir, si recordId está vacío)
    if (!recordId && (isNaN(demand) || !orderMethod || isNaN(orderQuantity) || isNaN(safetyStock))) {
        console.error("Algunos campos están vacíos o no son válidos")
        //mostrarAdvertencia("Algunos campos están vacíos o no son válidos");
        return; // No continuar si alguno de los valores es NaN o el método de pedido no está seleccionado
    }

    var orderQuantityCalculated = 0;
    if (orderMethod === 'percentage') {
        orderQuantityCalculated = orderQuantity * demand / 100;
    } else {
        orderQuantityCalculated = orderQuantity;
    }

    var averageInventory = (orderQuantityCalculated / 2) + safetyStock;
    var inventoryTurnover = demand / averageInventory;

    var resultadoText = "Nivel de Inventario Promedio: " + averageInventory.toFixed(0) + " unidades<br>" +
        "<br>Rotación de Inventario: " + inventoryTurnover.toFixed(0) + " veces al año";

    console.log("Resultado del cálculo:", resultadoText);

    if (recordId) {
        updateRecordInIndexedDB(parseInt(recordId), demand, orderMethod, orderQuantity, safetyStock, resultadoText);
    } else {
        saveRecordToIndexedDB(demand, orderMethod, orderQuantity, safetyStock, resultadoText);
    }
    resetForm(); // Resetear el formulario después de guardar el registro
    mostrarExito(); // Mostrar notificación de éxito después de guardar
}

// IndexedDB Setup
let db;

function openDatabase() {
    const request = indexedDB.open('CFPDatabase', 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        const objectStore = db.createObjectStore('records', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('demand', 'demand', { unique: false });
        objectStore.createIndex('orderMethod', 'orderMethod', { unique: false });
        objectStore.createIndex('orderQuantity', 'orderQuantity', { unique: false });
        objectStore.createIndex('safetyStock', 'safetyStock', { unique: false });
        objectStore.createIndex('resultado', 'resultado', { unique: false });
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        loadRecordsFromIndexedDB();
    };

    request.onerror = function(event) {
        console.error('Error opening IndexedDB', event);
    };
}

function saveRecordToIndexedDB(demand, orderMethod, orderQuantity, safetyStock, resultadoText) {
    const transaction = db.transaction(['records'], 'readwrite');
    const objectStore = transaction.objectStore('records');

    const record = {
        demand: demand,
        orderMethod: orderMethod,
        orderQuantity: orderQuantity,
        safetyStock: safetyStock,
        resultado: resultadoText
    };

    const request = objectStore.add(record);

    request.onsuccess = function() {
        console.log('Registro guardado en IndexedDB:', record);
        loadRecordsFromIndexedDB();
    };

    request.onerror = function(event) {
        console.error('Error saving record to IndexedDB', event);
    };
}

function updateRecordInIndexedDB(id, demand, orderMethod, orderQuantity, safetyStock, resultadoText) {
    const transaction = db.transaction(['records'], 'readwrite');
    const objectStore = transaction.objectStore('records');

    const record = {
        id: id,
        demand: demand,
        orderMethod: orderMethod,
        orderQuantity: orderQuantity,
        safetyStock: safetyStock,
        resultado: resultadoText
    };

    const request = objectStore.put(record);

    request.onsuccess = function() {
        console.log('Registro actualizado en IndexedDB:', record);
        loadRecordsFromIndexedDB();
    };

    request.onerror = function(event) {
        console.error('Error updating record in IndexedDB', event);
    };
}

function loadRecordsFromIndexedDB() {
    const transaction = db.transaction(['records'], 'readonly');
    const objectStore = transaction.objectStore('records');
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        console.log('Registros cargados de IndexedDB:', request.result);
        displayRecords(request.result);
    };

    request.onerror = function(event) {
        console.error('Error loading records from IndexedDB', event);
    };
}

function displayRecords(records) {
    const tableBody = document.getElementById('recordsBody');
    tableBody.innerHTML = '';

    records.forEach(function(record) {
        var row = "<tr>" +
            "<td>" + record.demand + "</td>" +
            "<td>" + record.orderMethod + "</td>" +
            "<td>" + record.orderQuantity + "</td>" +
            "<td>" + record.safetyStock + "</td>" +
            "<td>" + record.resultado + "</td>" +
            "<td class='actions'>" +
            "<button class='edit' onclick='editRecord(" + record.id + ")'>Editar</button>" +
            "<button class='delete' onclick='deleteRecord(" + record.id + ")'>Eliminar</button>" +
            "</td>" +
            "</tr>";
        tableBody.innerHTML += row;
    });
}

function deleteRecord(id) {
    const transaction = db.transaction(['records'], 'readwrite');
    const objectStore = transaction.objectStore('records');
    const request = objectStore.delete(id);

    request.onsuccess = function() {
        console.log('Registro eliminado de IndexedDB:', id);
        loadRecordsFromIndexedDB();
        mostrarEliminacionExito(); // Mostrar notificación de éxito al eliminar
    };

    request.onerror = function(event) {
        console.error('Error deleting record from IndexedDB', event);
    };
}

function editRecord(id) {
    const transaction = db.transaction(['records'], 'readonly');
    const objectStore = transaction.objectStore('records');
    const request = objectStore.get(id);

    request.onsuccess = function(event) {
        const record = request.result;
        document.getElementById('recordId').value = record.id;
        document.getElementById('demand').value = record.demand;
        document.getElementById('orderMethod').value = record.orderMethod;
        document.getElementById('orderQuantity').value = record.orderQuantity;
        document.getElementById('safetyStock').value = record.safetyStock;
        console.log('Registro cargado para edición:', record);

        // Asegurarse de que los valores sean números
        document.getElementById('demand').value = record.demand || '';
        document.getElementById('orderMethod').value = record.orderMethod || '';
        document.getElementById('orderQuantity').value = record.orderQuantity || '';
        document.getElementById('safetyStock').value = record.safetyStock || '';
    };

    request.onerror = function(event) {
        console.error('Error fetching record from IndexedDB', event);
    };
}

function resetForm() {
    document.getElementById('costForm').reset();
    document.getElementById('recordId').value = '';
    console.log('Formulario reseteado');
}

// Agregar validación en los inputs de demanda, cantidad de pedido y stock de seguridad
document.getElementById("demand").addEventListener("input", soloNumeros);
document.getElementById("orderQuantity").addEventListener("input", soloNumeros);
document.getElementById("safetyStock").addEventListener("input", soloNumeros);