let map;
let circles = []; // Array to hold the circle objects for easier access
let clickedCoordinates = null; // Variable to store clicked coordinates
let smallCircle = null; // Variable to store the small circle indicating the clicked location
let markers = []; // Array to hold the marker objects for easier access
let userMarkers = []; // Array to hold user markers
let showAllUsers = true; // Toggle state for showing all users vs users in disaster zones
let selectedDisasterZone = null;

/**
 * This function initMap() is used to initialize the Google Map and add event listeners for creating circles and shelters.
 */
function initMap() {
  console.log("Map is initializing...");
  const center = { lat: 36.044659, lng: -79.766235 }; // Initial center of the map

  shelterIcon = {
    url: "/shelter.png", // Path is relative to your public directory
    scaledSize: new google.maps.Size(32, 32), // Adjust size as needed
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(16, 32), // Center bottom of the image
  };

  userIcon = {
    url: "/user.png",
    scaledSize: new google.maps.Size(24, 24), // Reduced from 32x32 to 24x24
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(12, 24), // Adjusted anchor point
  };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: center,
  });
  infoWindow = new google.maps.InfoWindow();

  // Add toggle button for user display
  const userToggleButton = document.createElement("button");
  userToggleButton.textContent = "Toggle User Display";
  userToggleButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(userToggleButton);

  userToggleButton.addEventListener("click", () => {
    showAllUsers = !showAllUsers;
    updateUserMarkers();
    userToggleButton.textContent = showAllUsers
      ? "Show Users in Disaster Zones"
      : "Show All Users";
  });

  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  // Add the button to create a circle
  const createCircleButton = document.createElement("button");
  createCircleButton.textContent = "Create Circle";
  createCircleButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(createCircleButton);
  createCircleButton.addEventListener("click", () => {
    if (!clickedCoordinates) {
      alert("Please click on the map to select a location first.");
      return;
    }

    const name = prompt("Enter the name for the disaster zone:");
    if (!name) {
      alert("Name is required.");
      return;
    }

    // Show the color picker modal
    const modal = document.getElementById("colorPickerModal");
    const colorPicker = document.getElementById("colorPicker");
    const colorPickerSubmit = document.getElementById("colorPickerSubmit");
    modal.style.display = "block";

    // Handle color picker submission
    colorPickerSubmit.onclick = () => {
      const hexColor = colorPicker.value;
      modal.style.display = "none";

      const radius = prompt("Enter the radius in miles for the circle:");
      if (radius && !isNaN(radius)) {
        // Send the circle data to the server
        const circleData = {
          Name: name,
          Latitude: clickedCoordinates.lat(),
          Longitude: clickedCoordinates.lng(),
          Radius: parseFloat(radius),
          HexColor: hexColor.substring(1), // Remove the '#' from the color value
        };

        fetch("http://localhost:8000/disasterzone/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(circleData),
        })
          .then(async (response) => {
            const contentType = response.headers.get("content-type");
            if (!response.ok) {
              if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Server error");
              } else {
                throw new Error("Network response was not ok");
              }
            }

            if (contentType && contentType.includes("application/json")) {
              return response.json();
            }
            throw new Error("Response was not JSON");
          })
          .then((data) => {
            if (!data.success) {
              throw new Error(data.error || "Operation failed");
            }

            console.log("Disaster zone created:", data);
            const disasterzoneId = data.insertId;

            if (!disasterzoneId) {
              throw new Error("No disaster zone ID returned");
            }

            // Create the circle on the map
            const radiusInMeters = parseFloat(radius) * 1609.34; // Convert miles to meters
            const circle = new google.maps.Circle({
              strokeColor: hexColor,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: hexColor,
              fillOpacity: 0.35,
              map: map,
              center: clickedCoordinates,
              radius: radiusInMeters,
            });

            // Store the zone data with the circle
            circle.zoneData = {
              id: disasterzoneId,
              Name: name,
              Radius: parseFloat(radius),
              HexColor: hexColor.substring(1),
              Latitude: clickedCoordinates.lat(),
              Longitude: clickedCoordinates.lng(),
            };

            // Add click event with admin controls
            google.maps.event.addListener(circle, "click", () => {
              selectedDisasterZone = circle;

              const content = `
                            <div>
                                <strong>${name}</strong><br>
                                Radius: ${radius} miles<br>
                                <div style="margin-top: 10px;">
                                    <button onclick="editDisasterZone()" style="margin-right: 5px;" class="btn btn-primary">Edit Zone</button>
                                    <button onclick="deleteDisasterZone(${disasterzoneId})" class="btn btn-danger">Delete Zone</button>
                                </div>
                            </div>
                        `;

              infoWindow.setContent(content);
              infoWindow.setPosition(clickedCoordinates);
              infoWindow.open(map);
            });

            circles.push(circle);

            // Create shelters within the disaster zone
            fetchSchoolsAndCreateShelters(
              clickedCoordinates,
              radiusInMeters,
              disasterzoneId
            );

            alert("Disaster zone created successfully!");
          })
          .catch((error) => {
            console.error("Error creating disaster zone:", error);
            alert(`Failed to create disaster zone: ${error.message}`);
          });
      } else {
        alert("Invalid radius value.");
      }
    };

    // Close the modal when the user clicks on <span> (x)
    const span = document.getElementsByClassName("close")[0];
    span.onclick = () => {
      modal.style.display = "none";
    };

    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  });

  // Add event listener to capture clicked coordinates and draw a small circle
  map.addListener("click", (event) => {
    clickedCoordinates = event.latLng;
    console.log("Clicked coordinates:", clickedCoordinates.toString());
    drawSmallCircle(clickedCoordinates);
  });

  // Fetch and display initial data
  // No longer used since this used to be a part of the admin-dash
  //updateUSGSStreamData(center.lat, center.lng);

  // Add event listener for when the map is moved or zoomed
  google.maps.event.addListener(map, "idle", () => {
    const center = map.getCenter();
    //updateUSGSStreamData(center.lat(), center.lng());
  });

  // Fetch and draw all disaster zones
  fetchDisasterZones();

  // Fetch and draw all shelters
  fetchShelters();

  // Add initial user markers
  fetchAndDisplayUsers();
}

