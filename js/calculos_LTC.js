function agregarCampos() {
    const numSemanas = document.getElementById('numSemanas').value;
    const semanasInputs = document.getElementById('semanasInputs');
    semanasInputs.innerHTML = ''; // Limpiar campos previos

    for (let i = 1; i <= numSemanas; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'semana' + i;
        input.placeholder = 'Requerimiento Semana ' + i;
        semanasInputs.appendChild(input);
    }
}

function calcularLTC() {
    const numSemanas = parseInt(document.getElementById('numSemanas').value);
    const K = parseFloat(document.getElementById('costoMantenimiento').value);
    const recepcionPlaneada = parseFloat(document.getElementById('recepcionPlaneada').value);
    const tbody = document.getElementById('resultadoLTC').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Limpiar tabla anterior

    let costoAcumulado = 0;
    let periodosMantenidos = 0;
    let periodoActual = 1; // Iniciar contador de períodos en 1

    for (let i = 1; i <= numSemanas; i++) {
        const requerimiento = parseFloat(document.getElementById('semana' + i).value);
        const costoMantenimiento = requerimiento * periodosMantenidos * K;
        costoAcumulado += costoMantenimiento;

        const row = tbody.insertRow();
        const cellPeriodo = row.insertCell(0);
        const cellUnidades = row.insertCell(1);
        const cellMantenidos = row.insertCell(2);
        const cellCosto = row.insertCell(3);
        const cellCostoAcumulado = row.insertCell(4);

        cellPeriodo.textContent = periodoActual;
        cellUnidades.textContent = requerimiento;
        cellMantenidos.textContent = periodosMantenidos;
        cellCosto.textContent = costoMantenimiento.toFixed(2);
        cellCostoAcumulado.textContent = costoAcumulado.toFixed(2);

        if (costoAcumulado >= recepcionPlaneada) {
            row.className = "highlight"; // Aplicar la clase highlight a la fila que sobrepasa la recepción planeada
            periodosMantenidos = 0; // Restablecer los periodos mantenidos
            costoAcumulado = 0; // Opcionalmente, restablecer costo acumulado
            periodoActual = 1; // Restablecer el contador de período
        } else {
            periodosMantenidos++; // Incrementar después de calcular el costo
            periodoActual++; // Incrementar periodo para la siguiente iteración
        }
    }
}

//Validacion de los Input
/*
function soloNumeros(event) {
    const key = event.key;
    const inputValue = event.target.value;
    const isNumber = (key >= '0' && key <= '9');
    const isControlKey = key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Delete' || key === 'Backspace' || key === 'Tab';
    const isDecimal = key === '.' && !inputValue.includes('.');

    if (isNumber || isControlKey || isDecimal) {
        return true;
    } else {
        mostrarAdvertencia();
        return false;
    }
}

function mostrarAdvertencia() {
    let warningPanel = document.getElementById('warningPanel');
    if (!warningPanel) {
        warningPanel = document.createElement('div');
        warningPanel.id = 'warningPanel';
        warningPanel.textContent = 'Por favor, ingrese solo números.';
        document.body.appendChild(warningPanel);
    }
    warningPanel.style.display = 'block';
    setTimeout(() => {
        warningPanel.style.display = 'none';
    }, 1000);
}
*/

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