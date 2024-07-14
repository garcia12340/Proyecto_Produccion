// Configuración de IndexedDB
const dbName = 'kanbanDB';
const dbVersion = 1;
let db;

const openDBRequest = window.indexedDB.open(dbName, dbVersion);

openDBRequest.onerror = function (event) {
    console.error("Error al abrir la base de datos:", event.target.errorCode);
};

openDBRequest.onsuccess = function (event) {
    console.log("Base de datos abierta correctamente");
    db = event.target.result;
    displaySavedRecords(); // Mostrar registros guardados al cargar la página
};

openDBRequest.onupgradeneeded = function (event) {
    console.log("Actualizando la base de datos...");
    const db = event.target.result;
    const store = db.createObjectStore('kanbanStore', { keyPath: 'id', autoIncrement: true });
    store.createIndex('productName', 'productName', { unique: false });
    store.createIndex('kanban', 'kanban', { unique: false });
};

function saveToIndexedDB(records) {
    const transaction = db.transaction('kanbanStore', 'readwrite');
    const store = transaction.objectStore('kanbanStore');

    records.forEach(record => {
        store.add(record);
    });

    transaction.oncomplete = function () {
        console.log('Registros guardados en IndexedDB correctamente');
    };

    transaction.onerror = function (event) {
        console.error('Error al guardar registros en IndexedDB:', event.target.error);
    };
}

// Array para almacenar los registros de Kanbanes
let kanbanRecords = [];

function generateForm() {
    const numProducts = parseInt(document.getElementById('numProducts').value);
    const formContainer = document.getElementById('dynamic-form-container');
    const kanbanForm = document.getElementById('kanban-form');
    kanbanForm.innerHTML = ''; // Clear any existing form fields

    for (let i = 1; i <= numProducts; i++) {
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');

        formGroup.innerHTML = `
                    <label for="productName${i}">Producto ${i} (Nombre)</label>
                    <input type="text" id="productName${i}" placeholder="Nombre del Producto" oninput="return soloLetras(event);" required>
                    <label for="product${i}">Producto ${i} (Demanda diaria)</label>
                    <input type="text" id="product${i}" placeholder="Demanda diaria" oninput="return soloNumeros1(event);" required>
                    <label for="time${i}">Producto ${i} (Tiempo de reposición en minutos)</label>
                    <input type="text" id="time${i}" placeholder="Tiempo de reposición (horas)" oninput="return soloNumeros(event);" required>
                    <label for="safety${i}">Producto ${i} (Stock de seguridad en %)</label>
                    <input type="text" id="safety${i}" placeholder="Stock de seguridad (%)" oninput="return soloNumeros(event);" required>
                    <label for="container${i}">Producto ${i} (Tamaño del contenedor)</label>
                    <input type="text" id="container${i}" placeholder="Tamaño del contenedor" oninput="return soloNumeros(event);" required>
                `;

        kanbanForm.appendChild(formGroup);
    }

    // Add the calculate button
    const calculateButton = document.createElement('button');
    calculateButton.type = 'button';
    calculateButton.textContent = 'Calcular Kanbanes';
    calculateButton.onclick = calculateKanbans;
    kanbanForm.appendChild(calculateButton);

    formContainer.style.display = 'block';

    mostrarExito('form-group');
}

function calculateKanbans() {
    console.log("Inicio del cálculo de kanbanes");

    const numProducts = parseInt(document.getElementById('numProducts').value);
    const resultsBody = document.getElementById('resultsBody');

    let totalKanban = 0;
    kanbanRecords = []; // Limpiar el array de registros anteriores

    for (let i = 1; i <= numProducts; i++) {
        const productName = document.getElementById(`productName${i}`).value;
        const demand = parseFloat(document.getElementById(`product${i}`).value);
        const time = parseFloat(document.getElementById(`time${i}`).value);
        const safety = parseFloat(document.getElementById(`safety${i}`).value);
        const containerSize = parseFloat(document.getElementById(`container${i}`).value);

        mostrarExito(`Producto ${i}: ${productName}, Demanda: ${demand}, Tiempo: ${time}, Seguridad: ${safety}, Contenedor: ${containerSize}`);

        //console.log(`Producto ${i}: ${productName}, Demanda: ${demand}, Tiempo: ${time}, Seguridad: ${safety}, Contenedor: ${containerSize}`);

        const kanban = Math.abs((demand * time * (1 + safety)) / containerSize);
        //const kanban = (demand * time * (1 + safety)) / containerSize;
        console.log(`Kanban ${i}: ${Math.ceil(kanban)}`);

        totalKanban += Math.ceil(kanban);

        // Agregar el registro al array de registros
        kanbanRecords.push({
            productName: productName,
            kanban: Math.ceil(kanban)
        });

        // Agregar fila a la tabla de resultados
        const newRow = resultsBody.insertRow();
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        cell1.textContent = productName;
        cell2.textContent = Math.ceil(kanban);
    }

    // Mostrar el total de Kanbanes
    const totalRow = resultsBody.insertRow();
    const totalCell1 = totalRow.insertCell(0);
    const totalCell2 = totalRow.insertCell(1);
    totalCell1.textContent = 'Total';
    totalCell2.textContent = totalKanban;

    // Mostrar los resultados si no están visibles
    if (document.getElementById('results').style.display === 'none') {
        document.getElementById('results').style.display = 'block';
    }

    // Guardar en IndexedDB
    saveToIndexedDB(kanbanRecords);

    console.log(`Total Kanbanes: ${totalKanban}`);
}

// Función para mostrar los registros guardados al cargar la página
function displaySavedRecords() {
    const transaction = db.transaction('kanbanStore', 'readonly');
    const store = transaction.objectStore('kanbanStore');
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = function (event) {
        const records = event.target.result;
        const resultsBody = document.getElementById('resultsBody');

        resultsBody.innerHTML = ''; // Limpiar la tabla antes de agregar registros

        records.forEach(record => {
            const newRow = resultsBody.insertRow();
            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            cell1.textContent = record.productName;
            cell2.textContent = record.kanban;
        });
    };

    getAllRequest.onerror = function (event) {
        console.error('Error al obtener registros de IndexedDB:', event.target.error);
    };
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

// Validación de los Input para letras
function soloLetras(event) {
    const input = event.target;
    const value = input.value;
    
    // Expresión regular para permitir solo letras
    const validPattern = /^[a-zA-Z]*$/;

    if (!validPattern.test(value)) {
        mostrarAdvertencia('Por favor, ingrese solo letras.');
        input.value = value.slice(0, -1); // Eliminar el último carácter ingresado
    }
}

// Validación de los Input
function soloNumeros1(event) {
    const input = event.target;
    const value = input.value;
    
    // Expresión regular para permitir solo números
    const validPattern = /^-?\d*$/;

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
        text: 'Haz clic en el botón!',
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
