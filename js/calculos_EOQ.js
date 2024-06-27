// Función para calcular EOQ
/*
function calculateEOQ(demand, orderCost, holdingCost) {
    // Validar que los valores sean numéricos y no sean ni null ni undefined
    if (isNaN(demand) || demand == null || isNaN(orderCost) || orderCost == null || isNaN(holdingCost) || holdingCost == null) {
        console.error("Error: Alguno de los valores de entrada no es válido.");
        return null; // Retorna null para indicar un error en el cálculo
    }

    // Proceder con el cálculo si las entradas son válidas
    return Math.sqrt((2 * demand * 365 * orderCost) / holdingCost);
}

// Abrir o crear la base de datos IndexedDB
let db;
const request = indexedDB.open("EOQDatabase", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("records", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("demand", "demand", { unique: false });
    objectStore.createIndex("orderCost", "orderCost", { unique: false });
    objectStore.createIndex("holdingCost", "holdingCost", { unique: false });
    objectStore.createIndex("eoq", "eoq", { unique: false });
};

request.onsuccess = function (event) {
    db = event.target.result;
    loadRecords();
};

request.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.errorCode);
};

// Función para agregar un nuevo registro
function addRecord(demand, orderCost, holdingCost, eoq) {
    const transaction = db.transaction(["records"], "readwrite");
    const objectStore = transaction.objectStore("records");
    const newRecord = { demand, orderCost, holdingCost, eoq };
    objectStore.add(newRecord);

    transaction.oncomplete = function () {
        displayRecord(newRecord);
    };

    transaction.onerror = function (event) {
        console.error("Error adding record:", event.target.errorCode);
    };
}

function displayRecord(record) {
    const tableBody = document.getElementById("data-body");
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", record.id);
    newRow.innerHTML = `
        <td class="demand">${record.demand}</td>
        <td>${record.orderCost}</td>
        <td>${record.holdingCost}</td>
        <td class="eoq">${record.eoq ? record.eoq.toFixed(2) : "N/A"}</td>
        <td>${record.eoq ? analyzeEOQ(record.eoq) : "N/A"}</td>
        <td>
            <button class="edit">Editar</button>
            <button class="delete">Eliminar</button>
        </td>
    `;
    tableBody.appendChild(newRow);
}

// Función para eliminar un registro
function deleteRecord(event) {
    if (event.target.classList.contains("delete")) {
        const row = event.target.closest("tr");
        const id = Number(row.getAttribute("data-id"));

        const transaction = db.transaction(["records"], "readwrite");
        const objectStore = transaction.objectStore("records");
        objectStore.delete(id);

        transaction.oncomplete = function () {
            row.remove();
        };

        transaction.onerror = function (event) {
            console.error("Error deleting record:", event.target.errorCode);
        };
    }
}

// Función para editar un registro
function editRecord(event) {
    if (event.target.classList.contains("edit")) {
        const row = event.target.closest("tr");
        const cells = row.querySelectorAll("td");
        const id = Number(row.getAttribute("data-id"));

        const demand = parseFloat(cells[0].innerText);
        const orderCost = parseFloat(cells[1].innerText);
        const holdingCost = parseFloat(cells[2].innerText);

        document.getElementById("demand").value = demand;
        document.getElementById("order-cost").value = orderCost;
        document.getElementById("holding-cost").value = holdingCost;

        row.remove();

        // Eliminar el registro anterior
        const transaction = db.transaction(["records"], "readwrite");
        const objectStore = transaction.objectStore("records");
        objectStore.delete(id);

        transaction.oncomplete = function () {
            console.log("Record deleted for editing");
        };

        transaction.onerror = function (event) {
            console.error("Error deleting record for editing:", event.target.errorCode);
        };
    }
}

// Función para analizar el resultado EOQ
function analyzeEOQ(eoq) {
    const eoqValue = parseFloat(eoq);
    return `La cantidad de pedidos que la empresa deberá realizar es de ${eoqValue.toFixed(0)} unidades para que el inventario no se agote durante el tiempo de entrega.`;
}

// Manejo del evento submit del formulario
document.getElementById("crud-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const demand = parseFloat(document.getElementById("demand").value);
    const orderCost = parseFloat(document.getElementById("order-cost").value);
    const holdingCost = parseFloat(document.getElementById("holding-cost").value);

    const eoq = calculateEOQ(demand, orderCost, holdingCost);

    if (eoq !== null) {
        addRecord(demand, orderCost, holdingCost, eoq);
    } else {
        console.error("Error: No se pudo calcular el EOQ.");
    }

    // Limpiar campos del formulario
    this.reset();
});

// Manejo del evento click en los botones editar y eliminar
document.getElementById("data-table").addEventListener("click", function (event) {
    editRecord(event);
    deleteRecord(event);
});

// Cargar registros guardados en IndexedDB al cargar la página
function loadRecords() {
    const transaction = db.transaction(["records"], "readonly");
    const objectStore = transaction.objectStore("records");
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
        const records = event.target.result;
        records.forEach(record => {
            if (record.eoq !== null) {
                displayRecord(record);
            }
        });
    };

    request.onerror = function (event) {
        console.error("Error loading records:", event.target.errorCode);
    };
}

// Función para descargar registros en PDF
document.getElementById("download-pdf").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Registro de EOQ", 14, 22);

    // Set table headers
    const headers = [["Demand", "Order Cost", "Holding Cost", "EOQ", "Analysis"]];
    const data = [];

    // Retrieve all records from IndexedDB
    const transaction = db.transaction(["records"], "readonly");
    const objectStore = transaction.objectStore("records");
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
        const records = event.target.result;
        records.forEach(record => {
            if (record.eoq !== null) {
                const row = [
                    record.demand,
                    record.orderCost,
                    record.holdingCost,
                    record.eoq.toFixed(2),
                    analyzeEOQ(record.eoq)
                ];
                data.push(row);
            }
        });

        // Add table to PDF
        doc.autoTable({
            head: headers,
            body: data,
            startY: 30,
            theme: 'grid'
        });

        // Save the PDF
        doc.save("eoq_records.pdf");
    };

    request.onerror = function (event) {
        console.error("Error loading records:", event.target.errorCode);
    };
});

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
*/

