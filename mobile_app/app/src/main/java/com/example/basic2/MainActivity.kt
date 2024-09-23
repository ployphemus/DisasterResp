package com.example.basic2

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.core.app.ActivityCompat
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.basic2.ui.theme.Basic2Theme
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.Marker
import com.google.maps.android.compose.MarkerState
import com.google.maps.android.compose.*
import com.google.android.gms.tasks.Task

class MainActivity : ComponentActivity() {
    private lateinit var fusedLocationClient: FusedLocationProviderClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Initialize FusedLocationProviderClient
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        val deepRed = Color(0xFFE69A94)
        val vividOrange = Color(0xFFF6B7AA)
        val lightPeach = Color(0xFFF7CDBE)
        val palePink = Color(0xFFEEC6C7)
        val duskyPurple = Color(0xFFD19EAF)
        val darkMaroon = Color(0xFFB27E91)
        setContent {
            Basic2Theme {
                // Adjust for system bars and draw border within the safe area
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(WindowInsets.systemBars.asPaddingValues()) // Adjust for system bars
                        .border(
                            width = 15.dp,
                            brush = Brush.linearGradient(
                                colors = listOf(deepRed, palePink, darkMaroon),
                                start = Offset.Zero,
                                end = Offset.Infinite
                            ),
                            shape = RectangleShape
                        )
                        .padding(10.dp) // Padding to prevent content overlap with the border
                ) {
                    val navController = rememberNavController()
                    AppWithPhoneNumberDialog(
                        navController = navController,
                        fusedLocationClient = fusedLocationClient
                    )
                }
            }
        }
    }
}
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppWithPhoneNumberDialog(
    navController: NavHostController,
    fusedLocationClient: FusedLocationProviderClient
) {
    var phoneNumber by remember { mutableStateOf("") }
    var showDialog by remember { mutableStateOf(true) }
    var location by remember { mutableStateOf<Pair<Double, Double>?>(null) }
    val context = LocalContext.current

    // Location request function
    fun requestLocation() {
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
            ActivityCompat.requestPermissions(
                (context as ComponentActivity),
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                1
            )
        } else {
            // Fetch location
            fusedLocationClient.lastLocation.addOnSuccessListener { locationResult ->
                locationResult?.let {
                    location = Pair(it.latitude, it.longitude)
                }
            }
        }
    }

    // Launch location request after dialog is dismissed
    LaunchedEffect(showDialog) {
        if (!showDialog) {
            requestLocation()
        }
    }

    if (showDialog) {
        PhoneNumberDialog(
            onDismiss = { showDialog = false },
            onSave = { input ->
                phoneNumber = input
                showDialog = false
            }
        )
    }

    // Main app navigation after the dialog
    NavHost(navController = navController, startDestination = "reportScreen") {
        composable("reportScreen") {
            ReportScreen(navController = navController, location = location, fusedLocationClient = fusedLocationClient)
        }
        composable("OnlineInfo") {
            OnlineInfo(navController = navController)
        }
    }
}

