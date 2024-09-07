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
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.core.app.ActivityCompat
import com.example.basic2.ui.theme.Basic2Theme
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.tasks.Task

class MainActivity : ComponentActivity() {
    private lateinit var fusedLocationClient: FusedLocationProviderClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Initialize FusedLocationProviderClient
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        setContent {
            Basic2Theme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    ReportButton(
                        modifier = Modifier
                            .padding(innerPadding)
                            .fillMaxSize(),
                        fusedLocationClient = fusedLocationClient
                    )
                }
            }
        }
    }
}

@Composable
fun ReportButton(
    modifier: Modifier = Modifier,
    fusedLocationClient: FusedLocationProviderClient
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
                location = lat to lon
            }
        } else {
            Log.e("Permission", "Location permission denied")
        }
    }

    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier
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
                    location = lat to lon
                }
            }
            showDialog = true
        }) {
            Text(text = "Send Report")
        }
    }

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
fun ReportButtonPreview() {
    Basic2Theme {
        ReportButton(fusedLocationClient = LocationServices.getFusedLocationProviderClient(LocalContext.current))
    }
}