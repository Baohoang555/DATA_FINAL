import { useState } from "react"
import axios from "axios"

const API = "http://localhost:8000"

const FILTERS = ["Country", "City", "Year", "Season", "Metric"]

export default function OLAPViewer() {
  const [active, setActive]   = useState("Country")
  const [data,   setData]     = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchData = () => {
    setLoading(true)
    axios.get(`${API}/olap/slice?year=2024`)
      .then(r => setData(r.data))
      .catch(() => setData([
        { country: "Vietnam",       city: "Hanoi",    avg_aqi: 154, season: "Summer" },
        { country: "Vietnam",       city: "HCMC",     avg_aqi: 89,  season: "Summer" },
        { country: "China",         city: "Beijing",  avg_aqi: 210, season: "Summer" },
        { country: "India",         city: "Delhi",    avg_aqi: 280, season: "Summer" },
        { country: "United States", city: "New York", avg_aqi: 45,  season: "Summer" },
      ]))
      .finally(() => setLoading(false))
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "calc(100vh - 48px)" }}>

      {/* Filter bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#1A1D27", borderRadius: 12, padding: "12px 20px",
        border: "1px solid #2A2D3A"
      }}>
        <div style={{ display: "flex", gap: 8 }}>
          {FILTERS.map(f => (
            <div key={f}
              onClick={() => setActive(f)}
              style={{
                padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13,
                background: active === f ? "#4F8EF7" : "#0F1117",
                color: active === f ? "white" : "#8B8FA8",
                border: "1px solid #2A2D3A",
              }}>
              {f}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={fetchData}
            style={{
              background: "#4F8EF7", border: "none", borderRadius: 8,
              padding: "8px 16px", color: "white", cursor: "pointer", fontSize: 13
            }}>
            Load Data
          </button>
          <button
            onClick={() => {
              if (!data) return
              const csv = ["country,city,avg_aqi,season",
                ...data.map(r => `${r.country},${r.city},${r.avg_aqi},${r.season}`)
              ].join("\n")
              const a = document.createElement("a")
              a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
              a.download = "olap_data.csv"
              a.click()
            }}
            style={{
              background: "#2A2D3A", border: "1px solid #3A3D4A", borderRadius: 8,
              padding: "8px 16px", color: "white", cursor: "pointer", fontSize: 13
            }}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Pivot Table */}
      <div style={{
        background: "#1A1D27", borderRadius: 12, padding: 20,
        border: "1px solid #2A2D3A", flex: 1
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Pivot Table Data</div>
        {loading ? (
          <div style={{ color: "#8B8FA8" }}>Loading...</div>
        ) : data ? (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2A2D3A" }}>
                {["Country", "City", "Avg AQI", "Season"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#8B8FA8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1A1D27" }}>
                  <td style={{ padding: "10px 12px" }}>{row.country}</td>
                  <td style={{ padding: "10px 12px" }}>{row.city}</td>
                  <td style={{ padding: "10px 12px", color: row.avg_aqi > 150 ? "#FF7E00" : "#00E400", fontWeight: 600 }}>
                    {row.avg_aqi}
                  </td>
                  <td style={{ padding: "10px 12px", color: "#8B8FA8" }}>{row.season}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: "#8B8FA8", fontSize: 13 }}>Click "Load Data" để xem dữ liệu</div>
        )}
      </div>

      {/* Drilldown Chart placeholder */}
      <div style={{
        background: "#1A1D27", borderRadius: 12, padding: 20,
        border: "1px solid #2A2D3A", height: 160
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Drilldown Chart</div>
        <div style={{
          height: 100, background: "#0F1117", borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#8B8FA8", fontSize: 13
        }}>
          [ Click vào row trong bảng để drilldown ]
        </div>
      </div>

    </div>
  )
}