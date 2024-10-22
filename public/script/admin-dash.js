let map;
let circles = []; // Array to hold the circle objects for easier access
let clickedCoordinates = null; // Variable to store clicked coordinates
let smallCircle = null; // Variable to store the small circle indicating the clicked location
let markers = []; // Array to hold the marker objects for easier access

/**
 * This function initMap() is used to initialize the Google Map and add event listeners for creating circles and shelters.
 */
function initMap() {
  console.log("Map is initializing...");
  const center = { lat: 36.044659, lng: -79.766235 }; // Initial center of the map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: center,
  });
  infoWindow = new google.maps.InfoWindow();

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

            // Add an event listener to show an InfoWindow with the name and radius
            google.maps.event.addListener(circle, "click", () => {
              infoWindow.setContent(
                `<div><strong>${name}</strong><br>Radius: ${radius} miles</div>`
              );
              infoWindow.setPosition(clickedCoordinates);
              infoWindow.open(map);
            });

            circles.push(circle); // Store the circle for easier access

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
  updateUSGSStreamData(center.lat, center.lng);

  // Add event listener for when the map is moved or zoomed
  google.maps.event.addListener(map, "idle", () => {
    const center = map.getCenter();
    updateUSGSStreamData(center.lat(), center.lng());
  });

  // Fetch and draw all disaster zones
  fetchDisasterZones();

  // Fetch and draw all shelters
  fetchShelters();
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

/**
 * This function fetchSchoolsAndCreateShelters() is used to fetch nearby schools from the Google Places API and create shelters in the database.
 * @param {*} center The center coordinates to search for nearby schools
 * @param {*} radiusInMeters The radius in meters to search for nearby schools
 * @param {*} disasterzoneId The ID of the disaster zone to associate the shelters with
 */
function fetchSchoolsAndCreateShelters(center, radiusInMeters, disasterzoneId) {
  console.log("Creating shelters with disasterzone_id:", disasterzoneId); // Log the disasterzone_id
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
          Shelter_address: place.vicinity, // Add the address of the school
        };

        console.log("Creating shelter:", shelterData); // Log the shelter data

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
            // Draw the shelter on the map
            const marker = new google.maps.Marker({
              position: {
                lat: shelterData.Latitude,
                lng: shelterData.Longitude,
              },
              map: map,
              title: shelterData.Name,
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

            markers.push(marker); // Store the marker for easier access
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

window.initMap = initMap;

window.onload = () => {
  console.log("Page is fully loaded");
  initMap();
};
