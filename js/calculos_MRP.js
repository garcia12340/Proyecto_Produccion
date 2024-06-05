let treeData = [];
let relationships = [];

function addNode() {
    const nodeName = document.getElementById("nodeName").value.trim();
    const parentNode = document.getElementById("parentNode").value.trim();
    const relation = document.getElementById("relation").value.trim();

    if (!nodeName) {
        alert("Por favor, ingrese un nombre para el nodo.");
        return;
    }

    const newNode = { name: nodeName, children: [] };

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

    d3.select("#treeDiagram").html(""); // Limpiar el diagrama existente

    var margin = { top: 20, right: 120, bottom: 30, left: 120 },
        width = 1200 - margin.right - margin.left,
        height = 600 - margin.top - margin.bottom;

    var svg = d3.select("#treeDiagram").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var root = d3.hierarchy(treeData[0]);
    var treeLayout = d3.tree().size([height, width]);
    treeLayout(root);

    var links = svg.selectAll(".link")
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

    var node = svg.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("rect")
        .attr("width", 100)
        .attr("height", 30)
        .attr("x", -50) // Mueve el rectángulo 50px hacia la izquierda para centrarlo sobre el punto de dato
        .attr("y", -15) // Mueve el rectángulo 15px hacia arriba para centrarlo sobre el punto de dato
        .attr("fill", "#fff")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3);

    node.append("text")
        .attr("dy", "0.35em") // Ajuste vertical para centrar el texto en el rectángulo
        .attr("x", 0) // Centra el texto horizontalmente
        .attr("y", 0) // Coloca el texto en el centro vertical del rectángulo
        .style("text-anchor", "middle") // Asegura que el texto esté centrado horizontalmente
        .text(d => d.data.name);
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