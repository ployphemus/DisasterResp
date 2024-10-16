let map;
let circles = []; // Array to hold the circle objects for flood data
let wildfireMarkers = []; // Array to hold wildfire markers

// Function to initialize Google Map
function initMap() {
    console.log('Map is initializing...');
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: 0, lng: 0 }, // Placeholder center, will be updated
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
            const userMarker = new google.maps.Marker({
                position: userLocation,
                map: map,
                title: 'You are here',
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Blue marker icon
                }
            });

            // Fetch and display initial flood data
            updateUSGSStreamData(userLocation.lat, userLocation.lng);

            // Fetch and display initial wildfire data
            const date = getCurrentDate(); // Get the current date
            const apiKey = 'fc78b26b34c22912a710a8d8a0578918'; // Your NASA API key
            fetchWildfireCsvData(apiKey, date).then(csvData => {
                if (csvData) {
                    const wildfireData = parseWildfireCsvData(csvData);
                    displayWildfireDataOnMap(wildfireData);
                }
            });
        }, () => {
            // Handle location error
            console.error('Geolocation service failed. Using default location.');
            updateUSGSStreamData(defaultCenter.lat, defaultCenter.lng);
        });
    } else {
        // Browser doesn't support Geolocation
        console.error('Geolocation is not supported by this browser. Using default location.');
        updateUSGSStreamData(defaultCenter.lat, defaultCenter.lng);
    }

    // Add event listener for when the map is moved or zoomed
    google.maps.event.addListener(map, 'idle', () => {
        const center = map.getCenter();
        updateUSGSStreamData(center.lat(), center.lng());
    });

    // Set up buttons for toggling data
    document.getElementById('toggle-flood').addEventListener('click', function() {
        showFloodData();
    });

    document.getElementById('toggle-wildfire').addEventListener('click', function() {
        showWildfireData();
    });
}

// Function to get the current date in YYYY-MM-DD format
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to fetch and display USGS stream height data (flood info)
function updateUSGSStreamData(centerLat, centerLon) {
    const radiusInMiles = 25;
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

// Function to display flood data on Google Maps and sidebar
function displayDataOnMap(data) {
    const timeSeries = data.value.timeSeries;
    const floodList = document.getElementById('flood-list');
    floodList.innerHTML = ''; // Clear the existing list
    circles = []; // Clear previous circles

    timeSeries.slice(0, 10).forEach(series => {
        const siteName = series.sourceInfo.siteName;
        const gageHeight = parseFloat(series.values[0].value[0].value);
        const latitude = series.sourceInfo.geoLocation.geogLocation.latitude;
        const longitude = series.sourceInfo.geoLocation.geogLocation.longitude;

        // Determine color based on gage height
        let colorClass;
        if (gageHeight < 5) {
            colorClass = 'green';
        } else if (gageHeight < 10) {
            colorClass = 'yellow';
        } else if (gageHeight < 15) {
            colorClass = 'orange';
        } else {
            colorClass = 'red';
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
            radius: 1000
        });

        circles.push({ circle, siteName, gageHeight, latitude, longitude });

        // Add to the sidebar list
        const listItem = document.createElement('li');
        listItem.classList.add(colorClass);
        listItem.innerHTML = `
            <strong>${siteName}</strong><br>
            Location: (${latitude.toFixed(5)}, ${longitude.toFixed(5)})<br>
            Gage Height: ${gageHeight} ft
        `;

        listItem.addEventListener('click', () => {
            map.setCenter({ lat: latitude, lng: longitude });
            map.setZoom(12);
        });

        floodList.appendChild(listItem);

        const infoWindow = new google.maps.InfoWindow({
            content: `<strong>${siteName}</strong><br>Gage Height: ${gageHeight} ft`
        });

        google.maps.event.addListener(circle, 'click', () => {
            infoWindow.setPosition(circle.getCenter());
            infoWindow.open(map);
        });
    });
}

// Fetch wildfire CSV data from NASA API
async function fetchWildfireCsvData(apiKey, date) {
    const layer = "VIIRS_SNPP_NRT"; // Specify the layer
    const areaType = "world"; // Specify the area type
    const area = "1"; // Specify the area (1 for global)
    const buffer = "0"; // Buffer

    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/${layer}/${areaType}/${area}/${buffer}/${date}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'text/plain'
            }
        });

        if (response.ok) {
            const csvData = await response.text();
            console.log("CSV Data:\n", csvData);
            return csvData;
        } else {
            console.error(`HTTP error: ${response.status}`);
            return null;
        }
    } catch (e) {
        console.error("Exception during API call", e);
        return null;
    }
}

// Parse wildfire CSV data into usable format
function parseWildfireCsvData(csvData) {
    const lines = csvData.split('\n');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',');
    const headerIndices = {};
    headers.forEach((name, index) => {
        headerIndices[name] = index;
    });

    const dataLines = lines.slice(1);
    const dataList = [];

    for (const line of dataLines) {
        if (line.trim() === '') continue;
        const fields = line.split(',');
        const item = {
            latitude: parseFloat(fields[headerIndices["latitude"]]) || 0.0,
            longitude: parseFloat(fields[headerIndices["longitude"]]) || 0.0,
            acqDate: fields[headerIndices["acq_date"]],
            acqTime: fields[headerIndices["acq_time"]],
            confidence: parseFloat(fields[headerIndices["confidence"]]) || 0, // Ensure it's a number
            status: parseFloat(fields[headerIndices["confidence"]]) > 70 ? 'Active' : 'Extinguished' // Wildfire status
        };

        dataList.push(item);
    }

    return dataList;
}

// Function to display wildfire data on the map
function displayWildfireDataOnMap(wildfireData) {
    const wildfireList = document.getElementById('wildfire-list');
    wildfireList.innerHTML = ''; // Clear the existing list

    wildfireData.forEach(item => {
        if (item.confidence >= 0) {  // Include fires with 0% confidence
            const marker = new google.maps.Marker({
                position: { lat: item.latitude, lng: item.longitude },
                map: map,
                title: `Wildfire detected on ${item.acqDate} at ${item.acqTime}`
            });

            wildfireMarkers.push(marker);

            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <b>Wildfire Detected</b><br>
                    Latitude: ${item.latitude}<br>
                    Longitude: ${item.longitude}<br>
                    Date: ${item.acqDate} ${item.acqTime}<br>
                    Status: ${item.status}<br>
                    Confidence: ${item.confidence}%<br>
                `
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });

            // Add wildfire data to the sidebar list
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>Wildfire Detected</strong><br>
                Date: ${item.acqDate} ${item.acqTime}<br>
                Latitude: ${item.latitude.toFixed(5)}<br>
                Longitude: ${item.longitude.toFixed(5)}<br>
                Status: ${item.status}<br>
                Confidence: ${item.confidence}%
            `;
            wildfireList.appendChild(listItem);
        }
    });
}
