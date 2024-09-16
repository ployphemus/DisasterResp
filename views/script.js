function initMap() {
    const location = { lat: 36.044659, lng:-79.766235 }; //center point Greensboro, NC

    // Create the map object, centered at the given location
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10, // Zoom level
        center: location,
    });

    // \Add a marker to the map at the center location
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });
}
