let map;
let service;
let markers = []; // For schools/places
let shelterMarkers = []; // For official shelters
let userMarker;
let circles = [];
let infoWindow;
let smallCircle;
let shelterIcon;
let existingShelterLocations = new Set(); // Track existing shelter locations
let sheltersLoaded = false; // Flag to track if shelters have been loaded

function initMap() {
  console.log("Map is initializing...");
  const userShelterPage = document.getElementById("schools-table");
  const adminShelterPage = document.getElementById("shelter-table");
  console.log("The user shelter page is:", userShelterPage);
  console.log("The admin shelter page is:", adminShelterPage);

  shelterIcon = {
    url: "/shelter.png",
    scaledSize: new google.maps.Size(32, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(16, 32),
  };

  const center = { lat: 36.044659, lng: -79.766235 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: center,
  });

  infoWindow = new google.maps.InfoWindow();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map.setCenter(userLocation);
        userMarker = new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "You are here",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          },
        });

        service = new google.maps.places.PlacesService(map);

        initializeMapFeatures(userLocation, userShelterPage);
        fetchDisasterZones();

        if (adminShelterPage) {
          fetchShelters();
        }
      },
      (error) => {
        handleLocationError(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  } else {
    handleLocationError(false);
  }
}

async function initializeMapFeatures(userLocation, userShelterPage) {
  // Fetch shelters only if they haven't been loaded yet
  if (!sheltersLoaded) {
    await fetchShelters();
    sheltersLoaded = true;
  }

  if (userShelterPage) {
    console.log("Setting up user shelter page features");
    searchNearbySchools(userLocation);

    google.maps.event.addListener(map, "dragend", () => {
      const newCenter = map.getCenter();
      searchNearbySchools(newCenter.toJSON());
    });

    google.maps.event.addListener(map, "zoom_changed", () => {
      const newCenter = map.getCenter();
      searchNearbySchools(newCenter.toJSON());
    });
  }
}

function handleLocationError(browserHasGeolocation) {
  const center = { lat: 36.044659, lng: -79.766235 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 14,
  });

  const message = browserHasGeolocation
    ? "Error: The Geolocation service failed."
    : "Error: Your browser doesn't support geolocation.";
  alert(message);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Returns a number rounded to 2 decimal places
}

function isExistingShelter(lat, lng) {
  // Use a small threshold for floating-point comparison
  const threshold = 0.0001; // Approximately 11 meters at the equator
  return Array.from(existingShelterLocations).some(
    (loc) =>
      Math.abs(loc.lat - lat) < threshold && Math.abs(loc.lng - lng) < threshold
  );
}

function searchNearbySchools(location) {
  const userShelterPage = document.getElementById("schools-table");

  if (!service) {
    console.warn("Places service not initialized yet");
    return;
  }

  if (!userShelterPage) {
    return;
  }

  const request = {
    location: location,
    radius: "5000",
    type: ["school"],
  };

  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearMarkers();
      clearTable();

      const schoolsWithDistance = results.map((school) => {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          school.geometry.location.lat(),
          school.geometry.location.lng()
        );
        return { school, distance };
      });

      schoolsWithDistance.sort((a, b) => a.distance - b.distance);

      schoolsWithDistance.forEach((entry) => {
        const lat = entry.school.geometry.location.lat();
        const lng = entry.school.geometry.location.lng();

        // Only create a regular marker if it's not an existing shelter
        if (!isExistingShelter(lat, lng)) {
          createMarker(entry.school);
        }
        addSchoolToTable(entry.school, location, entry.distance);
      });
    } else {
      console.warn("Places search failed:", status);
    }
  });
}

function createMarker(place) {
  const userShelterPage = document.getElementById("schools-table");
  const adminShelterPage = document.getElementById("shelter-table");

  const lat = place.geometry.location.lat();
  const lng = place.geometry.location.lng();

  // Check if this location is already a shelter
  if (isExistingShelter(lat, lng)) {
    return; // Skip creating a new marker
  }

  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  markers.push(marker);

  service.getDetails({ placeId: place.place_id }, (placeDetails, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      let content = `<strong>${placeDetails.name}</strong><br>${placeDetails.formatted_address}<br>`;

      if (adminShelterPage) {
        content += `<button onclick="saveShelter('${
          placeDetails.name
        }', ${place.geometry.location.lat()}, ${place.geometry.location.lng()}, 100)">Save Shelter</button>`;
      }

      const infowindow = new google.maps.InfoWindow({
        content: content,
      });

      google.maps.event.addListener(marker, "click", () => {
        infowindow.open(map, marker);
      });
    }
  });
}