@Composable
fun PhoneNumberDialog(onDismiss: () -> Unit, onSave: (String) -> Unit) {
    var phoneNumberInput by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Enter your Phone Number") },
        text = {
            Column {
                Text("Please enter your phone number:")
                Spacer(modifier = Modifier.height(8.dp))
                TextField(
                    value = phoneNumberInput,
                    onValueChange = { phoneNumberInput = it },
                    placeholder = { Text("Phone Number") }
                )
            }
        },
        confirmButton = {
            Button(onClick = {
                onSave(phoneNumberInput)
            }) {
                Text("Save")
            }
        },
        dismissButton = {
            Button(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportScreen(
    navController: NavHostController,
    fusedLocationClient: FusedLocationProviderClient,
    location: Pair<Double, Double>?
) {
    var showDialog by remember { mutableStateOf(false) }
    var reportText by remember { mutableStateOf("") }
    var location by remember { mutableStateOf<Pair<Double, Double>?>(null) }
    val context = LocalContext.current

    // Define the permission launcher inside the composable
    val requestPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            getLocation(fusedLocationClient) { lat, lon ->
                location = Pair(lat, lon) // Now location is mutable
            }
        } else {
            Log.e("Permission", "Location permission denied")
        }
    }

    // Camera position state for GoogleMap
    val cameraPositionState = rememberCameraPositionState()

    // Update the camera position when the location is available
    LaunchedEffect(location) {
        location?.let {
            cameraPositionState.position = CameraPosition.fromLatLngZoom(LatLng(it.first, it.second), 15f)
        }
    }

    Column(modifier = Modifier.fillMaxSize()) {
        // Top App Bar with Menu Button
        TopAppBar(
            title = { Text("Report Screen") },
            actions = {
                MenuButton(navController = navController)
            }
        )

        // Google Map
        GoogleMap(
            modifier = Modifier
                .fillMaxWidth()
                .height(400.dp),
            cameraPositionState = cameraPositionState
        ) {
            location?.let {
                Marker(
                    state = MarkerState(position = LatLng(it.first, it.second)),
                    title = "Your Location"
                )
            }
        }

        Text(
            text = "Please use the report button to send an incident report to the response team. This is for reporting things like downed trees and powerlines" +
                    ", washed out or flooded roads, and small brush fires. !!If you are in immediate danger or require medical help, CALL 911!!",
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            style = MaterialTheme.typography.bodyMedium
        )

        // Button at the bottom
        Spacer(modifier = Modifier.weight(1f)) // Pushes button to the bottom
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .fillMaxWidth()
                .padding(45.dp)
        ) {
            Button(onClick = {
                // Request location when button is clicked
                if (ActivityCompat.checkSelfPermission(
                        context,
                        Manifest.permission.ACCESS_FINE_LOCATION
                    ) != PackageManager.PERMISSION_GRANTED &&
                    ActivityCompat.checkSelfPermission(
                        context,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                    ) != PackageManager.PERMISSION_GRANTED
                ) {
                    // Launch permission request
                    requestPermissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
                } else {
                    // Permission already granted, get the location
                    getLocation(fusedLocationClient) { lat, lon ->
                        location = Pair(lat, lon) // Now location is mutable
                    }
                }
                showDialog = true
            }) {
                Text(text = "Send Report")
            }
        }

        // Display a dialog for report entry
        if (showDialog) {
            AlertDialog(
                onDismissRequest = { showDialog = false },
                title = { Text(text = "Enter Report") },
                text = {
                    Column {
                        Text("Please enter your report:")
                        Spacer(modifier = Modifier.height(8.dp))
                        TextField(
                            value = reportText,
                            onValueChange = { reportText = it },
                            label = { Text("Report") }
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        location?.let { (lat, lon) ->
                            Text("Current Location: Lat: $lat, Lon: $lon")
                        } ?: Text("Fetching location...")
                    }
                },
                confirmButton = {
                    Button(onClick = {
                        // Save reportText and location to use for API call
                        showDialog = false
                    }) {
                        Text("Submit")
                    }
                },
                dismissButton = {
                    Button(onClick = { showDialog = false }) {
                        Text("Cancel")
                    }
                }
            )
        }
    }
}


@Composable
fun MenuButton(navController: NavHostController) {
    var expanded by remember { mutableStateOf(false) }

    // Icon button for the overflow menu
    IconButton(onClick = { expanded = true }) {
        Icon(
            imageVector = Icons.Default.MoreVert,
            contentDescription = "Menu"
        )
    }

    // Dropdown menu that appears when the menu button is clicked
    DropdownMenu(
        expanded = expanded,
        onDismissRequest = { expanded = false }
    ) {
        DropdownMenuItem(
            text = { Text("Option 1") },
            onClick = {
                // Navigate to the new screen
                navController.navigate("OnlineInfo")
                expanded = false
            }
        )
        DropdownMenuItem(
            text = { Text("Option 2") },
            onClick = {
                expanded = false
            }
        )
    }
}

fun getLocation(
    fusedLocationClient: FusedLocationProviderClient,
    onLocationReceived: (Double, Double) -> Unit
) {
    try {
        val locationResult: Task<android.location.Location> =
            fusedLocationClient.lastLocation
        locationResult.addOnSuccessListener { location: android.location.Location? ->
            location?.let {
                onLocationReceived(it.latitude, it.longitude)
            }
        }
    } catch (e: SecurityException) {
        Log.e("MainActivity", "Location permission not granted", e)
    }
}

@Preview(showBackground = true)
@Composable
fun ReportScreenPreview() {
    Basic2Theme {
        val navController = rememberNavController()
        ReportScreen(navController = navController, location = null, fusedLocationClient = LocationServices.getFusedLocationProviderClient(LocalContext.current))
    }
}
