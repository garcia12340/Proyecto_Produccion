let treeData = [];
let relationships = [];

function addNode() {
    const nodeName = document.getElementById("nodeName").value.trim();
    const parentNode = document.getElementById("parentNode").value.trim();
    const relation = parseFloat(document.getElementById("relation").value.trim());

    if (!nodeName) {
        alert("Por favor, ingrese un nombre para el nodo.");
        return;
    }

    if (isNaN(relation)) {
        alert("Por favor, ingrese un número válido para la relación.");
        return;
    }

    const newNode = { name: nodeName, children: [], relation: relation };

    if (parentNode) {
        let found = false;
        function searchNode(data) {
            data.forEach(node => {
                if (node.name === parentNode) {
                    node.children.push(newNode);
                    relationships.push({ source: parentNode, target: nodeName, relation: relation });
                    found = true;
                    return;
                }
                if (node.children.length) searchNode(node.children);
            });
        }
        searchNode(treeData);
        if (!found) {
            alert("Nodo padre no encontrado.");
            return;
        }
    } else {
        treeData.push(newNode);
    }

    document.getElementById("nodeName").value = "";
    document.getElementById("parentNode").value = "";
    document.getElementById("relation").value = "";
    alert("Nodo añadido correctamente.");
}

function generateTreeDiagram() {
    if (treeData.length === 0) {
        alert("No hay nodos para generar el diagrama.");
        return;
    }

    // Limpiar el diagrama existente
    d3.select("#treeDiagram").html("");

    // Obtener las dimensiones del contenedor
    const container = document.querySelector(".contenedorMrp");
    const width = container.clientWidth;
    const height = container.clientHeight;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const svg = d3.select("#treeDiagram").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const root = d3.hierarchy(treeData[0]);
    const treeLayout = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
    treeLayout(root);

    const links = svg.selectAll(".link")
        .data(root.links())
        .enter().append("g")
        .attr("class", "link");

    links.append("path")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    links.append("text")
        .attr("x", d => (d.source.y + d.target.y) / 2)
        .attr("y", d => (d.source.x + d.target.x) / 2)
        .attr("dy", "0.35em")
        .text(d => {
            const rel = relationships.find(r => r.source === d.source.data.name && r.target === d.target.data.name);
            return rel ? rel.relation : '';
        });

    const node = svg.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("rect")
        .attr("width", 100)
        .attr("height", 30)
        .attr("x", -50)
        .attr("y", -15)
        .attr("fill", "#fff")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3);

    node.append("text")
        .attr("dy", "0.35em")
        .attr("x", 0)
        .attr("y", 0)
        .style("text-anchor", "middle")
        .text(d => d.data.name);
}

function calculateMRP() {
    if (treeData.length === 0) {
        alert("No hay datos para calcular el MRP.");
        return;
    }

    const mrpResults = [];

    function traverse(node, parentRelation = 1) {
        const nodeRelation = node.data.relation * parentRelation;
        mrpResults.push({ name: node.data.name, requiredQuantity: nodeRelation });
        if (node.children.length) {
            node.children.forEach(child => traverse(child, nodeRelation));
        }
    }

    treeData.forEach(rootNode => {
        const rootHierarchy = d3.hierarchy(rootNode);
        traverse(rootHierarchy);
    });

    console.log("Resultados de MRP:", mrpResults);
    displayMRPResults(mrpResults);
}

function displayMRPResults(results) {
    const resultDiv = document.getElementById('mrpResults');
    resultDiv.innerHTML = '<h2>Resultados del MRP</h2>';
    const ul = document.createElement('ul');
    results.forEach(result => {
        const li = document.createElement('li');
        li.textContent = `Nodo: ${result.name}, Cantidad Requerida: ${result.requiredQuantity}`;
        ul.appendChild(li);
    });
    resultDiv.appendChild(ul);
}

function downloadPDF() {
    const diagram = document.getElementById('treeDiagram');

    html2canvas(diagram, { scale: 2 }).then(canvas => {
        const pdf = new jspdf.jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('diagrama.pdf');
    }).catch(err => {
        console.error('Error al capturar el diagrama:', err);
    });
}
