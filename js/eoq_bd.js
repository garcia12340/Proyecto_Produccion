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
        const existingRows = tableBody.querySelectorAll("tr");
        for (const row of existingRows) {
            const existingDemand = parseFloat(row.querySelector(".demand").innerText);
            if (existingDemand === demand) {
                console.warn("Registro duplicado detectado. No se agregará el registro.");
                return; // No agregar el registro si ya existe
            }
        }
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
        const demand = parseFloat(row.querySelector(".demand").innerText);

        // Eliminar de IndexedDB
        deleteFromIndexedDB(demand);

        row.remove();
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

        // Eliminar de IndexedDB antes de editar
        deleteFromIndexedDB(demand);

        row.remove();
    }
}

// Función para analizar el resultado EOQ
function analyzeEOQ(eoq) {
    const eoqValue = parseFloat(eoq);
    return `La cantidad de pedidos que la empresa deberá realizar es de ${eoqValue.toFixed(0)} unidades para que el inventario no se agote durante el tiempo de entrega.`;
}

// IndexedDB
let db;
const request = indexedDB.open("EOQDatabase", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("records", { keyPath: "demand" });
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadRecords();
};

request.onerror = function(event) {
    console.error("Error opening IndexedDB:", event.target.errorCode);
};

function saveToIndexedDB(record) {
    const transaction = db.transaction(["records"], "readwrite");
    const objectStore = transaction.objectStore("records");
    
    const getRequest = objectStore.get(record.demand);
    getRequest.onsuccess = function(event) {
        if (event.target.result) {
            console.warn("Registro duplicado detectado en IndexedDB. No se agregará el registro.");
        } else {
            const addRequest = objectStore.add(record);
            addRequest.onsuccess = function(event) {
                console.log("Record added to IndexedDB:", record);
            };
            addRequest.onerror = function(event) {
                console.error("Error adding record to IndexedDB:", event.target.errorCode);
            };
        }
    };
    getRequest.onerror = function(event) {
        console.error("Error retrieving record from IndexedDB:", event.target.errorCode);
    };
}

function deleteFromIndexedDB(demand) {
    const transaction = db.transaction(["records"], "readwrite");
    const objectStore = transaction.objectStore("records");
    const request = objectStore.delete(demand);

    request.onsuccess = function(event) {
        console.log("Record deleted from IndexedDB:", demand);
    };

    request.onerror = function(event) {
        console.error("Error deleting record from IndexedDB:", event.target.errorCode);
    };
}

function loadRecords() {
    const transaction = db.transaction(["records"], "readonly");
    const objectStore = transaction.objectStore("records");
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        const records = event.target.result;
        records.forEach(record => {
            const eoqCalculated = calculateEOQ(record.demand, record.orderCost, record.holdingCost);
            addRecord(record.demand, record.orderCost, record.holdingCost, eoqCalculated);
        });
    };

    request.onerror = function(event) {
        console.error("Error loading records from IndexedDB:", event.target.errorCode);
    };
}

// Manejo del evento submit del formulario
document.getElementById("crud-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const demand = parseFloat(document.getElementById("demand").value);
    const orderCost = parseFloat(document.getElementById("order-cost").value);
    const holdingCost = parseFloat(document.getElementById("holding-cost").value);

    const eoq = calculateEOQ(demand, orderCost, holdingCost);

    addRecord(demand, orderCost, holdingCost, eoq);

    // Guardar en IndexedDB
    saveToIndexedDB({ demand, orderCost, holdingCost, eoq });

    // Limpiar campos del formulario
    this.reset();
});

// Manejo del evento click en los botones editar y eliminar
document.getElementById("data-table").addEventListener("click", function(event) {
    editRecord(event);
    deleteRecord(event);
});

// Cargar registros guardados en IndexedDB al cargar la página
window.addEventListener("DOMContentLoaded", function() {
    // Cargar registros desde IndexedDB
    loadRecords();
});


