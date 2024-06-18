document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let formData = new FormData();
    formData.append('fileInput', document.getElementById('fileInput').files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            fetchResults(data.file_path);
        } else {
            alert('Failed to process the file.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function fetchResults(filePath) {
    fetch(filePath)
    .then(response => response.text())
    .then(csvData => {
        const resultsDiv = document.getElementById('results');
        const parsedData = parseCSV(csvData);
        displayResults(parsedData);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function parseCSV(data) {
    const rows = data.split('\n').map(row => row.split(','));
    return rows;
}

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    let html = '<table border="1">';
    data.forEach((row, index) => {
        html += '<tr>';
        row.forEach(cell => {
            html += index === 0 ? `<th>${cell}</th>` : `<td>${cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';
    resultsDiv.innerHTML = html;
}

