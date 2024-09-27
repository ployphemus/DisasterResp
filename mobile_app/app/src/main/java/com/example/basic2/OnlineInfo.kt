package com.example.basic2

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OnlineInfo(navController: NavHostController) {
    val coroutineScope = rememberCoroutineScope()
    var streamData by remember { mutableStateOf<List<TimeSeries>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    // Fetch data when the composable is first displayed
    LaunchedEffect(Unit) {
        coroutineScope.launch {
            val response = getUSGSStreamHeight(
                centerLat = 40.7128,  // Replace with user's current latitude if available
                centerLon = -74.0060, // Replace with user's current longitude if available
                radiusInMiles = 25.0  // Adjust radius as needed
            )
            response?.let {
                streamData = it.value.timeSeries
            }
            isLoading = false
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
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
            ) {
                items(streamData) { item ->
                    StreamMonitorItem(timeSeries = item)
                }
            }
        }
    }
}

@Composable
fun StreamMonitorItem(timeSeries: TimeSeries) {
    val siteName = timeSeries.sourceInfo.siteName
    val siteCode = timeSeries.sourceInfo.siteCode.firstOrNull()?.value ?: "N/A"
    val latitude = timeSeries.sourceInfo.geoLocation.geogLocation.latitude
    val longitude = timeSeries.sourceInfo.geoLocation.geogLocation.longitude
    val latestMeasurement = timeSeries.values.firstOrNull()?.measurements?.lastOrNull()
    val gageHeight = latestMeasurement?.value?.toDoubleOrNull() ?: 0.0

    // Determine flood stage and corresponding color
    val (floodStage, color) = getFloodStageAndColor(gageHeight)

    Surface(
        color = color,
        modifier = Modifier
            .fillMaxWidth()
            .padding(4.dp),
        tonalElevation = 2.dp
    ) {
        Column(modifier = Modifier.padding(8.dp)) {
            Text(text = siteName, style = MaterialTheme.typography.titleMedium)
            Text(text = "Site Code: $siteCode")
            Text(text = "Location: ($latitude, $longitude)")
            Text(text = "Gage Height: $gageHeight ft")
            Text(text = "Flood Stage: $floodStage")
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
