import { useEffect, useState } from "react"
import axios from "axios"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

const API = "http://localhost:8000"

const CITIES = [
  { name: "Hanoi",          lat: 21.0285, lng: 105.8542 },
  { name: "Ho Chi Minh City", lat: 10.8231, lng: 106.6297 },
  { name: "Da Nang",        lat: 16.0544, lng: 108.2022 },
  { name: "Bangkok",        lat: 13.7563, lng: 100.5018 },
  { name: "Beijing",        lat: 39.9042, lng: 116.4074 },
  { name: "Delhi",          lat: 28.6139, lng: 77.2090  },
  { name: "Tokyo",          lat: 35.6762, lng: 139.6503 },
  { name: "Seoul",          lat: 37.5665, lng: 126.9780 },
  { name: "Jakarta",        lat: -6.2088, lng: 106.8456 },
  { name: "Mumbai",         lat: 19.0760, lng: 72.8777  },
]

const AQI_LEGEND = [
  { label: "Good",           color: "#00E400", range: "0-50"   },
  { label: "Satisfactory",   color: "#92D050", range: "51-100" },
  { label: "Moderate",       color: "#FFFF00", range: "101-150"},
  { label: "Unhealthy",      color: "#FF7E00", range: "151-200"},
  { label: "Very Unhealthy", color: "#FF0000", range: "201-300"},
  { label: "Hazardous",      color: "#7E0023", range: "300+"   },
]

const getColor = (pm25) => {
  if (!pm25)      return "#888"
  if (pm25 <= 12) return "#00E400"
  if (pm25 <= 35) return "#92D050"
  if (pm25 <= 55) return "#FFFF00"
  if (pm25 <= 150)return "#FF7E00"
  if (pm25 <= 250)return "#FF0000"
  return "#7E0023"
}

const getLabel = (pm25) => {
  if (!pm25)      return "N/A"
  if (pm25 <= 12) return "Good"
  if (pm25 <= 35) return "Satisfactory"
  if (pm25 <= 55) return "Moderate"
  if (pm25 <= 150)return "Unhealthy"
  if (pm25 <= 250)return "Very Unhealthy"
  return "Hazardous"
}

export default function MapAQI() {
  const [cityData, setCityData] = useState({})
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all(
      CITIES.map(city =>
        axios.get(`${API}/current/${city}`)
          .then(r => ({ city, data: r.data?.data || r.data })) 
          .catch(() => ({ city, data: null }))
      )
    ).then(results => {
      const map = {}
      results.forEach(({ name, data }) => { map[name] = data })
      setCityData(map)
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 48px)" }}>

      {/* Map */}
      <div style={{ flex: 1, borderRadius: 12, overflow: "hidden", border: "1px solid #2A2D3A" }}>
        <MapContainer
          center={[20, 100]} zoom={4}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          {CITIES.map(city => {
            const d = cityData[city.name]
            const color = getColor(d?.pm25)
            return (
              <CircleMarker
                key={city.name}
                center={[city.lat, city.lng]}
                radius={14}
                pathOptions={{ color: "white", fillColor: color, fillOpacity: 0.9, weight: 2 }}
              >
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    <b>{city.name}</b><br />
                    PM2.5: <b>{d?.pm25 ?? "N/A"} μg/m³</b><br />
                    PM10: {d?.pm10 ?? "N/A"} μg/m³<br />
                    NO₂: {d?.no2 ?? "N/A"} μg/m³<br />
                    Humidity: {d?.humidity ?? "N/A"}%<br />
                    Temp: {d?.temp ?? "N/A"}°C<br />
                    <span style={{
                      display: "inline-block", marginTop: 6,
                      padding: "2px 8px", borderRadius: 4,
                      background: color, color: "#000", fontSize: 12, fontWeight: 700
                    }}>{getLabel(d?.pm25)}</span>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>

      {/* Right panel */}
      <div style={{
        width: 220, background: "#1A1D27", borderRadius: 12,
        border: "1px solid #2A2D3A", padding: 20,
        display: "flex", flexDirection: "column", gap: 20, overflowY: "auto"
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
            {loading ? "Loading..." : `${CITIES.length} trạm`}
          </div>
          {CITIES.map(city => {
            const d = cityData[city.name]
            const color = getColor(d?.pm25)
            return (
              <div key={city.name} style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "6px 0",
                borderBottom: "1px solid #2A2D3A"
              }}>
                <span style={{ fontSize: 12 }}>{city.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color }}>
                  {d?.pm25 ?? "..."}
                </span>
              </div>
            )
          })}
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>AQI Legend</div>
          {AQI_LEGEND.map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
              <div style={{ fontSize: 12 }}>
                <div style={{ color: "white" }}>{l.label}</div>
                <div style={{ color: "#8B8FA8" }}>{l.range}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}