/**
 * Other functions
 */

/**
 * This function handleLocationError() is used to handle errors when geolocation fails.
 * @param {*} browserHasGeolocation
 * @param {*} infoWindow
 * @param {*} pos
 */
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
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

// Add this new function to check if a user is near a shelter
function isUserNearShelter(userLat, userLng) {
  const SHELTER_PROXIMITY_THRESHOLD = 50; // 50 meters threshold

  return markers.some((marker) => {
    if (!marker.getPosition) return false;

    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(userLat, userLng),
      marker.getPosition()
    );

    return distance <= SHELTER_PROXIMITY_THRESHOLD;
  });
}

// Update the fetchAndDisplayUsers function to wait for shelters to load first
function fetchAndDisplayUsers() {
  // First ensure shelters are loaded
  fetch("http://localhost:8000/shelters/all")
    .then((response) => response.json())
    .then((shelterData) => {
      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null));
      markers = [];

      // Create shelter markers
      shelterData.forEach((shelter) => {
        const marker = new google.maps.Marker({
          position: { lat: shelter.Latitude, lng: shelter.Longitude },
          map: map,
          title: shelter.Name,
          icon: shelterIcon,
        });

        google.maps.event.addListener(marker, "click", () => {
          infoWindow.setContent(
            `<div><strong>${shelter.Name}</strong>
            <br>Capacity: ${shelter.Maximum_Capacity}
            <br>Current Capacity: ${shelter.Current_Capacity}</div>`
          );
          infoWindow.setPosition(marker.getPosition());
          infoWindow.open(map);
        });

        markers.push(marker);
      });

      // Now fetch and display users after shelters are loaded
      return fetch("http://localhost:8000/users/all", {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
    })
    .then((response) => response.json())
    .then((users) => {
      clearUserMarkers();
      users.forEach((user) => {
        if (user.Latitude && user.Longitude) {
          createUserMarker(user);
        }
      });
      updateUserMarkers();
    })
    .catch((error) => {
      console.error("Error loading map data:", error);
      alert("Failed to load map data. Please try again later.");
    });
}

