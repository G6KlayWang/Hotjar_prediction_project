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
            const data = processCSVandPredict(content);
            displayResults(data);
        };
        reader.readAsText(file);
    });

    outputButton.addEventListener('click', function() {
        const content = resultsDisplay.innerText;
        if (content) downloadCSV(content);
    });
});

function processCSV(csvText) {
    // Simulating data processing; you might use a library like PapaParse here
    const lines = csvText.split('\n');
    const processedData = lines.map((line, index) => `${index}, ${line}`);
    return processedData.join('\n');
}

function processCSVandPredict(csvText) {
    // Assuming CSV is converted to JSON format suitable for your model
    const jsonData = convertCSVtoJSON(csvText); // You need to implement this conversion based on your data structure
    
    fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => {
        displayResults(data);  // Displaying predictions
    })
    .catch(error => console.error('Error:', error));
}

// You'll need to implement this based on your CSV structure
function convertCSVtoJSON(csv) {
    var lines=csv.split("\n");
    var result = [];
    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }

    return result; // JSON object
}


function displayResults(data) {
    // Displaying data as text for simplicity
    resultsDisplay.innerText = data;
    // Assume data is an array of predictions
    let formattedResults = "Predictions:\n" + data.join("\n");
    resultsDisplay.innerText = formattedResults;
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
