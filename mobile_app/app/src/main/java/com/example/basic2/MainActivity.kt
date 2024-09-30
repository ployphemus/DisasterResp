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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.*
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.PasswordVisualTransformation
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
import com.google.maps.android.compose.*
import com.google.android.gms.tasks.Task
import io.ktor.client.*
import io.ktor.client.engine.okhttp.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.cookies.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.gson.*
import com.google.gson.JsonParser
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.gson.*
import kotlinx.coroutines.launch
import io.ktor.client.call.body
import io.ktor.client.request.forms.submitForm
const val IS_DEVELOPMENT = true

class MainActivity : ComponentActivity() {
    private lateinit var fusedLocationClient: FusedLocationProviderClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Initialize FusedLocationProviderClient
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        setContent {
            Basic2Theme {
                // Define your custom colors
                val deepRed = Color(0xFFE69A94)
                val vividOrange = Color(0xFFF6B7AA)
                val lightPeach = Color(0xFFF7CDBE)
                val palePink = Color(0xFFEEC6C7)
                val duskyPurple = Color(0xFFD19EAF)
                val darkMaroon = Color(0xFFB27E91)

                // Adjust for system bars and apply the custom gradient border
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .systemBarsPadding() // Adjusts for the status and navigation bars
                        .border(
                            width = 10.dp,
                            brush = Brush.linearGradient(
                                colors = listOf(
                                    deepRed,
                                    vividOrange,
                                    lightPeach,
                                    palePink,
                                    duskyPurple,
                                    darkMaroon
                                ),
                                start = Offset.Zero,
                                end = Offset.Infinite
                            ),
                            shape = RectangleShape
                        )
                        .padding(10.dp) // Padding to prevent content overlap with the border
                ) {
                    val navController = rememberNavController()
                    AppWithLoginDialog(
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
fun AppWithLoginDialog(
    navController: NavHostController,
    fusedLocationClient: FusedLocationProviderClient
) {
    var showDialog by remember { mutableStateOf(true) }
    val context = LocalContext.current

    if (showDialog) {
        LoginDialog(
            onDismiss = { /* Handle dismiss if necessary */ },
            onLoginSuccess = { showDialog = false }
        )
    }

    if (!showDialog) {
        // Main app content
        NavHost(navController = navController, startDestination = "reportScreen") {
            composable("reportScreen") {
                ReportScreen(
                    navController = navController,
                    location = null,
                    fusedLocationClient = fusedLocationClient
                )
            }
            composable("OnlineInfo") {
                OnlineInfo(navController = navController)
            }
            composable("EQinfo") {
                EQinfo(navController = navController)
            }
            composable("WildfireScreen") {
                WildfireScreen(navController = navController)
            }
        }
    }
}
@Composable
fun LoginDialog(
    onDismiss: () -> Unit,
    onLoginSuccess: () -> Unit
) {
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val context = LocalContext.current

    // Coroutine scope for network operations
    val coroutineScope = rememberCoroutineScope()

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Login") },
        text = {
            Column {
                TextField(
                    value = username,
                    onValueChange = { username = it },
                    label = { Text("Username") },
                    singleLine = true
                )
                Spacer(modifier = Modifier.height(8.dp))
                TextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Password") },
                    visualTransformation = PasswordVisualTransformation(),
                    singleLine = true
                )
                if (errorMessage != null) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = errorMessage!!,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    isLoading = true
                    errorMessage = null
                    coroutineScope.launch {
                        val success = performLogin(username, password)
                        isLoading = false
                        if (success) {
                            onLoginSuccess()
                        } else {
                            errorMessage = "Invalid username or password."
                        }
                    }
                },
                enabled = !isLoading
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        color = Color.White,
                        modifier = Modifier.size(16.dp),
                        strokeWidth = 2.dp
                    )
                } else {
                    Text("Login")
                }
            }
        },
        dismissButton = {
            Button(
                onClick = onDismiss,
                enabled = !isLoading
            ) {
                Text("Cancel")
            }
        }
    )
}

data class LoginResponse(
    val status: String,
    val code: String
)

suspend fun performLogin(username: String, password: String): Boolean {
    if (IS_DEVELOPMENT) {
        // Hardcoded login credentials for development
        val hardcodedUsername = "devuser"
        val hardcodedPassword = "devpass"

        // Check if entered credentials match the hardcoded ones
        return (username == hardcodedUsername && password == hardcodedPassword)
    } else {
        // Existing production login logic
        return try {
            val client = HttpClient(OkHttp) {
                install(ContentNegotiation) {
                    gson()
                }
                install(HttpCookies) {
                    storage = AcceptAllCookiesStorage()
                }
                expectSuccess = false
            }

            val response: HttpResponse = client.submitForm(
                url = "http://127.0.0.1:8000/auth/login",
                formParameters = Parameters.build {
                    append("username", username)
                    append("password", password)
                }
            )

            client.close()

            val responseBody = response.bodyAsText()
            val jsonResponse = JsonParser.parseString(responseBody).asJsonObject
            val status = jsonResponse.get("status").asString

            status == "success"
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
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
            text = { Text("Local Flood Info") },
            onClick = {
                // Navigate to the new screen
                navController.navigate("OnlineInfo")
                expanded = false
            }
        )
        DropdownMenuItem(
            text = { Text("Earthquake Info") },
            onClick = {
                navController.navigate("EQinfo")
                expanded = false
            }
        )
        DropdownMenuItem(
            text = { Text("Wildfire Info") },
            onClick = {
                navController.navigate("WildfireScreen")
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
