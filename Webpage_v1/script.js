document.addEventListener('DOMContentLoaded', function() {
    const inputFile = document.getElementById('inputFile');
    const outputButton = document.getElementById('outputButton');
    const resultsDisplay = document.getElementById('resultsDisplay');

    inputFile.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            processCSVandPredict(content);
        };
        reader.readAsText(file);
    });

    outputButton.addEventListener('click', function() {
        const content = resultsDisplay.innerText;
        if (content) downloadCSV(content);
    });
});

function processCSVandPredict(csvText) {
    const jsonData = convertCSVtoJSON(csvText);

    fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data);
    })
    .catch(error => console.error('Error:', error));
}

function convertCSVtoJSON(csv) {
    const lines = csv.split("\n");
    const result = [];
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(",");

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }

    return result;
}

function displayResults(data) {
    if (!data || !Array.isArray(data)) {
        console.error("Invalid data format for displayResults:", data);
        resultsDisplay.innerText = "Error: Invalid data format";
        return;
    }

    const headers = Object.keys(data[0]);
    let table = `<table><thead><tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr></thead><tbody>`;
    
    data.forEach(row => {
        table += `<tr>${headers.map(header => `<td>${row[header]}</td>`).join('')}</tr>`;
    });

    table += '</tbody></table>';
    resultsDisplay.innerHTML = table;
}

function downloadCSV(data) {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'processed_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