// Función para calcular EOQ
// Función para calcular EOQ
function calculateEOQ(demand, orderCost, holdingCost) {
    // Validar que los valores sean numéricos y positivos
    if (isNaN(demand) || demand <= 0 || isNaN(orderCost) || orderCost <= 0 || isNaN(holdingCost) || holdingCost <= 0) {
        mostrarAdvertencia("Error: Alguno de los valores de entrada no es válido.");
        return null; // Retorna null para indicar un error en el cálculo
    }

    // Proceder con el cálculo si las entradas son válidas
    return Math.sqrt((2 * demand * 365 * orderCost) / holdingCost);
}

// Abrir o crear la base de datos IndexedDB
let db;
const request = indexedDB.open("EOQDatabase", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("records", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("demand", "demand", { unique: false });
    objectStore.createIndex("orderCost", "orderCost", { unique: false });
    objectStore.createIndex("holdingCost", "holdingCost", { unique: false });
    objectStore.createIndex("eoq", "eoq", { unique: false });
};

request.onsuccess = function (event) {
    db = event.target.result;
    loadRecords();
};

request.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.errorCode);
};

// Función para agregar un nuevo registro
function addRecord(demand, orderCost, holdingCost, eoq) {
    const transaction = db.transaction(["records"], "readwrite");
    const objectStore = transaction.objectStore("records");
    const newRecord = { demand, orderCost, holdingCost, eoq };
    objectStore.add(newRecord);

    transaction.oncomplete = function () {
        displayRecord(newRecord);
    };

    transaction.onerror = function (event) {
        console.error("Error adding record:", event.target.errorCode);
    };
}

function displayRecord(record) {
    const tableBody = document.getElementById("data-body");
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", record.id);
    newRow.innerHTML = `
        <td class="demand">${record.demand}</td>
        <td>${record.orderCost}</td>
        <td>${record.holdingCost}</td>
        <td class="eoq">${record.eoq ? record.eoq.toFixed(2) : "N/A"}</td>
        <td>${record.eoq ? analyzeEOQ(record.eoq) : "N/A"}</td>
        <td>
            <button class="edit">Editar</button>
            <button class="delete">Eliminar</button>
        </td>
    `;
    tableBody.appendChild(newRow);
}