// Update the createUserMarker function to check shelter proximity
function createUserMarker(user) {
  // First check if user is near a shelter
  if (isUserNearShelter(user.Latitude, user.Longitude)) {
    // Don't create marker if user is near shelter
    return;
  }

  const marker = new google.maps.Marker({
    position: { lat: user.Latitude, lng: user.Longitude },
    map: null, // Don't show immediately
    title: user.Name || "User",
    icon: userIcon,
  });

  // Add click listener for user info
  google.maps.event.addListener(marker, "click", () => {
    infoWindow.setContent(
      `<div>
        <strong>${user.Name || "User"}</strong>
        ${user.Email ? `<br>Email: ${user.Email}` : ""}
      </div>`
    );
    infoWindow.setPosition(marker.getPosition());
    infoWindow.open(map);
  });

  userMarkers.push({
    marker: marker,
    user: user,
  });
}

// Function to clear all user markers
function clearUserMarkers() {
  userMarkers.forEach(({ marker }) => {
    marker.setMap(null);
  });
  userMarkers = [];
}

// Function to check if a point is inside any disaster zone
function isPointInDisasterZones(lat, lng) {
  return circles.some((circle) => {
    const center = circle.getCenter();
    const radius = circle.getRadius();
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(lat, lng),
      center
    );
    return distance <= radius;
  });
}

// Update the updateUserMarkers function to also check shelter proximity
function updateUserMarkers() {
  userMarkers.forEach(({ marker, user }) => {
    if (showAllUsers && !isUserNearShelter(user.Latitude, user.Longitude)) {
      marker.setMap(map);
    } else if (!showAllUsers) {
      // For disaster zone only view, still check shelter proximity
      const isInZone = isPointInDisasterZones(user.Latitude, user.Longitude);
      const nearShelter = isUserNearShelter(user.Latitude, user.Longitude);
      marker.setMap(isInZone && !nearShelter ? map : null);
    } else {
      marker.setMap(null);
    }
  });
}

// Update the existing fetchDisasterZones function to trigger user marker update
function fetchDisasterZones() {
  fetch("http://localhost:8000/disasterzone/all")
    .then((response) => response.json())
    .then((data) => {
      // Clear existing circles
      circles.forEach((circle) => circle.setMap(null));
      circles = [];

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

        // Store zone data with the circle
        circle.zoneData = zone;

        google.maps.event.addListener(circle, "click", () => {
          selectedDisasterZone = circle;

          // Create info window content with admin controls - Fix the ID reference
          const content = `
                      <div>
                          <strong>${zone.Name}</strong><br>
                          Radius: ${zone.Radius} miles<br>
                          <div style="margin-top: 10px;">
                              <button onclick="editDisasterZone()" style="margin-right: 5px;" class="btn btn-primary">Edit Zone</button>
                              <button onclick="deleteDisasterZone(${zone.id})" class="btn btn-danger">Delete Zone</button>
                          </div>
                      </div>
                  `;

          infoWindow.setContent(content);
          infoWindow.setPosition({ lat: zone.Latitude, lng: zone.Longitude });
          infoWindow.open(map);
        });

        circles.push(circle);
      });

      // Update user markers after disaster zones are loaded
      updateUserMarkers();
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
          icon: shelterIcon,
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

        markers.push(marker);
      });
    })
    .catch((error) => console.error("Error fetching shelters:", error));
}

/**
 * This function fetchSchoolsAndCreateShelters() is used to fetch nearby schools from the Google Places API and create shelters in the database.
 * @param {*} center The center coordinates to search for nearby schools
 * @param {*} radiusInMeters The radius in meters to search for nearby schools
 * @param {*} disasterzoneId The ID of the disaster zone to associate the shelters with
 */
