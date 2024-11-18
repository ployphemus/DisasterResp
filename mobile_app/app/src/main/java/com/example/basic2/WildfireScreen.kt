package com.example.basic2

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.icu.text.SimpleDateFormat
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
import java.util.Calendar
import java.util.Date
import java.util.Locale
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.pow
import kotlin.math.sin
import kotlin.math.sqrt

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WildfireScreen(
    navController: NavHostController,
    onLogout: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var wildfireData by remember { mutableStateOf<List<WildfireDataItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var userLocation by remember { mutableStateOf<Location?>(null) }
    val fusedLocationClient = remember { LocationServices.getFusedLocationProviderClient(context) }
    val locationPermissionGranted = remember { mutableStateOf(false) }

    val apiKey = "fc78b26b34c22912a710a8d8a0578918" // Replace with your API key

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        locationPermissionGranted.value = isGranted
        if (isGranted) {
            getUserLocation(fusedLocationClient) { location ->
                userLocation = location
            }
        } else {
            Log.e("WildfireScreen", "Location permission not granted")
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
            }
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
            }
        }
    }


    // Fetch wildfire data when userLocation is available
    LaunchedEffect(userLocation) {
        if (userLocation != null) {
            isLoading = true
            val calendar = Calendar.getInstance()
            calendar.add(Calendar.DATE, -1) // Subtract one day
            val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val date = dateFormat.format(calendar.time)

            val csvData = fetchWildfireCsvData(
                apiKey = apiKey,
                date = date
            )

            csvData?.let {
                val allWildfireData = parseWildfireCsvData(it)

                // Optionally filter data to within a certain distance from user
                wildfireData = allWildfireData.filter { item ->
                    val distance = haversine(
                        userLocation!!.latitude,
                        userLocation!!.longitude,
                        item.latitude,
                        item.longitude
                    )
                    distance <= 100 // e.g., within 100 miles
                }
                Log.d("WildfireScreen", "Wildfire data size: ${wildfireData.size}")
            } ?: run {
                Log.e("WildfireScreen", "Failed to fetch or parse wildfire data")
            }
            isLoading = false
        }
    }


    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Active Wildfires") },
                navigationIcon = {
                    MenuButton(
                        onLogout = onLogout
                    )
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
                WildfireMap(
                    wildfireData = wildfireData,
                    userLocation = userLocation!!
                )
                // Wildfire List or No Data Message
                if (wildfireData.isEmpty()) {
                    Text(
                        "No wildfires found in your area.",
                        modifier = Modifier.padding(16.dp),
                        style = MaterialTheme.typography.bodyLarge
                    )
                } else {
                    WildfireList(wildfireData = wildfireData)
                }
            }
        }
    }
}

fun haversine(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
    val R = 3958.8 // Radius of Earth in miles
    val dLat = Math.toRadians(lat2 - lat1)
    val dLon = Math.toRadians(lon2 - lon1)
    val a =
        sin(dLat / 2).pow(2.0) + cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) * sin(dLon / 2).pow(
            2.0
        )
    val c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c
}

@SuppressLint("MissingPermission")
fun getUserLocation(
    fusedLocationClient: FusedLocationProviderClient,
    onLocationReceived: (Location) -> Unit
) {
    try {
        fusedLocationClient.lastLocation
            .addOnSuccessListener { location: Location? ->
                if (location != null) {
                    onLocationReceived(location)
                } else {
                    Log.e("WildfireScreen", "Location is null")
                }
            }
            .addOnFailureListener { exception ->
                Log.e("WildfireScreen", "Failed to get location", exception)
            }
    } catch (e: SecurityException) {
        Log.e("WildfireScreen", "Location permission not granted", e)
    }
}

@Composable
fun WildfireMap(wildfireData: List<WildfireDataItem>, userLocation: Location) {
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(
            LatLng(userLocation.latitude, userLocation.longitude),
            5f
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

        // Wildfire markers
        wildfireData.forEach { item ->
            val latitude = item.latitude
            val longitude = item.longitude

            Marker(
                state = MarkerState(position = LatLng(latitude, longitude)),
                title = "Wildfire",
                snippet = "Brightness: ${item.brightTi4}",
                icon = BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED)
            )
        }
    }
}

@Composable
fun WildfireList(wildfireData: List<WildfireDataItem>) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
    ) {
        items(wildfireData) { item ->
            WildfireItem(item = item)
        }
    }
}

@Composable
fun WildfireItem(item: WildfireDataItem) {
    val latitude = item.latitude
    val longitude = item.longitude

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(4.dp),
        tonalElevation = 2.dp
    ) {
        Column(modifier = Modifier.padding(8.dp)) {
            Text(
                text = "Location: (${latitude.format(4)}, ${longitude.format(4)})",
                style = MaterialTheme.typography.titleMedium
            )
            Text(text = "Brightness: ${item.brightTi4}")
            Text(text = "Acquired: ${item.acqDate} ${item.acqTime}")
            Text(text = "Satellite: ${item.satellite}")
            Text(text = "Confidence: ${item.confidence}")
        }
    }
}

fun Double.format(digits: Int) = "%.${digits}f".format(this)


