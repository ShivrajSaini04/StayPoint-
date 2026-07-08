// Get coordinates & title from map element
const mapElement = document.getElementById("map");
const listingTitle = mapElement ? (mapElement.dataset.title || "") : "";
const coordinates = mapElement ? JSON.parse(mapElement.dataset.coordinates || "[]") : [];

if (coordinates.length === 2) {
    const lng = coordinates[0];
    const lat = coordinates[1];

    // Create map
    const map = L.map("map").setView([lat, lng], 13);

    // Street Layer
    const streetLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors",
        }
    );

    // Satellite Layer
    const satelliteLayer = L.tileLayer(
        "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=ErbaYfGyCQwEa7TBlxFs",
        {
            tileSize: 512,
            zoomOffset: -1,
            attribution:
                "&copy; MapTiler &copy; OpenStreetMap contributors",
        }
    );

    // Default layer
    streetLayer.addTo(map);

    // Marker
    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(listingTitle)
        .openPopup();

    // Buttons
    const streetBtn = document.getElementById("street-btn");
    const satelliteBtn = document.getElementById("satellite-btn");

    // Street View
    streetBtn.addEventListener("click", () => {
        if (map.hasLayer(satelliteLayer)) {
            map.removeLayer(satelliteLayer);
        }

        if (!map.hasLayer(streetLayer)) {
            streetLayer.addTo(map);
        }

        streetBtn.classList.add("active");
        satelliteBtn.classList.remove("active");
    });

    // Satellite View
    satelliteBtn.addEventListener("click", () => {
        if (map.hasLayer(streetLayer)) {
            map.removeLayer(streetLayer);
        }

        if (!map.hasLayer(satelliteLayer)) {
            satelliteLayer.addTo(map);
        }

        satelliteBtn.classList.add("active");
        streetBtn.classList.remove("active");
    });
}