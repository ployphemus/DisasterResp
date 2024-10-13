

package com.example.basic2

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.okhttp.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.gson.*
import com.google.gson.annotations.SerializedName

suspend fun getEarthquakeData(): EarthquakeResponse? {
    val client = HttpClient(OkHttp) {
        install(ContentNegotiation) {
            gson()
        }
    }

    // API endpoint with US bounding box and minimum magnitude
    val url = "https://earthquake.usgs.gov/fdsnws/event/1/query" +
            "?format=geojson" +
            "&minmagnitude=3" +
            "&minlatitude=24.0" +
            "&maxlatitude=49.0" +
            "&minlongitude=-125.0" +
            "&maxlongitude=-66.0"

    return try {
        val response: EarthquakeResponse = client.get(url).body()
        client.close()
        response
    } catch (e: Exception) {
        e.printStackTrace()
        client.close()
        null
    }
}

data class EarthquakeResponse(
    @SerializedName("features") val features: List<EarthquakeFeature>
)

data class EarthquakeFeature(
    @SerializedName("properties") val properties: EarthquakeProperties,
    @SerializedName("geometry") val geometry: EarthquakeGeometry
)

data class EarthquakeProperties(
    @SerializedName("mag") val magnitude: Double?,
    @SerializedName("place") val place: String,
    @SerializedName("time") val time: Long
)

data class EarthquakeGeometry(
    @SerializedName("coordinates") val coordinates: List<Double>
)
