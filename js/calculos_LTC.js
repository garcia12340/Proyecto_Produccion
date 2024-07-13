
function agregarCampos() {
    const numSemanas = document.getElementById('numSemanas').value;
    const semanasInputs = document.getElementById('semanasInputs');
    semanasInputs.innerHTML = ''; // Limpiar campos previos

    for (let i = 1; i <= numSemanas; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'semana' + i;
        input.placeholder = 'Requerimiento Semana ' + i;
        input.addEventListener('input', soloNumeros); // Agregar validación de solo números
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
        if (isNaN(requerimiento) || requerimiento < 0) {
            mostrarAdvertencia('Por favor, ingrese un número positivo para la semana ' + i);
            return;
        }

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
            mostrarExito(); // Mostrar notificación de éxito
        } else {
            periodosMantenidos++; // Incrementar después de calcular el costo
            periodoActual++; // Incrementar periodo para la siguiente iteración
        }
    }
}

// Validacion de los Input
function soloNumeros(event) {
    const input = event.target;
    const value = input.value;

    // Expresión regular para permitir solo números positivos y un punto decimal
    const validPattern = /^(\d*\.?\d*)$/;

    if (!validPattern.test(value) || parseFloat(value) < 0) {
        mostrarAdvertencia('Por favor, ingrese solo números positivos.');
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