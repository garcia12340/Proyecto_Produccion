/*
document.getElementById('numWeeks').addEventListener('input', function () {
    const numWeeks = parseInt(this.value);
    const weeklyDemandsDiv = document.getElementById('weeklyDemands');
    weeklyDemandsDiv.innerHTML = '';
    for (let i = 1; i <= numWeeks; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'week' + i;
        input.required = true;
        const label = document.createElement('label');
        label.htmlFor = 'week' + i;
        label.textContent = 'Semana ' + i + ':';
        weeklyDemandsDiv.appendChild(label);
        weeklyDemandsDiv.appendChild(input);
        weeklyDemandsDiv.appendChild(document.createElement('br'));
    }
});

document.getElementById('lucForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const numWeeks = parseInt(document.getElementById('numWeeks').value);
    const costHold = parseFloat(document.getElementById('costHold').value);
    const costOrder = parseFloat(document.getElementById('costOrder').value);
    const demands = [];
    for (let i = 1; i <= numWeeks; i++) {
        demands.push(parseInt(document.getElementById('week' + i).value));
    }

    const results = calculateLUC(demands, costHold, costOrder);
    displayResults(results);
});

function calculateLUC(demands, costHold, costOrder) {
    let periods = [];
    let cumulativeUnits = 0;
    let cumulativePeriod = 0;
    let previousTotalCost = costHold;
    for (let i = 0; i < demands.length; i++) {
        cumulativeUnits += demands[i];
        cumulativePeriod += i + 1;
        let K = (i > 0) ? cumulativePeriod * i * costOrder : 0;
        let totalCost = (i === 0) ? costHold : previousTotalCost + K;
        previousTotalCost = totalCost;
        periods.push({
            period: cumulativePeriod,
            units: cumulativeUnits,
            costHold: costHold,
            K: K,
            totalCost: parseFloat(totalCost.toFixed(4)),
            costPerUnit: parseFloat((totalCost / cumulativeUnits).toFixed(4))
        });
    }
    return periods;
}

function displayResults(results) {
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    const headers = ["Periodo", "Unidades", "S", "K", "Costo Total", "Costo Unitario $ Total/Unidades"];
    headers.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    // Determine the two highest total cost values
    const totalCosts = results.map(r => r.totalCost);
    const highestTotalCosts = totalCosts.sort((a, b) => b - a).slice(0, 2);

    results.forEach(result => {
        const row = table.insertRow();
        row.className = highestTotalCosts.includes(result.totalCost) ? 'highlight' : '';
        Object.values(result).forEach(text => {
            const cell = row.insertCell();
            cell.textContent = text;
        });
    });
    const resultsDiv = document.getElementById('resultsTable');
    resultsDiv.innerHTML = '';
    resultsDiv.appendChild(table);
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
*/
document.getElementById('numWeeks').addEventListener('input', function () {
    const numWeeks = parseInt(this.value);
    const weeklyDemandsDiv = document.getElementById('weeklyDemands');
    weeklyDemandsDiv.innerHTML = '';
    for (let i = 1; i <= numWeeks; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'week' + i;
        input.required = true;
        input.oninput = soloNumeros;
        const label = document.createElement('label');
        label.htmlFor = 'week' + i;
        label.textContent = 'Semana ' + i + ':';
        weeklyDemandsDiv.appendChild(label);
        weeklyDemandsDiv.appendChild(input);
        weeklyDemandsDiv.appendChild(document.createElement('br'));
    }
});

document.getElementById('lucForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const numWeeks = parseInt(document.getElementById('numWeeks').value);
    const costHold = parseFloat(document.getElementById('costHold').value);
    const costOrder = parseFloat(document.getElementById('costOrder').value);
    const demands = [];
    for (let i = 1; i <= numWeeks; i++) {
        demands.push(parseInt(document.getElementById('week' + i).value));
    }

    const results = calculateLUC(demands, costHold, costOrder);
    displayResults(results);
    mostrarExito();
});

function calculateLUC(demands, costHold, costOrder) {
    let periods = [];
    let cumulativeUnits = 0;
    let cumulativePeriod = 0;
    let previousTotalCost = costHold;
    for (let i = 0; i < demands.length; i++) {
        cumulativeUnits += demands[i];
        cumulativePeriod += i + 1;
        let K = (i > 0) ? cumulativePeriod * i * costOrder : 0;
        let totalCost = (i === 0) ? costHold : previousTotalCost + K;
        previousTotalCost = totalCost;
        periods.push({
            period: cumulativePeriod,
            units: cumulativeUnits,
            costHold: costHold,
            K: K,
            totalCost: parseFloat(totalCost.toFixed(4)),
            costPerUnit: parseFloat((totalCost / cumulativeUnits).toFixed(4))
        });
    }
    return periods;
}

function displayResults(results) {
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    const headers = ["Periodo", "Unidades", "S", "K", "Costo Total", "Costo Unitario $ Total/Unidades"];
    headers.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    const totalCosts = results.map(r => r.totalCost);
    const highestTotalCosts = totalCosts.sort((a, b) => b - a).slice(0, 2);

    results.forEach(result => {
        const row = table.insertRow();
        row.className = highestTotalCosts.includes(result.totalCost) ? 'highlight' : '';
        Object.values(result).forEach(text => {
            const cell = row.insertCell();
            cell.textContent = text;
        });
    });
    const resultsDiv = document.getElementById('resultsTable');
    resultsDiv.innerHTML = '';
    resultsDiv.appendChild(table);
}

function soloNumeros(event) {
    const input = event.target;
    const value = input.value;
    const validPattern = /^(\d*\.?\d*)$/;

    if (!validPattern.test(value) || parseFloat(value) < 0) {
        mostrarAdvertencia('Por favor, ingrese solo números positivos.');
        input.value = value.slice(0, -1);
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