async function saveShelter(name, latitude, longitude, capacity) {
  try {
    const response = await fetch("/shelters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, latitude, longitude, capacity }),
    });

    if (!response.ok) {
      throw new Error("Failed to save shelter");
    }

    const shelter = await response.json();
    console.log("Shelter saved:", shelter);
  } catch (error) {
    console.error("Error saving shelter:", error);
  }
}

function addSchoolToTable(school, userLocation, distance) {
  const userShelterPage = document.getElementById("schools-table");
  if (!userShelterPage) return;

  const tableBody = document.querySelector("#schools-table tbody");
  if (!tableBody) return;

  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.textContent = school.name;
  row.appendChild(nameCell);

  const addressCell = document.createElement("td");
  addressCell.textContent = school.vicinity;
  row.appendChild(addressCell);

  const actionCell = document.createElement("td");
  const navigateButton = document.createElement("a");
  navigateButton.textContent = "Directions";
  navigateButton.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    school.geometry.location.lat()
  )},${encodeURIComponent(school.geometry.location.lng())}`;
  navigateButton.target = "_blank";
  actionCell.appendChild(navigateButton);
  row.appendChild(actionCell);

  const distanceCell = document.createElement("td");
  distanceCell.textContent = `${distance} miles`;
  row.appendChild(distanceCell);

  tableBody.appendChild(row);
}

function clearMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

// Add this function if you need to clear shelter markers separately
function clearShelterMarkers() {
  for (let i = 0; i < shelterMarkers.length; i++) {
    shelterMarkers[i].setMap(null);
  }
  shelterMarkers = [];
}

function clearTable() {
  const userShelterPage = document.getElementById("schools-table");
  if (!userShelterPage) return;

  const tableBody = document.querySelector("#schools-table tbody");
  if (tableBody) {
    tableBody.innerHTML = "";
  }
}

function drawSmallCircle(coordinates) {
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
    radius: 100,
  });
}

function fetchDisasterZones() {
  fetch("http://localhost:8000/disasterzone/all")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((zone) => {
        const radiusInMeters = zone.Radius * 1609.34;
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

        google.maps.event.addListener(circle, "click", () => {
          infoWindow.setContent(
            `<div><strong>${zone.Name}</strong><br>Radius: ${zone.Radius} miles</div>`
          );
          infoWindow.setPosition({ lat: zone.Latitude, lng: zone.Longitude });
          infoWindow.open(map);
        });

        circles.push(circle);
      });
    })
    .catch((error) => console.error("Error fetching disaster zones:", error));
}

async function fetchShelters() {
  try {
    const response = await fetch("http://localhost:8000/shelters/all");
    const data = await response.json();

    // Clear existing shelter locations and markers
    existingShelterLocations.clear();
    clearShelterMarkers();

    data.forEach((shelter) => {
      // Add shelter location to Set
      existingShelterLocations.add({
        lat: shelter.Latitude,
        lng: shelter.Longitude,
      });

      const marker = new google.maps.Marker({
        position: { lat: shelter.Latitude, lng: shelter.Longitude },
        map: map,
        title: shelter.Name,
        icon: shelterIcon,
      });

      google.maps.event.addListener(marker, "click", () => {
        infoWindow.setContent(
          `<div><strong>${shelter.Name}</strong>
            <br>Disaster Zone: ${shelter.disaster_name || "N/A"}
            <br>Capacity: ${shelter.Maximum_Capacity}
            <br>Current Capacity: ${shelter.Current_Capacity}
            <br>Address: ${shelter.Shelter_address || "N/A"}</div>`
        );
        infoWindow.setPosition(marker.getPosition());
        infoWindow.open(map);
      });

      shelterMarkers.push(marker);
    });
  } catch (error) {
    console.error("Error fetching shelters:", error);
  }
}

window.initMap = initMap;

window.onload = () => {
  console.log("Page is fully loaded");
  initMap();
};
