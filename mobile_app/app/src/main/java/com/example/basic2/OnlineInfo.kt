package com.example.basic2

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.location.Location
import android.util.Log
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.app.ActivityCompat
import androidx.navigation.NavHostController
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*
import kotlinx.coroutines.launch


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OnlineInfo(navController: NavHostController) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var streamData by remember { mutableStateOf<List<TimeSeries>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var userLocation by remember { mutableStateOf<Location?>(null) }
    val fusedLocationClient = remember { LocationServices.getFusedLocationProviderClient(context) }
    val locationPermissionGranted = remember { mutableStateOf(false) }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        locationPermissionGranted.value = isGranted
        if (isGranted) {
            getUserLocation(fusedLocationClient) { location ->
                userLocation = location
                // Now fetch the data
                coroutineScope.launch {
                    val response = getUSGSStreamHeight(
                        centerLat = userLocation!!.latitude,
                        centerLon = userLocation!!.longitude,
                        radiusInMiles = 25.0  // Adjust radius as needed
                    )
                    response?.let {
                        streamData = it.value.timeSeries
                    }
                    isLoading = false
                }
            }
        } else {
            Log.e("StreamMonitorsScreen", "Location permission not granted")
            isLoading = false
        }
    }

    // Request location permission
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
            permissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
        } else {
            locationPermissionGranted.value = true
            getUserLocation(fusedLocationClient) { location ->
                userLocation = location
                // Now fetch the data
                coroutineScope.launch {
                    val response = getUSGSStreamHeight(
                        centerLat = userLocation!!.latitude,
                        centerLon = userLocation!!.longitude,
                        radiusInMiles = 25.0  // Adjust radius as needed
                    )
                    response?.let {
                        streamData = it.value.timeSeries
                    }
                    isLoading = false
                }
            }
        }
    }

    // UI
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Stream Monitors") },
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
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                // Map
                StreamMonitorMap(
                    streamData = streamData,
                    userLocation = userLocation!!
                )
                // Stream Monitor List
                StreamMonitorList(streamData = streamData)
            }
        }
    }
}

@Composable
fun StreamMonitorMap(streamData: List<TimeSeries>, userLocation: Location) {
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(
            LatLng(userLocation.latitude, userLocation.longitude),
            10f
        )
    }

    GoogleMap(
        modifier = Modifier
            .fillMaxWidth()
            .height(300.dp),
        cameraPositionState = cameraPositionState
    ) {
        // User location marker
        Marker(
            state = MarkerState(position = LatLng(userLocation.latitude, userLocation.longitude)),
            title = "Your Location",
            icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE)
        )

        // Stream monitor markers
        streamData.forEach { item ->
            val latitude = item.sourceInfo.geoLocation.geogLocation.latitude
            val longitude = item.sourceInfo.geoLocation.geogLocation.longitude
            val siteName = item.sourceInfo.siteName
            val value = item.values.firstOrNull()?.measurements?.firstOrNull()?.value

            Marker(
                state = MarkerState(position = LatLng(latitude, longitude)),
                title = siteName,
                snippet = "Value: $value",
                icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN)
            )
        }
    }
}


@Composable
fun StreamMonitorList(streamData: List<TimeSeries>) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
    ) {
        items(streamData) { item ->
            StreamMonitorItem(timeSeries = item)
        }
    }
}

@Composable
fun StreamMonitorItem(timeSeries: TimeSeries) {
    val siteName = timeSeries.sourceInfo.siteName
    val value = timeSeries.values.firstOrNull()?.measurements?.firstOrNull()?.value
    val dateTime = timeSeries.values.firstOrNull()?.measurements?.firstOrNull()?.dateTime

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(4.dp),
        tonalElevation = 2.dp
    ) {
        Column(modifier = Modifier.padding(8.dp)) {
            Text(text = siteName, style = MaterialTheme.typography.titleMedium)
            Text(text = "Value: $value")
            Text(text = "Date/Time: $dateTime")
        }
    }
}

fun getFloodStageAndColor(gageHeight: Double): Pair<String, Color> {
    return when {
        gageHeight < 10 -> "Normal" to Color(0xFFA5D6A7) // Green
        gageHeight < 15 -> "Action Stage" to Color(0xFFFFF59D) // Yellow
        gageHeight < 20 -> "Minor Flooding" to Color(0xFFFFCC80) // Orange
        gageHeight < 25 -> "Moderate Flooding" to Color(0xFFEF9A9A) // Red
        else -> "Major Flooding" to Color(0xFFE1BEE7) // Purple
    }
}