function fetchSchoolsAndCreateShelters(center, radiusInMeters, disasterzoneId) {
  console.log("Creating shelters with disasterzone_id:", disasterzoneId);
  const service = new google.maps.places.PlacesService(map);
  const request = {
    location: center,
    radius: radiusInMeters,
    type: ["school"],
  };

  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.forEach((place) => {
        const shelterData = {
          Name: place.name,
          Latitude: place.geometry.location.lat(),
          Longitude: place.geometry.location.lng(),
          Maximum_Capacity: 300,
          Current_Capacity: 0,
          disasterzone_id: disasterzoneId,
          Shelter_address: place.vicinity,
        };

        console.log("Creating shelter:", shelterData);

        fetch("http://localhost:8000/shelters/createShelter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shelterData),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((error) => {
                throw new Error(error.error);
              });
            }
            return response.json();
          })
          .then((data) => {
            console.log("Shelter created:", data);
            // Draw the shelter on the map with custom icon
            const marker = new google.maps.Marker({
              position: {
                lat: shelterData.Latitude,
                lng: shelterData.Longitude,
              },
              map: map,
              title: shelterData.Name,
              icon: shelterIcon,
            });

            // Add an event listener to show an InfoWindow with the shelter details
            google.maps.event.addListener(marker, "click", () => {
              infoWindow.setContent(
                `<div><strong>${shelterData.Name}</strong>
                <br>Address: ${shelterData.Shelter_address}
                <br>Capacity: ${shelterData.Maximum_Capacity}
                <br>Current Capacity: ${shelterData.Current_Capacity}</div>`
              );
              infoWindow.setPosition(marker.getPosition());
              infoWindow.open(map);
            });

            markers.push(marker);
          })
          .catch((error) => {
            console.error("Error creating shelter:", error);
          });
      });
    } else {
      console.error("Error fetching schools:", status);
    }
  });
}

/**
 * This function updateUSGSStreamData() is used to fetch stream data from the USGS API and display it on the map.
 * @param {*} centerLat
 * @param {*} centerLon
 */
function updateUSGSStreamData(centerLat, centerLon) {
  const radiusInMiles = 25; // Set radius for fetching data
  const deltaLat = radiusInMiles / 69.0;
  const deltaLon =
    radiusInMiles / (69.0 * Math.cos((centerLat * Math.PI) / 180));

  const minLat = centerLat - deltaLat;
  const maxLat = centerLat + deltaLat;
  const minLon = centerLon - deltaLon;
  const maxLon = centerLon + deltaLon;

  const parameterCd = "00065,91110,91111";
  const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&parameterCd=${parameterCd}&bBox=${minLon.toFixed(
    5
  )},${minLat.toFixed(5)},${maxLon.toFixed(5)},${maxLat.toFixed(5)}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("USGS Data:", data);
      displayDataOnMap(data);
    })
    .catch((error) => console.error("Error fetching USGS data:", error));
}

/**
 * This function displayDataOnMap() is used to display the USGS stream height data on Google Maps and sidebar.
 * @param {*} data
 */
function displayDataOnMap(data) {
  const timeSeries = data.value.timeSeries;
  const floodList = document.getElementById("flood-list");
  floodList.innerHTML = ""; // Clear the existing list
  circles = []; // Clear previous circles

  // Loop over the timeSeries and add up to 10 entries
  timeSeries.slice(0, 10).forEach((series) => {
    const siteName = series.sourceInfo.siteName;
    const gageHeight = parseFloat(series.values[0].value[0].value);
    const latitude = series.sourceInfo.geoLocation.geogLocation.latitude;
    const longitude = series.sourceInfo.geoLocation.geogLocation.longitude;

    // Determine color based on gage height
    let colorClass;
    if (gageHeight < 5) {
      colorClass = "green"; // Low severity
    } else if (gageHeight < 10) {
      colorClass = "yellow"; // Moderate severity
    } else if (gageHeight < 15) {
      colorClass = "orange"; // High severity
    } else {
      colorClass = "red"; // Flood level
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
      radius: 1000, // Circle radius in meters
    });

    circles.push({ circle, siteName, gageHeight, latitude, longitude }); // Store the circle and data

    // Add to the sidebar list
    const listItem = document.createElement("li");
    listItem.classList.add(colorClass); // Apply the severity color
    listItem.innerHTML = `
          <strong>${siteName}</strong><br>
          Location: (${latitude.toFixed(5)}, ${longitude.toFixed(5)})<br>
          Gage Height: ${gageHeight} ft
      `;

    // Add click event to the list item
    listItem.addEventListener("click", () => {
      map.setCenter({ lat: latitude, lng: longitude }); // Center map on the circle
      map.setZoom(12); // Optional: zoom in for better visibility
    });

    floodList.appendChild(listItem);

    // Add an info window to display the site name and gage height when clicked
    const infoWindow = new google.maps.InfoWindow({
      content: `<strong>${siteName}</strong><br>Gage Height: ${gageHeight} ft`,
    });

    // Show info window when the circle is clicked
    google.maps.event.addListener(circle, "click", () => {
      infoWindow.setPosition(circle.getCenter());
      infoWindow.open(map);
    });
  });
}

