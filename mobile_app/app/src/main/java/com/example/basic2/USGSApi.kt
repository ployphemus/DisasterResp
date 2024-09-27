package com.example.basic2

import io.ktor.client.*
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.gson.*
import com.google.gson.annotations.SerializedName
import kotlin.math.cos
import kotlin.math.pow
import kotlin.math.round
import kotlin.math.PI

fun toRadians(deg: Double): Double = deg / 180.0 * PI

suspend fun getUSGSStreamHeight(
    centerLat: Double,
    centerLon: Double,
    radiusInMiles: Double

): USGSResponse? {
    // Convert radius from miles to degrees latitude
    val deltaLat = radiusInMiles / 69.0 // Approximately 69 miles per degree latitude

    // Convert radius from miles to degrees longitude, adjusting for latitude
    val deltaLon = radiusInMiles / (69.0 * cos(toRadians(centerLat)))

    // Calculate bounding box
    val minLat = centerLat - deltaLat
    val maxLat = centerLat + deltaLat
    val minLon = centerLon - deltaLon
    val maxLon = centerLon + deltaLon

    // Round latitudes and longitudes to 5 decimal places
    val precision = 5
    val factor = 10.0.pow(precision.toDouble())

    val minLatRounded = round(minLat * factor) / factor
    val maxLatRounded = round(maxLat * factor) / factor
    val minLonRounded = round(minLon * factor) / factor
    val maxLonRounded = round(maxLon * factor) / factor

    // USGS parameter code for gage height (stream height)
    val parameterCd = "00065,91110,91111"

    // Construct the API URL with rounded coordinates
    val url =
        "https://waterservices.usgs.gov/nwis/iv/?format=json&parameterCd=$parameterCd&bBox=$minLonRounded,$minLatRounded,$maxLonRounded,$maxLatRounded"

    // Create Ktor client
    val client = HttpClient(OkHttp) {
        install(ContentNegotiation) {
            gson()
        }
    }

    return try {
        // Make the API request
        val response: USGSResponse = client.get(url).body()
        client.close()
        response
    } catch (e: Exception) {
        e.printStackTrace()
        client.close()
        null
    }
}

// Data classes
data class USGSResponse(
    @SerializedName("value") val value: USGSValue
)

data class USGSValue(
    @SerializedName("timeSeries") val timeSeries: List<TimeSeries>
)

data class TimeSeries(
    @SerializedName("sourceInfo") val sourceInfo: SourceInfo,
    @SerializedName("values") val values: List<Values>
)

data class SourceInfo(
    @SerializedName("siteName") val siteName: String,
    @SerializedName("siteCode") val siteCode: List<SiteCode>,
    @SerializedName("geoLocation") val geoLocation: GeoLocation
)

data class SiteCode(
    @SerializedName("value") val value: String
)

data class GeoLocation(
    @SerializedName("geogLocation") val geogLocation: GeogLocation
)

data class GeogLocation(
    @SerializedName("latitude") val latitude: Double,
    @SerializedName("longitude") val longitude: Double
)

data class Values(
    @SerializedName("value") val measurements: List<Measurement>
)

data class Measurement(
    @SerializedName("dateTime") val dateTime: String,
    @SerializedName("value") val value: String
)
