let map;
let service; // Declare the PlacesService globally
let markers = []; // Store markers globally
let userMarker; // Marker for the user's location
let circles = []; // Array to hold the circle objects for easier access
let infoWindow; // InfoWindow to display details

function initMap() {
  console.log('Map is initializing...');
  const center = { lat: 36.044659, lng: -79.766235 }; // Center point Greensboro, NC
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: center,
  });

  // Try to get user's real-time location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Center the map on user's location
      map.setCenter(userLocation);
      userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'You are here',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Blue marker icon
        }
      });

      // Initialize PlacesService
      service = new google.maps.places.PlacesService(map);

      // Search for schools around the user's location
      searchNearbySchools(userLocation);

      // Fetch and draw all disaster zones
      fetchDisasterZones();

      // Add event listeners for dragging and zooming
      google.maps.event.addListener(map, 'dragend', () => {
        const newCenter = map.getCenter(); // Get the new center after dragging
        searchNearbySchools(newCenter.toJSON()); // Call search with new center
      });

      google.maps.event.addListener(map, 'zoom_changed', () => {
        const newCenter = map.getCenter(); // Get the new center after zooming
        searchNearbySchools(newCenter.toJSON()); // Call search with new center
      });
    }, (error) => {
      handleLocationError(true);
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false);
  }
}

function handleLocationError(browserHasGeolocation) {
  const center = { lat: 36.044659, lng: -79.766235 }; // Fallback center point
  map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 14,
  });

  const message = browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : 'Error: Your browser doesn\'t support geolocation.';
  alert(message);
}

// Function to calculate the distance between two locations
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in miles
  return distance.toFixed(2); // Return distance with 2 decimal places
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
        addSchoolToTable(results[i], location); // Pass user location to the function
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
        content: `<strong>${placeDetails.name}</strong><br>${placeDetails.formatted_address}<br>
                          <button onclick="saveShelter('${placeDetails.name}', ${place.geometry.location.lat()}, ${place.geometry.location.lng()}, 100)">Save Shelter</button>`, // Add button to save shelter
      });

      // Add marker click listener to show info window
      google.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });
    }
  });
}

// Function to save shelter to the database
async function saveShelter(name, latitude, longitude, capacity) {
  try {
    const response = await fetch('/shelters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, latitude, longitude, capacity }),
    });

    if (!response.ok) {
      throw new Error('Failed to save shelter');
    }

    const shelter = await response.json();
    console.log('Shelter saved:', shelter);
  } catch (error) {
    console.error('Error saving shelter:', error);
  }
}

// Function to add schools to the table
function addSchoolToTable(school, userLocation) {
  const tableBody = document.querySelector('#schools-table tbody');
  const row = document.createElement('tr');

  const nameCell = document.createElement('td');
  nameCell.textContent = school.name; // Ensure school.name is defined
  row.appendChild(nameCell);

  const addressCell = document.createElement('td');
  addressCell.textContent = school.vicinity; // Ensure school.vicinity is defined
  row.appendChild(addressCell);

  const actionCell = document.createElement('td');
  const navigateButton = document.createElement('a');
  navigateButton.textContent = 'Directions';
  navigateButton.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(school.geometry.location.lat())},${encodeURIComponent(school.geometry.location.lng())}`;
  navigateButton.target = '_blank'; // Open in new tab
  actionCell.appendChild(navigateButton);
  row.appendChild(actionCell);

  // Calculate and display distance
  const distance = calculateDistance(userLocation.lat, userLocation.lng, school.geometry.location.lat(), school.geometry.location.lng());
  const distanceCell = document.createElement('td');
  distanceCell.textContent = `${distance} miles`; // Display distance in miles
  row.appendChild(distanceCell);

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

/**
 * This function fetchDisasterZones() is used to fetch all disaster zones from the server and draw them on the map.
 */
function fetchDisasterZones() {
  fetch("http://localhost:8000/disasterzone/all")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((zone) => {
          const radiusInMeters = zone.Radius * 1609.34; // Convert radius from miles to meters
          const circle = new google.maps.Circle({
            strokeColor: "#" + zone.HexColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#" + zone.HexColor,
            fillOpacity: 0.35,
            map: map,
            center: { lat: zone.Latitude, lng: zone.Longitude },
            radius: radiusInMeters,
          });

          // Add an event listener to show an InfoWindow with the name and radius
          google.maps.event.addListener(circle, "click", () => {
            infoWindow.setContent(
                `<div><strong>${zone.Name}</strong><br>Radius: ${zone.Radius} miles</div>`
            );
            infoWindow.setPosition({ lat: zone.Latitude, lng: zone.Longitude });
            infoWindow.open(map);
          });

          circles.push(circle); // Store the circle for easier access
        });
      })
      .catch((error) => console.error("Error fetching disaster zones:", error));
}

/**
 * This function fetchShelters() is used to fetch all shelters from the server and draw them on the map.
 */
function fetchShelters() {
  fetch("http://localhost:8000/shelters/all")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((shelter) => {
          const marker = new google.maps.Marker({
            position: { lat: shelter.Latitude, lng: shelter.Longitude },
            map: map,
            title: shelter.Name,
          });

          // Add a click event to the shelter marker
          marker.addListener("click", () => {
            const infowindow = new google.maps.InfoWindow({
              content: `<div><strong>${shelter.Name}</strong><br>Capacity: ${shelter.Capacity}</div>`,
            });
            infowindow.open(map, marker);
          });
        });
      })
      .catch((error) => console.error("Error fetching shelters:", error));
}
