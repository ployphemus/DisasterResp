package com.example.basic2

import io.ktor.client.*
import io.ktor.client.call.body
import io.ktor.client.engine.okhttp.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.gson.*
import com.google.gson.annotations.SerializedName
import kotlin.math.*

suspend fun getEarthquakes(): EarthquakeResponse? {
    // URL for earthquakes over magnitude 3 in the past day
    val url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson"

    // Create Ktor client
    val client = HttpClient(OkHttp) {
        install(ContentNegotiation) {
            gson()
        }
    }

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

fun haversine(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
    val R = 3958.8 // Radius of Earth in miles
    val dLat = Math.toRadians(lat2 - lat1)
    val dLon = Math.toRadians(lon2 - lon1)
    val a = sin(dLat / 2).pow(2.0) + cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) * sin(dLon / 2).pow(2.0)
    val c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c
}

data class EarthquakeResponse(
    @SerializedName("type") val type: String,
    @SerializedName("metadata") val metadata: Metadata,
    @SerializedName("features") val features: List<Feature>
)

data class Metadata(
    @SerializedName("generated") val generated: Long,
    @SerializedName("url") val url: String,
    @SerializedName("title") val title: String,
    @SerializedName("status") val status: Int,
    @SerializedName("api") val api: String,
    @SerializedName("count") val count: Int
)

data class Feature(
    @SerializedName("type") val type: String,
    @SerializedName("properties") val properties: Properties,
    @SerializedName("geometry") val geometry: Geometry,
    @SerializedName("id") val id: String
)

data class Properties(
    @SerializedName("mag") val mag: Double?,
    @SerializedName("place") val place: String?,
    @SerializedName("time") val time: Long,
    @SerializedName("updated") val updated: Long,
    @SerializedName("tz") val tz: Int?,
    @SerializedName("url") val url: String,
    @SerializedName("detail") val detail: String,
    @SerializedName("felt") val felt: Int?,
    @SerializedName("cdi") val cdi: Double?,
    @SerializedName("mmi") val mmi: Double?,
    @SerializedName("alert") val alert: String?,
    @SerializedName("status") val status: String,
    @SerializedName("tsunami") val tsunami: Int,
    @SerializedName("sig") val sig: Int,
    @SerializedName("net") val net: String,
    @SerializedName("code") val code: String,
    @SerializedName("ids") val ids: String,
    @SerializedName("sources") val sources: String,
    @SerializedName("types") val types: String,
    @SerializedName("nst") val nst: Int?,
    @SerializedName("dmin") val dmin: Double?,
    @SerializedName("rms") val rms: Double?,
    @SerializedName("gap") val gap: Double?,
    @SerializedName("magType") val magType: String,
    @SerializedName("type") val type: String,
    @SerializedName("title") val title: String
)

data class Geometry(
    @SerializedName("type") val type: String,
    @SerializedName("coordinates") val coordinates: List<Double>
)
