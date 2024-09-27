let map;
let service; // Declare the PlacesService globally
let markers = []; // Store markers globally

function initMap() {
    const center = { lat: 36.044659, lng:-79.766235 }; //center point Greensboro, NC
    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 14,
    });

    // Initialize PlacesService
    service = new google.maps.places.PlacesService(map);

    // Search for schools around the default center
    searchNearbySchools(center);

    // Add event listeners for dragging and zooming
    google.maps.event.addListener(map, 'dragend', () => {
        const newCenter = map.getCenter();
        searchNearbySchools(newCenter);
    });

    google.maps.event.addListener(map, 'zoom_changed', () => {
        const newCenter = map.getCenter();
        searchNearbySchools(newCenter);
    });
}

function searchNearbySchools(location) {
    const request = {
        location: location,
        radius: '5000',
        type: ['school'],
    };

    // Perform nearby search
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearMarkers();
            clearTable(); // Clear the table before adding new data
            for (let i = 0; i < results.length; i++) {
                createMarker(results[i]);
                addSchoolToTable(results[i]);
            }
        }
    });
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
    });

    markers.push(marker);

    // Fetch detailed information
    service.getDetails({ placeId: place.place_id }, (placeDetails, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const infowindow = new google.maps.InfoWindow({
                content: `<strong>${placeDetails.name}</strong><br>${placeDetails.formatted_address}`,
            });

            // Add marker click listener to show info window
            google.maps.event.addListener(marker, 'click', () => {
                infowindow.open(map, marker);
            });
        }
    });
}

// Function to add schools to the table
function addSchoolToTable(school) {
    const tableBody = document.querySelector('#schools-table tbody');
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');
    nameCell.textContent = school.name;
    row.appendChild(nameCell);

    const addressCell = document.createElement('td');
    addressCell.textContent = school.vicinity; // Use vicinity for basic address
    row.appendChild(addressCell);

    const actionCell = document.createElement('td');
    const navigateButton = document.createElement('a');
    navigateButton.textContent = 'Directions';
    navigateButton.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(school.geometry.location.lat())},${encodeURIComponent(school.geometry.location.lng())}`;
    navigateButton.target = '_blank'; // Open in new tab
    actionCell.appendChild(navigateButton);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function clearTable() {
    const tableBody = document.querySelector('#schools-table tbody');
    tableBody.innerHTML = ''; // Clear previous rows
}
