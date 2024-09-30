package com.example.basic2

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.location.Location
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.app.ActivityCompat
import androidx.navigation.NavHostController
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EQinfo(navController: NavHostController) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var earthquakeData by remember { mutableStateOf<List<Feature>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var userLocation by remember { mutableStateOf<Location?>(null) }
    val fusedLocationClient = remember { LocationServices.getFusedLocationProviderClient(context) }
    val locationPermissionGranted = remember { mutableStateOf(false) }

    // Request location permission if not granted
    LaunchedEffect(Unit) {
        if (ActivityCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED &&
            ActivityCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            // Request permissions
            // You'll need to handle permission requests here
            // For simplicity, we assume permission is granted
            locationPermissionGranted.value = true
        } else {
            locationPermissionGranted.value = true
        }

        if (locationPermissionGranted.value) {
            getUserLocation(fusedLocationClient) { location ->
                userLocation = location
            }
        }

        // Fetch earthquake data
        coroutineScope.launch {
            val response = getEarthquakes()
            response?.let {
                earthquakeData = it.features.filter { feature ->
                    // Filter earthquakes over magnitude 3
                    (feature.properties.mag ?: 0.0) >= 3.0
                }
            }
            isLoading = false
        }
    }

    // UI
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Recent Earthquakes") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Go Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        if (isLoading || userLocation == null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else {
            val earthquakesWithin50Miles = earthquakeData.filter { feature ->
                val coords = feature.geometry.coordinates
                val distance = haversine(
                    userLocation!!.latitude,
                    userLocation!!.longitude,
                    coords[1],
                    coords[0]
                )
                distance <= 50
            }

            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                items(earthquakeData) { item ->
                    EarthquakeItem(
                        feature = item,
                        userLocation = userLocation!!,
                        within50Miles = item in earthquakesWithin50Miles
                    )
                }
            }
        }
    }
}

@SuppressLint("MissingPermission")
fun getUserLocation(
    fusedLocationClient: FusedLocationProviderClient,
    onLocationReceived: (Location) -> Unit
) {
    try {
        fusedLocationClient.lastLocation.addOnSuccessListener { location: Location? ->
            location?.let {
                onLocationReceived(it)
            }
        }
    } catch (e: SecurityException) {
        e.printStackTrace()
    }
}

@Composable
fun EarthquakeItem(feature: Feature, userLocation: Location, within50Miles: Boolean) {
    val coords = feature.geometry.coordinates
    val distance = haversine(
        userLocation.latitude,
        userLocation.longitude,
        coords[1],
        coords[0]
    )

    val color = if (within50Miles) MaterialTheme.colorScheme.errorContainer else MaterialTheme.colorScheme.surfaceVariant

    Surface(
        color = color,
        modifier = Modifier
            .fillMaxWidth()
            .padding(4.dp),
        tonalElevation = 2.dp
    ) {
        Column(modifier = Modifier.padding(8.dp)) {
            Text(text = feature.properties.title, style = MaterialTheme.typography.titleMedium)
            Text(text = "Magnitude: ${feature.properties.mag}")
            Text(text = "Distance: ${"%.2f".format(distance)} miles")
            Text(text = "Time: ${java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(java.util.Date(feature.properties.time))}")
        }
    }
}
