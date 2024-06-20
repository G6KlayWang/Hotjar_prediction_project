document.addEventListener('DOMContentLoaded', function() {
    const inputFile = document.getElementById('inputFile');
    const outputButton = document.getElementById('outputButton');
    const redirectButton = document.getElementById('redirectButton');
    const resultsDisplay = document.getElementById('resultsDisplay');

    let processedData = [];

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
        if (processedData.length > 0) {
            downloadCSV(processedData);
        }
    });

    redirectButton.addEventListener('click', function() {
        window.location.href = 'https://insights.hotjar.com/sites/2751917/playbacks?sort_by=-relevance_score';
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
            processedData = data; // Store the processed data
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
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(',')).join('\n');
        const csvContent = `${headers}\n${rows}`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'processed_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
