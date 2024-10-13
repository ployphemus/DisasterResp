package com.example.basic2

import android.location.Location
import android.util.Log
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EQinfo(navController: NavHostController) {
    val coroutineScope = rememberCoroutineScope()
    var earthquakeData by remember { mutableStateOf<List<EarthquakeFeature>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    // Fetch earthquake data
    LaunchedEffect(Unit) {
        coroutineScope.launch {
            val response = getEarthquakeData()
            response?.let {
                earthquakeData = it.features
            }
            isLoading = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Recent Earthquakes in the US") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Go Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        if (isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                // Map
                EarthquakeMap(earthquakeData = earthquakeData)
                // Earthquake List
                EarthquakeList(earthquakeData = earthquakeData)
            }
        }
    }
}

@Composable
fun EarthquakeMap(earthquakeData: List<EarthquakeFeature>) {
    // Center the map on the US
    val usCenter = LatLng(37.0902, -95.7129) // Approximate center of the continental US
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(usCenter, 4f)
    }

    GoogleMap(
        modifier = Modifier
            .fillMaxWidth()
            .height(300.dp),
        cameraPositionState = cameraPositionState
    ) {
        // Earthquake markers
        earthquakeData.forEach { feature ->
            val coords = feature.geometry.coordinates
            val longitude = coords[0]
            val latitude = coords[1]
            val magnitude = feature.properties.magnitude ?: 0.0

            val markerColor = when {
                magnitude >= 5.0 -> BitmapDescriptorFactory.HUE_RED
                magnitude >= 4.0 -> BitmapDescriptorFactory.HUE_ORANGE
                else -> BitmapDescriptorFactory.HUE_YELLOW
            }

            Marker(
                state = MarkerState(position = LatLng(latitude, longitude)),
                title = "M ${magnitude}",
                snippet = feature.properties.place,
                icon = BitmapDescriptorFactory.defaultMarker(markerColor)
            )
        }
    }
}

@Composable
fun EarthquakeList(earthquakeData: List<EarthquakeFeature>) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
    ) {
        items(earthquakeData) { feature ->
            EarthquakeItem(feature = feature)
        }
    }
}

@Composable
fun EarthquakeItem(feature: EarthquakeFeature) {
    val magnitude = feature.properties.magnitude ?: 0.0
    val place = feature.properties.place
    val time = feature.properties.time

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(4.dp),
        tonalElevation = 2.dp
    ) {
        Column(modifier = Modifier.padding(8.dp)) {
            Text(text = "M ${magnitude} - ${place}", style = MaterialTheme.typography.titleMedium)
            Text(text = "Time: ${formatDateTime(time)}")
        }
    }
}

fun formatDateTime(timestamp: Long): String {
    val date = java.util.Date(timestamp)
    val format = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault())
    return format.format(date)
}