function deleteDisasterZone(zoneId) {
  if (
    confirm(
      "Are you sure you want to delete this disaster zone? This will also delete all associated shelters."
    )
  ) {
    fetch(`http://localhost:8000/disasterzone/delete/${zoneId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Clear the selected disaster zone from the map
        if (selectedDisasterZone) {
          selectedDisasterZone.setMap(null);
          circles = circles.filter((circle) => circle !== selectedDisasterZone);
        }

        // Clear all existing shelter markers from the map
        markers.forEach((marker) => marker.setMap(null));
        markers = [];

        infoWindow.close();

        // Fetch fresh data
        fetchDisasterZones();
        fetchShelters();

        alert("Disaster zone deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting disaster zone:", error);
        alert("Failed to delete disaster zone. Please try again.");
      });
  }
}

function editDisasterZone() {
  if (!selectedDisasterZone || !selectedDisasterZone.zoneData) return;

  const zone = selectedDisasterZone.zoneData;

  // Create and show edit modal
  const modalHtml = `
    <div id="editZoneModal" class="modal">
      <div class="modal-content">
        <span class="close" onclick="document.getElementById('editZoneModal').style.display='none'">&times;</span>
        <h2>Edit Disaster Zone</h2>
        <form id="editZoneForm">
          <div style="margin-bottom: 10px;">
            <label for="zoneName">Zone Name:</label>
            <input type="text" id="zoneName" value="${zone.Name}" required>
          </div>
          <div style="margin-bottom: 10px;">
            <label for="zoneRadius">Radius (miles):</label>
            <input type="number" id="zoneRadius" value="${zone.Radius}" required>
          </div>
          <div style="margin-bottom: 10px;">
            <label for="zoneColor">Color:</label>
            <input type="color" id="zoneColor" value="#${zone.HexColor}">
          </div>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  `;

  // Add modal to document if it doesn't exist
  if (!document.getElementById("editZoneModal")) {
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  // Show modal
  const modal = document.getElementById("editZoneModal");
  modal.style.display = "block";

  document.getElementById("editZoneForm").onsubmit = (e) => {
    e.preventDefault();

    const updatedZone = {
      Name: document.getElementById("zoneName").value,
      Radius: parseFloat(document.getElementById("zoneRadius").value),
      HexColor: document.getElementById("zoneColor").value.substring(1), // Remove #
      Latitude: zone.Latitude,
      Longitude: zone.Longitude,
    };

    fetch(`http://localhost:8000/disasterzone/update/${zone.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedZone),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Close modal
        modal.style.display = "none";

        // If radius changed, check for new schools
        if (updatedZone.Radius !== zone.Radius) {
          const center = { lat: zone.Latitude, lng: zone.Longitude };
          const radiusInMeters = updatedZone.Radius * 1609.34; // Convert miles to meters
          fetchSchoolsAndCreateShelters(center, radiusInMeters, zone.id);
        }

        // Refresh the map
        fetchDisasterZones();

        alert("Disaster zone updated successfully");
      })
      .catch((error) => {
        console.error("Error updating disaster zone:", error);
        alert("Failed to update disaster zone. Please try again.");
      });
  };
}

// Add CSS for the buttons and modal
const styles = `
  .btn {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  .btn-primary {
    background-color: #007bff;
    color: white;
  }

  .btn-danger {
    background-color: #dc3545;
    color: white;
  }

  #editZoneModal .modal-content {
    width: 400px;
    padding: 20px;
  }

  #editZoneModal input {
    width: 100%;
    padding: 5px;
    margin-top: 5px;
  }

  #editZoneModal label {
    font-weight: bold;
  }
`;

// Add styles to document
if (!document.getElementById("adminStyles")) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "adminStyles";
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

window.initMap = initMap;

window.onload = () => {
  console.log("Page is fully loaded");
  initMap();
};
