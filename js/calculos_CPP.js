document.getElementById('formularioCPP').addEventListener('submit', calcularCPP);

let db;
let editingIndex = null;

let request = indexedDB.open("CRMDatabase", 1);

request.onerror = function(event) {
    console.log("Error al abrir la base de datos", event);
};

request.onsuccess = function(event) {
    db = event.target.result;
    mostrarRegistros();
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    let objectStore = db.createObjectStore("registros", { autoIncrement: true });
    objectStore.createIndex("demanda", "demanda", { unique: false });
    objectStore.createIndex("ciclo", "ciclo", { unique: false });
    objectStore.createIndex("seguridad", "seguridad", { unique: false });
    objectStore.createIndex("nivelInventarioPromedio", "nivelInventarioPromedio", { unique: false });
    objectStore.createIndex("rotacionInventario", "rotacionInventario", { unique: false });
    objectStore.createIndex("numeros_Semanas", "numeros_Semanas", { unique: false });
    objectStore.createIndex("analisis", "analisis", { unique: false });
};

function calcularCPP(event) {
    event.preventDefault();
    let demanda = parseInt(document.getElementById('demanda').value);
    let ciclo = parseInt(document.getElementById('ciclo').value);
    let seguridad = parseInt(document.getElementById('seguridad').value);
    let semanas_Trabajar = parseInt(document.getElementById('n_semanas').value);

    let nivelInventarioPromedio = (demanda * ciclo / 2) + seguridad;
    let rotacionInventario = (demanda * semanas_Trabajar) / nivelInventarioPromedio;
    rotacionInventario = rotacionInventario < 1 ? 1 : rotacionInventario;

    let analisis = `
    <p>Nivel de Inventario Promedio: ${nivelInventarioPromedio.toFixed(0)}</p>
    <p>Rotación de Inventario: ${rotacionInventario.toFixed(0)}</p>
    `;

    let registro = {
        demanda,
        ciclo,
        seguridad,
        nivelInventarioPromedio,
        rotacionInventario,
        semanas_Trabajar,
        analisis
    };

    if (editingIndex === null) {
        agregarRegistro(registro);
    } else {
        actualizarRegistro(editingIndex, registro);
        editingIndex = null;
    }

    document.getElementById('formularioCPP').reset();
    mostrarResultado(nivelInventarioPromedio, rotacionInventario);
}

function agregarRegistro(registro) {
    let transaction = db.transaction(["registros"], "readwrite");
    let objectStore = transaction.objectStore("registros");
    let request = objectStore.add(registro);

    request.onsuccess = function(event) {
        console.log("Registro añadido: ", event.target.result);
        mostrarRegistros();
    };

    request.onerror = function(event) {
        console.log("Error al añadir el registro", event);
    };
}

function actualizarRegistro(index, registroActualizado) {
    let transaction = db.transaction(["registros"], "readwrite");
    let objectStore = transaction.objectStore("registros");
    let request = objectStore.put({ ...registroActualizado, id: index });

    request.onsuccess = function(event) {
        console.log("Registro actualizado: ", event.target.result);
        mostrarRegistros();
    };

    request.onerror = function(event) {
        console.log("Error al actualizar el registro", event);
    };
}

function mostrarRegistros() {
    let transaction = db.transaction(["registros"], "readonly");
    let objectStore = transaction.objectStore("registros");
    let registros = document.getElementById('registros');
    registros.innerHTML = '';

    objectStore.openCursor().onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor) {
            let registro = cursor.value;
            let tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${registro.demanda}</td>
                <td>${registro.ciclo}</td>
                <td>${registro.seguridad}</td>
                <td>${registro.nivelInventarioPromedio.toFixed(0)}</td>
                <td>${registro.rotacionInventario.toFixed(0)}</td>
                <td>${registro.semanas_Trabajar.toFixed(0)}</td>
                <td>${registro.analisis}</td>
                <td>
                    <button class="edit" onclick="editarRegistro(${cursor.primaryKey})">Editar</button>
                    <button class="delete" onclick="eliminarRegistro(${cursor.primaryKey})">Eliminar</button>
                </td>
            `;

            registros.appendChild(tr);
            cursor.continue();
        }
    };
}

function editarRegistro(index) {
    let transaction = db.transaction(["registros"], "readonly");
    let objectStore = transaction.objectStore("registros");
    let request = objectStore.get(index);

    request.onsuccess = function(event) {
        let registro = event.target.result;
        document.getElementById('demanda').value = registro.demanda;
        document.getElementById('ciclo').value = registro.ciclo;
        document.getElementById('seguridad').value = registro.seguridad;
        document.getElementById('n_semanas').value = registro.semanas_Trabajar;

        editingIndex = index;
    };

    request.onerror = function(event) {
        console.log("Error al obtener el registro", event);
    };
}

function eliminarRegistro(index) {
    let transaction = db.transaction(["registros"], "readwrite");
    let objectStore = transaction.objectStore("registros");
    let request = objectStore.delete(index);

    request.onsuccess = function(event) {
        console.log("Registro eliminado: ", event.target.result);
        mostrarRegistros();
    };

    request.onerror = function(event) {
        console.log("Error al eliminar el registro", event);
    };
}

function mostrarResultado(nivelInventarioPromedio, rotacionInventario) {
    let resultadoHTML = `
        <p>Nivel de Inventario Promedio: ${nivelInventarioPromedio.toFixed(0)}</p>
        <p>Rotación de Inventario: ${rotacionInventario.toFixed(0)}</p>
    `;
    document.getElementById('resultado').innerHTML = resultadoHTML;
}
