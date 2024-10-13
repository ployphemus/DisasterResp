let map;
let service; // Declare the PlacesService globally
let markers = []; // Store markers globally
let circles = []; // Array to hold the circle objects for easier access

function initMap() {
  const center = { lat: 36.044659, lng: -79.766235 }; //center point Greensboro, NC
  map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 14,
  });

  // Initialize PlacesService
  service = new google.maps.places.PlacesService(map);

  // Initialize InfoWindow
  infoWindow = new google.maps.InfoWindow();

  if (!document.getElementById("schools-table")) {
    // Fetch and draw all disaster zones
    fetchDisasterZones();

    // Fetch and draw all shelters
    fetchShelters();
    return;
  } else {
    // Search for schools around the default center
    searchNearbySchools(center);

    // Add event listeners for dragging and zooming
    google.maps.event.addListener(map, "dragend", () => {
      const newCenter = map.getCenter();
      searchNearbySchools(newCenter);
    });

    google.maps.event.addListener(map, "zoom_changed", () => {
      const newCenter = map.getCenter();
      searchNearbySchools(newCenter);
    });
  }
}

function searchNearbySchools(location) {
  const request = {
    location: location,
    radius: "5000",
    type: ["school"],
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
      google.maps.event.addListener(marker, "click", () => {
        infowindow.open(map, marker);
      });
    }
  });
}

// Function to add schools to the table
function addSchoolToTable(school) {
  const tableBody = document.querySelector("#schools-table tbody");
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.textContent = school.name;
  row.appendChild(nameCell);

  const addressCell = document.createElement("td");
  addressCell.textContent = school.vicinity; // Use vicinity for basic address
  row.appendChild(addressCell);

  const actionCell = document.createElement("td");
  const navigateButton = document.createElement("a");
  navigateButton.textContent = "Directions";
  navigateButton.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    school.geometry.location.lat()
  )},${encodeURIComponent(school.geometry.location.lng())}`;
  navigateButton.target = "_blank"; // Open in new tab
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
  const tableBody = document.querySelector("#schools-table tbody");
  tableBody.innerHTML = ""; // Clear previous rows
}

/**
 * This function drawSmallCircle() is used to draw a small circle at the given coordinates.
 * @param {*} coordinates
 */
function drawSmallCircle(coordinates) {
  // Remove the existing small circle, if any
  if (smallCircle) {
    smallCircle.setMap(null);
  }

  smallCircle = new google.maps.Circle({
    strokeColor: "blue",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "blue",
    fillOpacity: 0.35,
    map: map,
    center: coordinates,
    radius: 100, // Increased circle radius in meters to make it more visible
  });
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

        // Add an event listener to show an InfoWindow with the shelter details
        google.maps.event.addListener(marker, "click", () => {
          infoWindow.setContent(
            `<div><strong>${shelter.Name}</strong>
              <br>Capacity: ${shelter.Maximum_Capacity}
              <br>Current Capacity: ${shelter.Current_Capacity}</div>`
          );
          infoWindow.setPosition(marker.getPosition());
          infoWindow.open(map);
        });

        markers.push(marker); // Store the marker for easier access
      });
    })
    .catch((error) => console.error("Error fetching shelters:", error));
}

window.initMap = initMap;

window.onload = () => {
  console.log("Page is fully loaded");
  initMap();
};
