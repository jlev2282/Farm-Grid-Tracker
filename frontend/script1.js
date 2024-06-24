

async function fetchWeather() {
    const zipCode = 32904;  // Update with actual zip code
    const url = `/api/grid/weather/${zipCode}`;

    try {
        const response = await fetch(url);
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
    try {
        const response = await fetch('/api/grid/grid');
        const gridData = await response.json();
        const farmGrid = document.getElementById('farm-grid');
        farmGrid.innerHTML = '';

        for (let i = 0; i < 10; i++) {
            const data = gridData.find(g => g.quadrant === i) || {};
            const div = document.createElement('div');
            div.className = 'grid-item';
            div.innerHTML = `
                <form onsubmit="updateGridData(event, ${i})">
                    <label>Soil:
                        <select name="soil">
                            <option value="Loam" ${data.soil === 'Loam' ? 'selected' : ''}>Loam</option>
                            <option value="Clay" ${data.soil === 'Clay' ? 'selected' : ''}>Clay</option>
                            <option value="Sand" ${data.soil === 'Sand' ? 'selected' : ''}>Sand</option>
                        </select>
                    </label>
                    <label>Crop:
                        <select name="crop">
                            <option value="Corn" ${data.crop === 'Corn' ? 'selected' : ''}>Corn</option>
                            <option value="Wheat" ${data.crop === 'Wheat' ? 'selected' : ''}>Wheat</option>
                            <option value="Soy" ${data.crop === 'Soy' ? 'selected' : ''}>Soy</option>
                        </select>
                    </label>
                    <label>Soil State:
                        <select name="soilState">
                            <option value="Dry" ${data.soilState === 'Dry' ? 'selected' : ''}>Dry</option>
                            <option value="Moist" ${data.soilState === 'Moist' ? 'selected' : ''}>Moist</option>
                            <option value="Wet" ${data.soilState === 'Wet' ? 'selected' : ''}>Wet</option>
                        </select>
                    </label>
                    <label>Crop State:
                        <select name="cropState">
                            <option value="Healthy" ${data.cropState === 'Healthy' ? 'selected' : ''}>Healthy</option>
                            <option value="Infested" ${data.cropState === 'Infested' ? 'selected' : ''}>Infested</option>
                            <option value="Diseased" ${data.cropState === 'Diseased' ? 'selected' : ''}>Diseased</option>
                        </select>
                    </label>
                    <label>Disease:
                        <select name="disease">
                            <option value="None" ${data.disease === 'None' ? 'selected' : ''}>None</option>
                            <option value="Blight" ${data.disease === 'Blight' ? 'selected' : ''}>Blight</option>
                            <option value="Rust" ${data.disease === 'Rust' ? 'selected' : ''}>Rust</option>
                        </select>
                    </label>
                    <button type="submit">Save</button>
                </form>
            `;
            farmGrid.appendChild(div);
        }
    } catch (error) {
        console.error('Error fetching grid data:', error);
    }
}

async function updateGridData(event, quadrant) {
    event.preventDefault();
    const form = event.target;
    const data = {
        soil: form.soil.value,
        crop: form.crop.value,
        soilState: form.soilState.value,
        cropState: form.cropState.value,
        disease: form.disease.value,
    };

    try {
        await fetch(`/api/grid/${quadrant}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        fetchGridData();
    } catch (error) {
        console.error('Error updating grid data:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    fetchGridData();
});