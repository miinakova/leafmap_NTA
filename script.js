// Initialize the map
const map = L.map('map').setView([40.7128, -74.0060], 12); // Center on NYC

// Add Dark Gray Basemap
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors, © Stadia Maps',
    maxZoom: 20
}).addTo(map);

// Function to style each feature based on 'Score_out'
function styleFeature(feature) {
    const score = feature.properties.Score_out; // Access 'Score_out' field
    let color = '#FFFFFF'; // Default color

    // Define colors based on the score
    if (score === 1) color = '#FFF7E0'; // Light beige
    else if (score === 2) color = '#FDE5B2'; // Light orange
    else if (score === 3) color = '#FDB46B'; // Orange
    else if (score === 4) color = '#E8603C'; // Dark orange
    else if (score === 5) color = '#8C2D04'; // Dark brown

    return {
        color: '#000',        // Black border
        weight: 1,            // Thin border
        fillColor: color,     // Fill color based on score
        fillOpacity: 0.7      // Slight transparency
    };
}

// Function to handle hover effects
function highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
        weight: 2,
        color: '#FFF',        // White border
        fillColor: '#FFF',    // White fill on hover
        fillOpacity: 1        // Full opacity
    });
}

// Function to reset hover style
function resetHighlight(e) {
    geojson.resetStyle(e.target); // Reset to original style
}

// Function to bind hover popups and hover styles
function onEachFeature(feature, layer) {
    const ntaIndex = feature.properties.Score_out; // Access the Score_out attribute for NTA index

    // Add hover pop-up
    layer.bindTooltip(`${ntaIndex}`, {
        sticky: true,       // Keeps tooltip close to cursor
        direction: "top",   // Position tooltip above cursor
        className: "tooltip-style" // Custom tooltip styling
    });

    layer.on({
        mouseover: highlightFeature, // Highlight on hover
        mouseout: resetHighlight,    // Reset on hover out
    });
}

// Load GeoJSON data
fetch('data/NTA.geojson') // Make sure the file path matches your directory
    .then(response => response.json())
    .then(data => {
        // Add GeoJSON layer with styling and hover effects
        geojson = L.geoJSON(data, {
            style: styleFeature,
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(err => console.error('Error loading GeoJSON:', err)); // Debugging for errors
