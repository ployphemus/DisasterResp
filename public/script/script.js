let map;
let circles = []; // Array to hold the circle objects for easier access

// Function to initialize Google Map
function initMap() {
    console.log('Map is initializing...');
    const center = { lat: 36.044659, lng: -79.766235 }; // Initial center of the map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: center,
    });

    // Fetch and display initial data
    updateUSGSStreamData(center.lat, center.lng);

    // Add event listener for when the map is moved or zoomed
    google.maps.event.addListener(map, 'idle', () => {
        const center = map.getCenter();
        updateUSGSStreamData(center.lat(), center.lng());
    });
}

// Function to fetch and display USGS stream height data
function updateUSGSStreamData(centerLat, centerLon) {
    const radiusInMiles = 25; // Set radius for fetching data
    const deltaLat = radiusInMiles / 69.0;
    const deltaLon = radiusInMiles / (69.0 * Math.cos(centerLat * Math.PI / 180));

    const minLat = centerLat - deltaLat;
    const maxLat = centerLat + deltaLat;
    const minLon = centerLon - deltaLon;
    const maxLon = centerLon + deltaLon;

    const parameterCd = '00065,91110,91111';
    const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&parameterCd=${parameterCd}&bBox=${minLon.toFixed(5)},${minLat.toFixed(5)},${maxLon.toFixed(5)},${maxLat.toFixed(5)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('USGS Data:', data);
            displayDataOnMap(data);
        })
        .catch(error => console.error('Error fetching USGS data:', error));
}

// Function to display the USGS stream height data on Google Maps and sidebar
function displayDataOnMap(data) {
    const timeSeries = data.value.timeSeries;
    const floodList = document.getElementById('flood-list');
    floodList.innerHTML = ''; // Clear the existing list
    circles = []; // Clear previous circles

    // Loop over the timeSeries and add up to 10 entries
    timeSeries.slice(0, 10).forEach(series => {
        const siteName = series.sourceInfo.siteName;
        const gageHeight = parseFloat(series.values[0].value[0].value);
        const latitude = series.sourceInfo.geoLocation.geogLocation.latitude;
        const longitude = series.sourceInfo.geoLocation.geogLocation.longitude;

        // Determine color based on gage height
        let colorClass;
        if (gageHeight < 5) {
            colorClass = 'green'; // Low severity
        } else if (gageHeight < 10) {
            colorClass = 'yellow'; // Moderate severity
        } else if (gageHeight < 15) {
            colorClass = 'orange'; // High severity
        } else {
            colorClass = 'red'; // Flood level
        }

        // Create a circle on the map at the site's location
        const circle = new google.maps.Circle({
            strokeColor: colorClass,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: colorClass,
            fillOpacity: 0.35,
            map: map,
            center: { lat: latitude, lng: longitude },
            radius: 1000 // Circle radius in meters
        });

        circles.push({ circle, siteName, gageHeight, latitude, longitude }); // Store the circle and data

        // Add to the sidebar list
        const listItem = document.createElement('li');
        listItem.classList.add(colorClass); // Apply the severity color
        listItem.innerHTML = `
            <strong>${siteName}</strong><br>
            Location: (${latitude.toFixed(5)}, ${longitude.toFixed(5)})<br>
            Gage Height: ${gageHeight} ft
        `;

        // Add click event to the list item
        listItem.addEventListener('click', () => {
            map.setCenter({ lat: latitude, lng: longitude }); // Center map on the circle
            map.setZoom(12); // Optional: zoom in for better visibility
        });

        floodList.appendChild(listItem);

        // Add an info window to display the site name and gage height when clicked
        const infoWindow = new google.maps.InfoWindow({
            content: `<strong>${siteName}</strong><br>Gage Height: ${gageHeight} ft`
        });

        // Show info window when the circle is clicked
        google.maps.event.addListener(circle, 'click', () => {
            infoWindow.setPosition(circle.getCenter());
            infoWindow.open(map);
        });
    });
}
