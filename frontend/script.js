document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    fetchGridData();
    document.getElementById('dataForm').addEventListener('submit', handleFormSubmit);
});

async function fetchWeather() {
    const zipCode = '32904'; // Replace with actual zip code
    const url = `/api/grid/weather/${zipCode}`;

    console.log(`Fetching weather data from ${url}`);
    
    try {
        const response = await fetch(url);
        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        document.getElementById('weather').innerText = `Weather: ${data.weather[0].description}, Temp: ${data.main.temp}°C`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function fetchGridData() {
    const url = `/api/grid/grid`;

    console.log(`Fetching grid data from ${url}`);
    
    try {
        const response = await fetch(url);
        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayGridData(data);
    } catch (error) {
        console.error('Error fetching grid data:', error);
    }
}

// function displayGridData(data) {
//     const gridContainer = document.getElementById('gridContainer');
//     gridContainer.innerHTML = ''; // Clear existing grid
//     data.forEach(grid => {
//         const gridItem = document.createElement('div');
//         gridItem.className = 'grid-item';
//         gridItem.innerHTML = `
//             <strong>Grid ${grid.gridNumber}</strong><br>
//             Soil Type: ${grid.soilType}<br>
//             Soil Status: ${grid.soilStatus}<br>
//             Crop: ${grid.crop}<br>
//             Crop Status: ${grid.cropStatus}<br>
//             Disease: ${grid.disease}<br>
//             Notes: ${grid.notes}
//         `;
//         gridContainer.appendChild(gridItem);
//     });
// }

function displayGridData(data) {
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = ''; // Clear existing grid
    data
        .filter(grid => grid && grid.gridNumber && grid.soilType && grid.soilStatus && grid.crop && grid.cropStatus && grid.disease)
        .sort((a, b) => a.gridNumber - b.gridNumber)
        .forEach(grid => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.innerHTML = `
                <strong>Grid ${grid.gridNumber}</strong><br>
                Soil Type: ${grid.soilType}<br>
                Soil Status: ${grid.soilStatus}<br>
                Crop: ${grid.crop}<br>
                Crop Status: ${grid.cropStatus}<br>
                Disease: ${grid.disease}<br>
                Notes: ${grid.notes}<br>
                <button onclick="deleteGrid(${grid.gridNumber})">Delete</button>
            `;
            gridContainer.appendChild(gridItem);
    });
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const gridData = {
        gridNumber: document.getElementById('gridNumber').value,
        soilType: document.getElementById('soilType').value,
        soilStatus: document.getElementById('soilStatus').value,
        crop: document.getElementById('crop').value,
        cropStatus: document.getElementById('cropStatus').value,
        disease: document.getElementById('disease').value,
        notes: document.getElementById('notes').value,
    };

    try {
        const response = await fetch('/api/grid/grid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gridData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Fetch the updated grid data and display it
        fetchGridData();
    } catch (error) {
        console.error('Error submitting grid data:', error);
    }
}

async function deleteGrid(gridNumber) {
    try {
        const response = await fetch(`/api/grid/grid/${gridNumber}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Fetch the updated grid data and display it
        fetchGridData();
    } catch (error) {
        console.error('Error deleting grid data:', error);
    }
}