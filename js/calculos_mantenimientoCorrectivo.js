document.addEventListener('DOMContentLoaded', function () {
  let db;
  const formulario = document.getElementById('formulario');
  const crmTableBody = document.querySelector('#crmTable tbody');

  // Abre la base de datos
  let request = indexedDB.open('mantenimientoCorrectivo', 1);

  request.onerror = function (event) {
    console.log('Error al abrir la base de datos:', event);
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    mostrarRegistros();
  };

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    let objectStore = db.createObjectStore('registros', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('horas', 'horas', { unique: false });
    objectStore.createIndex('mtbf', 'mtbf', { unique: false });
    objectStore.createIndex('valorMtbf', 'valorMtbf', { unique: false });
    objectStore.createIndex('duracion', 'duracion', { unique: false });
    objectStore.createIndex('costoHora', 'costoHora', { unique: false });
    objectStore.createIndex('repuestos', 'repuestos', { unique: false });
    objectStore.createIndex('costosOperacionales', 'costosOperacionales', { unique: false });
    objectStore.createIndex('retrasoLogistico', 'retrasoLogistico', { unique: false });
    objectStore.createIndex('costoUnitario', 'costoUnitario', { unique: false });
    objectStore.createIndex('costosFallas', 'costosFallas', { unique: false });
    objectStore.createIndex('cmc', 'cmc', { unique: false });
    objectStore.createIndex('analisis', 'analisis', { unique: false });
  };

  formulario.addEventListener('submit', agregarRegistro);

  function agregarRegistro(event) {
    event.preventDefault();

    const horas = parseFloat(document.getElementById('horas').value);
    const mtbf = document.getElementById('mtbf').value;
    const valorMtbf = parseFloat(document.getElementById('valorMtbf').value);
    const duracion = parseFloat(document.getElementById('duracion').value);
    const costoHora = parseFloat(document.getElementById('costoHora').value);
    const repuestos = parseFloat(document.getElementById('repuestos').value);
    const costosOperacionales = parseFloat(document.getElementById('costosOperacionales').value);
    const retrasoLogistico = parseFloat(document.getElementById('retrasoLogistico').value);
    const costoUnitario = parseFloat(document.getElementById('costoUnitario').value);
    const costosFallas = parseFloat(document.getElementById('costosFallas').value);

    // Calcular MTBF
    let MTBF;
    if (mtbf === 'hours') {
      MTBF = valorMtbf;
    } else if (mtbf === 'percentage') {
      MTBF = horas * (valorMtbf / 100);
    } else {
      console.error('Tipo de MTBF no válido');
      return;
    }

    // Calcular el número de fallas esperadas durante el tiempo de mantenimiento
    const numeroFallas = horas / MTBF;

    // Calcular el costo correctivo (CMC)
    const cmc = numeroFallas.toFixed(0) * ((duracion * costoHora + repuestos + costosOperacionales + retrasoLogistico) + (duracion * costoUnitario + costosFallas));

    // Realizar el análisis en texto
    const analisis = `Basado en los datos ingresados, se estima que habrá aproximadamente ${numeroFallas.toFixed(0)} fallas durante el tiempo de mantenimiento. Estas fallas tienen un costo total estimado de $${cmc.toFixed(0)}.`;

    const nuevoRegistro = {
      horas,
      mtbf,
      valorMtbf,
      duracion,
      costoHora,
      repuestos,
      costosOperacionales,
      retrasoLogistico,
      costoUnitario,
      costosFallas,
      cmc,
      analisis
    };

    let transaction = db.transaction(['registros'], 'readwrite');
    let objectStore = transaction.objectStore('registros');
    let request = objectStore.add(nuevoRegistro);

    request.onsuccess = function () {
      formulario.reset();
      mostrarRegistros();
    };

    request.onerror = function (event) {
      console.error('Error al agregar el registro:', event.target.error);
    };
  }

  function mostrarRegistros() {
    crmTableBody.innerHTML = '';

    let transaction = db.transaction(['registros'], 'readonly');
    let objectStore = transaction.objectStore('registros');

    objectStore.openCursor().onsuccess = function (event) {
      let cursor = event.target.result;
      if (cursor) {
        const { id, horas, mtbf, valorMtbf, duracion, costoHora, repuestos, costosOperacionales, retrasoLogistico, costoUnitario, costosFallas, cmc, analisis } = cursor.value;
        crmTableBody.innerHTML += `
                  <tr>
                      <td>${horas}</td>
                      <td>${mtbf}</td>
                      <td>${valorMtbf}</td>
                      <td>${duracion}</td>
                      <td>${costoHora}</td>
                      <td>${repuestos}</td>
                      <td>${costosOperacionales}</td>
                      <td>${retrasoLogistico}</td>
                      <td>${costoUnitario}</td>
                      <td>${costosFallas}</td>
                      <td>${cmc.toFixed(2)}</td>
                      <td>${analisis}</td>
                      <td>
                        <button class="edit" onclick="editarRegistro(${id})">Editar</button>
                        <button class="delete" onclick="eliminarRegistro(${id})">Eliminar</button>
                      </td>
                  </tr>
              `;
        cursor.continue();
      }
    };
  }

  window.eliminarRegistro = function (id) {
    let transaction = db.transaction(['registros'], 'readwrite');
    let objectStore = transaction.objectStore('registros');
    objectStore.delete(id);

    transaction.oncomplete = function () {
      mostrarRegistros();
    };
  };

  window.editarRegistro = function (id) {
    let transaction = db.transaction(['registros'], 'readonly');
    let objectStore = transaction.objectStore('registros');
    let request = objectStore.get(id);

    request.onsuccess = function (event) {
      let registro = event.target.result;
      document.getElementById('horas').value = registro.horas;
      document.getElementById('mtbf').value = registro.mtbf;
      document.getElementById('valorMtbf').value = registro.valorMtbf;
      document.getElementById('duracion').value = registro.duracion;
      document.getElementById('costoHora').value = registro.costoHora;
      document.getElementById('repuestos').value = registro.repuestos;
      document.getElementById('costosOperacionales').value = registro.costosOperacionales;
      document.getElementById('retrasoLogistico').value = registro.retrasoLogistico;
      document.getElementById('costoUnitario').value = registro.costoUnitario;
      document.getElementById('costosFallas').value = registro.costosFallas;

      formulario.removeEventListener('submit', agregarRegistro);
      formulario.addEventListener('submit', function actualizarRegistro(event) {
        event.preventDefault();

        registro.horas = parseFloat(document.getElementById('horas').value);
        registro.mtbf = document.getElementById('mtbf').value;
        registro.valorMtbf = parseFloat(document.getElementById('valorMtbf').value);
        registro.duracion = parseFloat(document.getElementById('duracion').value);
        registro.costoHora = parseFloat(document.getElementById('costoHora').value);
        registro.repuestos = parseFloat(document.getElementById('repuestos').value);
        registro.costosOperacionales = parseFloat(document.getElementById('costosOperacionales').value);
        registro.retrasoLogistico = parseFloat(document.getElementById('retrasoLogistico').value);
        registro.costoUnitario = parseFloat(document.getElementById('costoUnitario').value);
        registro.costosFallas = parseFloat(document.getElementById('costosFallas').value);

        // Recalcular CMC y Análisis
        const numeroFallas = registro.horas / (registro.mtbf === 'hours' ? registro.valorMtbf : registro.horas * (registro.valorMtbf / 100));
        registro.cmc = numeroFallas.toFixed(0) * ((registro.duracion * registro.costoHora + registro.repuestos + registro.costosOperacionales + registro.retrasoLogistico) + (registro.duracion * registro.costoUnitario + registro.costosFallas));
        registro.analisis = `Basado en los datos ingresados, se estima que habrá aproximadamente ${numeroFallas.toFixed(0)} fallas durante el tiempo de mantenimiento. Estas fallas tienen un costo total estimado de $${registro.cmc.toFixed(0)}.`;

        let updateTransaction = db.transaction(['registros'], 'readwrite');
        let updateObjectStore = updateTransaction.objectStore('registros');
        updateObjectStore.put(registro);

        updateTransaction.oncomplete = function () {
          formulario.reset();
          mostrarRegistros();
          formulario.removeEventListener('submit', actualizarRegistro);
          formulario.addEventListener('submit', agregarRegistro);
        };
      });
    };
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