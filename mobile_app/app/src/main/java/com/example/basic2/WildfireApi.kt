package com.example.basic2

import android.util.Log
import io.ktor.http.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.okhttp.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.gson.*
import com.google.gson.annotations.SerializedName
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.bodyAsText
import io.ktor.http.isSuccess

suspend fun fetchWildfireCsvData(apiKey: String, date: String): String? {
    val layer = "VIIRS_SNPP_NRT"
    val areaType = "world"
    val area = "1"
    val buffer = "0"

    val url = "https://firms.modaps.eosdis.nasa.gov/api/area/csv/$apiKey/$layer/$areaType/$area/$buffer/$date"

    val client = HttpClient(OkHttp) {
        expectSuccess = false
    }

    return try {
        val response: HttpResponse = client.get(url) {
            headers {
                append(HttpHeaders.Accept, "text/plain")
            }
        }
        if (response.status.isSuccess()) {
            val csvData = response.bodyAsText()
            Log.d("WildfireApi", "CSV Data:\n$csvData")
            client.close()
            csvData
        } else {
            val errorBody = response.bodyAsText()
            Log.e("WildfireApi", "HTTP error: ${response.status}, Body: $errorBody")
            client.close()
            null
        }
    } catch (e: Exception) {
        Log.e("WildfireApi", "Exception during API call", e)
        client.close()
        null
    }
}

fun splitCsvLine(line: String): List<String> {
    val result = mutableListOf<String>()
    var current = StringBuilder()
    var inQuotes = false

    for (char in line) {
        when (char) {
            ',' -> {
                if (inQuotes) {
                    current.append(char)
                } else {
                    result.add(current.toString())
                    current = StringBuilder()
                }
            }
            '"' -> {
                inQuotes = !inQuotes
            }
            else -> {
                current.append(char)
            }
        }
    }
    result.add(current.toString())
    return result
}

fun parseWildfireCsvData(csvData: String): List<WildfireDataItem> {
    val lines = csvData.lines()
    if (lines.isEmpty()) {
        Log.e("WildfireApi", "CSV data is empty.")
        return emptyList()
    }

    // The first line contains headers
    val headers = lines.first().split(',')

    // Check if headers contain the expected fields
    val expectedHeaders = listOf(
        "latitude", "longitude", "bright_ti4", "scan", "track",
        "acq_date", "acq_time", "satellite", "instrument", "confidence",
        "version", "bright_ti5", "frp", "daynight"
    )

    val headerIndices = headers.mapIndexed { index, name -> name to index }.toMap()

    val missingHeaders = expectedHeaders.filter { it !in headerIndices.keys }
    if (missingHeaders.isNotEmpty()) {
        Log.e("WildfireApi", "Missing headers: $missingHeaders")
        return emptyList()
    }

    // Skip the header line and parse the rest
    val dataLines = lines.drop(1)

    val dataList = mutableListOf<WildfireDataItem>()

    for (line in dataLines) {
        // Skip empty lines
        if (line.trim().isEmpty()) continue

        // Split the line into fields
        val fields = splitCsvLine(line)

        // Check if the number of fields matches the number of headers
        if (fields.size != headers.size) {
            Log.e("WildfireApi", "Mismatch in number of fields. Expected ${headers.size}, got ${fields.size}. Line: $line")
            continue
        }

        try {
            val item = WildfireDataItem(
                latitude = fields[headerIndices["latitude"]!!].toDoubleOrNull() ?: 0.0,
                longitude = fields[headerIndices["longitude"]!!].toDoubleOrNull() ?: 0.0,
                brightTi4 = fields[headerIndices["bright_ti4"]!!].toDoubleOrNull(),
                scan = fields[headerIndices["scan"]!!].toDoubleOrNull(),
                track = fields[headerIndices["track"]!!].toDoubleOrNull(),
                acqDate = fields[headerIndices["acq_date"]!!],
                acqTime = fields[headerIndices["acq_time"]!!],
                satellite = fields[headerIndices["satellite"]!!],
                instrument = fields[headerIndices["instrument"]!!],
                confidence = fields[headerIndices["confidence"]!!],
                version = fields[headerIndices["version"]!!],
                brightTi5 = fields[headerIndices["bright_ti5"]!!].toDoubleOrNull(),
                frp = fields[headerIndices["frp"]!!].toDoubleOrNull(),
                daynight = fields[headerIndices["daynight"]!!]
            )
            dataList.add(item)
        } catch (e: Exception) {
            Log.e("WildfireApi", "Error parsing line: $line", e)
            continue
        }
    }

    return dataList
}

data class WildfireDataItem(
    val latitude: Double,
    val longitude: Double,
    val brightTi4: Double?,
    val scan: Double?,
    val track: Double?,
    val acqDate: String,
    val acqTime: String,
    val satellite: String,
    val instrument: String,
    val confidence: String?,
    val version: String?,
    val brightTi5: Double?,
    val frp: Double?,
    val daynight: String
)
