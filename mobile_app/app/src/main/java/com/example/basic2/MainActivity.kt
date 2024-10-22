package com.example.basic2

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.net.Uri
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.unit.dp
import androidx.core.app.ActivityCompat
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.basic2.ui.theme.Basic2Theme
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.okhttp.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.cookies.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.gson.*
import com.google.gson.JsonParser
import com.google.gson.annotations.SerializedName
import io.ktor.client.plugins.defaultRequest
import kotlinx.coroutines.launch

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
                val deepRed = Color(0xFFEE5C51)
                val vividOrange = Color(0xFFF3A594)
                val lightPeach = Color(0xFFF7CDBE)
                val palePink = Color(0xFFEEC6C7)
                val duskyPurple = Color(0xFFD19EAF)
                val darkMaroon = Color(0xFFAF637F)

                // Adjust for system bars and apply the custom gradient border
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .systemBarsPadding()
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
                        .padding(10.dp)
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
        NavHost(navController = navController, startDestination = "ShelterListScreen") {
            composable("ShelterListScreen") {
                ShelterListScreen(
                    navController = navController,
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ShelterListScreen(
    navController: NavHostController,
    fusedLocationClient: FusedLocationProviderClient
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var shelters by remember { mutableStateOf<List<Shelter>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var disasterZones by remember { mutableStateOf<List<DisasterZone>>(emptyList()) }
    var userLocation by remember { mutableStateOf<Location?>(null) }

    // Fetch shelters and disaster zones when the composable is first displayed
    LaunchedEffect(Unit) {
        coroutineScope.launch {
            // Fetch user's location
            val fetchedShelters = fetchShelters()
            val fetchedZones = fetchDisasterZones()
            fetchedShelters?.let { shelters = it }
            fetchedZones?.let { disasterZones = it }
            getUserLocation(fusedLocationClient) { location ->
                userLocation = location

                // Fetch shelters and disaster zones
//                val fetchedShelters = fetchShelters()
//                val fetchedZones = fetchDisasterZones()
//                fetchedShelters?.let { shelters = it }
//                fetchedZones?.let { disasterZones = it }

                isLoading = false
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Available Shelters") },
                navigationIcon = {
                    MenuButton(navController = navController)
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
            Column(modifier = Modifier.padding(paddingValues)) {
                // Map
                ShelterMap(
                    shelters = shelters,
                    disasterZones = disasterZones,
                    userLocation = userLocation!!
                )
                // Shelter List
                ShelterList(shelters = shelters)
            }
        }
    }
}

@Composable
fun ShelterMap(
    shelters: List<Shelter>,
    disasterZones: List<DisasterZone>,
    userLocation: Location
) {
    val context = LocalContext.current
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

        // Markers for shelters
        shelters.forEach { shelter ->
            Marker(
                state = MarkerState(position = LatLng(shelter.latitude, shelter.longitude)),
                title = shelter.name,
                snippet = "Capacity: ${shelter.currentCapacity}/${shelter.maximumCapacity}",
                onClick = {
                    // Open Google Maps directions when marker is tapped
                    val gmmIntentUri = Uri.parse("google.navigation:q=${shelter.latitude},${shelter.longitude}")
                    val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
                    mapIntent.setPackage("com.google.android.apps.maps")
                    mapIntent.resolveActivity(context.packageManager)?.let {
                        context.startActivity(mapIntent)
                    }
                    true
                }
            )
        }

        // Circles for disaster zones
        disasterZones.forEach { zone ->
            Circle(
                center = LatLng(zone.latitude, zone.longitude),
                radius = zone.radius * 1609.34, // Convert miles to meters
                strokeColor = Color(android.graphics.Color.parseColor("#${zone.hexColor}")),
                fillColor = Color(android.graphics.Color.parseColor("#${zone.hexColor}")).copy(alpha = 0.35f),
                strokeWidth = 2f
            )
        }
    }
}

@Composable
fun ShelterList(shelters: List<Shelter>) {
    LazyColumn {
        items(shelters) { shelter ->
            ShelterListItem(shelter = shelter)
        }
    }
}

@Composable
fun ShelterListItem(shelter: Shelter) {
    val context = LocalContext.current
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(4.dp)
            .clickable {
                // Open Google Maps directions
                val gmmIntentUri = Uri.parse("google.navigation:q=${shelter.latitude},${shelter.longitude}")
                val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
                mapIntent.setPackage("com.google.android.apps.maps")
                mapIntent.resolveActivity(context.packageManager)?.let {
                    context.startActivity(mapIntent)
                }
            },
        tonalElevation = 2.dp
    ) {
        Column(modifier = Modifier.padding(8.dp)) {
            Text(text = shelter.name, style = MaterialTheme.typography.titleMedium)
            Text(text = "Capacity: ${shelter.currentCapacity}/${shelter.maximumCapacity}")
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

suspend fun performLogin(username: String, password: String): Boolean {
    try {
        val client = HttpClient(OkHttp) {
            install(ContentNegotiation) {
                gson()
            }
            install(HttpCookies) {
                storage = AcceptAllCookiesStorage()
            }

            expectSuccess = false
            defaultRequest {
                headers.append(HttpHeaders.Accept, "application/json")
            }
        }

        val serverIp = "192.168.56.1" // Replace with your server's IP
        val response: HttpResponse = client.submitForm(
            url = "http://$serverIp:8000/auth/login",
            formParameters = Parameters.build {
                append("Email", username)
                append("Password", password)
            },
            encodeInQuery = false
        )

        val responseBody = response.bodyAsText()
        println("Response status: ${response.status}")
        println("Response body: $responseBody")

        client.close()

        val jsonResponse = JsonParser.parseString(responseBody).asJsonObject
        val success = jsonResponse.get("success").asBoolean

        return success
    } catch (e: Exception) {
        e.printStackTrace()
        return false
    }
}

//@SuppressLint("MissingPermission")
//fun getUserLocation(
//    fusedLocationClient: FusedLocationProviderClient,
//    onLocationReceived: (Location) -> Unit
//) {
//    try {
//        fusedLocationClient.lastLocation
//            .addOnSuccessListener { location: Location? ->
//                location?.let {
//                    onLocationReceived(it)
//                } ?: run {
//                    Log.e("MainActivity", "Location is null")
//                }
//            }
//            .addOnFailureListener { exception ->
//                Log.e("MainActivity", "Failed to get location", exception)
//            }
//    } catch (e: SecurityException) {
//        Log.e("MainActivity", "Location permission not granted", e)
//    }
//}

suspend fun fetchShelters(): List<Shelter>? {
    val client = HttpClient(OkHttp) {
        install(ContentNegotiation) {
            gson()
        }
    }
    return try {
        val serverIp = "http://yourserver.com" // Replace with your server's address
        val shelters: List<Shelter> = client.get("$serverIp/shelters/all").body()
        shelters
    } catch (e: Exception) {
        e.printStackTrace()
        null
    } finally {
        client.close()
    }
}

suspend fun fetchDisasterZones(): List<DisasterZone>? {
    val client = HttpClient(OkHttp) {
        install(ContentNegotiation) {
            gson()
        }
    }
    return try {
        val serverIp = "http://yourserver.com" // Replace with your server's address
        val disasterZones: List<DisasterZone> = client.get("$serverIp/disasterzone/all").body()
        disasterZones
    } catch (e: Exception) {
        e.printStackTrace()
        null
    } finally {
        client.close()
    }
}

// Shelter data class
data class Shelter(
    @SerializedName("Name") val name: String,
    @SerializedName("Latitude") val latitude: Double,
    @SerializedName("Longitude") val longitude: Double,
    @SerializedName("Maximum_Capacity") val maximumCapacity: Int,
    @SerializedName("Current_Capacity") val currentCapacity: Int
)

// Disaster zone data class
data class DisasterZone(
    @SerializedName("Name") val name: String,
    @SerializedName("Latitude") val latitude: Double,
    @SerializedName("Longitude") val longitude: Double,
    @SerializedName("Radius") val radius: Double, // in miles
    @SerializedName("HexColor") val hexColor: String
)