// Función para eliminar un registro
function deleteRecord(event) {
    if (event.target.classList.contains("delete")) {
        const row = event.target.closest("tr");
        const id = Number(row.getAttribute("data-id"));

        const transaction = db.transaction(["records"], "readwrite");
        const objectStore = transaction.objectStore("records");
        objectStore.delete(id);

        transaction.oncomplete = function () {
            row.remove();
        };

        transaction.onerror = function (event) {
            console.error("Error deleting record:", event.target.errorCode);
        };
    }
}

// Función para editar un registro
function editRecord(event) {
    if (event.target.classList.contains("edit")) {
        const row = event.target.closest("tr");
        const cells = row.querySelectorAll("td");
        const id = Number(row.getAttribute("data-id"));

        const demand = parseFloat(cells[0].innerText);
        const orderCost = parseFloat(cells[1].innerText);
        const holdingCost = parseFloat(cells[2].innerText);

        document.getElementById("demand").value = demand;
        document.getElementById("order-cost").value = orderCost;
        document.getElementById("holding-cost").value = holdingCost;

        row.remove();

        // Eliminar el registro anterior
        const transaction = db.transaction(["records"], "readwrite");
        const objectStore = transaction.objectStore("records");
        objectStore.delete(id);

        transaction.oncomplete = function () {
            console.log("Record deleted for editing");
        };

        transaction.onerror = function (event) {
            console.error("Error deleting record for editing:", event.target.errorCode);
        };
    }
}

// Función para analizar el resultado EOQ
function analyzeEOQ(eoq) {
    const eoqValue = parseFloat(eoq);
    return `La cantidad de pedidos que la empresa deberá realizar es de ${eoqValue.toFixed(0)} unidades para que el inventario no se agote durante el tiempo de entrega.`;
}

// Manejo del evento submit del formulario
document.getElementById("crud-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const demand = parseFloat(document.getElementById("demand").value);
    const orderCost = parseFloat(document.getElementById("order-cost").value);
    const holdingCost = parseFloat(document.getElementById("holding-cost").value);

    const eoq = calculateEOQ(demand, orderCost, holdingCost);

    if (eoq !== null) {
        addRecord(demand, orderCost, holdingCost, eoq);
    } else {
        console.error("Error: No se pudo calcular el EOQ.");
    }

    // Limpiar campos del formulario
    this.reset();
});

// Manejo del evento click en los botones editar y eliminar
document.getElementById("data-table").addEventListener("click", function (event) {
    editRecord(event);
    deleteRecord(event);
});

// Cargar registros guardados en IndexedDB al cargar la página
function loadRecords() {
    const transaction = db.transaction(["records"], "readonly");
    const objectStore = transaction.objectStore("records");
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
        const records = event.target.result;
        records.forEach(record => {
            if (record.eoq !== null) {
                displayRecord(record);
            }
        });
    };

    request.onerror = function (event) {
        console.error("Error loading records:", event.target.errorCode);
    };
}

// Función para descargar registros en PDF
document.getElementById("download-pdf").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Registro de EOQ", 14, 22);

    // Set table headers
    const headers = [["Demand", "Order Cost", "Holding Cost", "EOQ", "Analysis"]];
    const data = [];

    // Retrieve all records from IndexedDB
    const transaction = db.transaction(["records"], "readonly");
    const objectStore = transaction.objectStore("records");
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
        const records = event.target.result;
        records.forEach(record => {
            if (record.eoq !== null) {
                const row = [
                    record.demand,
                    record.orderCost,
                    record.holdingCost,
                    record.eoq.toFixed(2),
                    analyzeEOQ(record.eoq)
                ];
                data.push(row);
            }
        });

        // Add table to PDF
        doc.autoTable({
            head: headers,
            body: data,
            startY: 30,
            theme: 'grid'
        });

        // Save the PDF
        doc.save("eoq_records.pdf");
    };

    request.onerror = function (event) {
        console.error("Error loading records:", event.target.errorCode);
    };
});

// Validacion de los Input
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
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
}

// Agregar validación en los inputs de demanda, costo de pedido y costo de mantenimiento
document.getElementById("demand").addEventListener("keypress", soloNumeros);
document.getElementById("order-cost").addEventListener("keypress", soloNumeros);
document.getElementById("holding-cost").addEventListener("keypress", soloNumeros);

