import { useEffect, useState } from "react"
import axios from "axios"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts"

const API = "http://localhost:8000"

const KPICard = ({ label, value, color }) => (
  <div style={{
    background: "#1A1D27", borderRadius: 12, padding: "16px 20px",
    flex: 1, minWidth: 160, border: "1px solid #2A2D3A"
  }}>
    <div style={{ fontSize: 12, color: "#8B8FA8", marginBottom: 8 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color: color || "white" }}>{value ?? "..."}</div>
  </div>
)

const Card = ({ title, children, style }) => (
  <div style={{
    background: "#1A1D27", borderRadius: 12, padding: 20,
    border: "1px solid #2A2D3A", ...style
  }}>
    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>{title}</div>
    {children}
  </div>
)

const getAQIColor = (aqi) => {
  if (!aqi) return "white"
  if (aqi <= 50)  return "#00E400"
  if (aqi <= 100) return "#92D050"
  if (aqi <= 150) return "#FFFF00"
  if (aqi <= 200) return "#FF7E00"
  if (aqi <= 300) return "#FF0000"
  return "#7E0023"
}

const getAQILabel = (aqi) => {
  if (!aqi) return "N/A"
  if (aqi <= 50)  return "Good"
  if (aqi <= 100) return "Satisfactory"
  if (aqi <= 150) return "Moderate"
  if (aqi <= 200) return "Unhealthy"
  if (aqi <= 300) return "Very Unhealthy"
  return "Hazardous"
}

const CITIES = ["Hanoi", "Ho Chi Minh City", "Da Nang", "Bangkok", "Beijing", "Delhi", "Tokyo", "Seoul", "Jakarta", "Mumbai"]

// Mock data cho Biểu đồ xu hướng & Dự báo 24h
const trendData = [
  { time: 'T2', pm25: 45, pm10: 60, no2: 20 },
  { time: 'T3', pm25: 55, pm10: 75, no2: 25 },
  { time: 'T4', pm25: 80, pm10: 110, no2: 40 },
  { time: 'T5', pm25: 140, pm10: 180, no2: 50 },
  { time: 'T6', pm25: 65, pm10: 90, no2: 30 },
  { time: 'T7', pm25: 50, pm10: 70, no2: 22 },
  { time: 'CN', pm25: 40, pm10: 55, no2: 18 },
  { time: '+24h', pm25: 48, pm10: 65, no2: 21, isForecast: true },
]

export default function Dashboard() {
  const [cityData, setCityData] = useState({})
  const [loading,  setLoading]  = useState(true)
  const [selected, setSelected] = useState("Hanoi")
  const [chartPollutant, setChartPollutant] = useState("pm25")

  useEffect(() => {
    Promise.all(
      CITIES.map(city =>
        axios.get(`${API}/current/${city}`)
          // SỬA DÒNG NÀY: Lấy r.data.data nếu có wrapper, ngược lại lấy thẳng r.data
          .then(r => ({ city, data: r.data?.data || r.data })) 
          .catch(() => ({ city, data: null }))
      )
    ).then(results => {
      const map = {}
      results.forEach(({ city, data }) => { map[city] = data })
      setCityData(map)
      setLoading(false)
    })
  }, [])

  const current = cityData[selected]
  const today = new Date().toLocaleDateString("vi-VN")
  
  const shapFeatures = [
    { name: "pm25",      pct: 90 },
    { name: "pm10",      pct: 72 },
    { name: "no2",       pct: 55 },
    { name: "humidity",  pct: 40 },
    { name: "wind_speed",pct: 28 },
  ]
  const topFeature = shapFeatures[0].name

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Dashboard Overview</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            style={{
              background: "#1A1D27", border: "1px solid #2A2D3A",
              borderRadius: 8, padding: "8px 12px", color: "white",
              fontSize: 13, cursor: "pointer", outline: "none"
            }}>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{
            background: "#1A1D27", border: "1px solid #2A2D3A",
            borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "#8B8FA8"
          }}>{today}</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <KPICard label="PM2.5 (μg/m³)" value={loading ? "..." : (current?.pm25 ?? "N/A")} color={getAQIColor(current?.pm25)} />
        <KPICard label="PM10 (μg/m³)" value={loading ? "..." : (current?.pm10 ?? "N/A")} color="#4F8EF7" />
        <KPICard label="NO₂ (μg/m³)" value={loading ? "..." : (current?.no2 ?? "N/A")} color="#FFFF00" />
        <KPICard label="Dự báo AQI" value={loading ? "..." : getAQILabel(current?.pm25)} color={getAQIColor(current?.pm25)} />
      </div>

      {/* Biểu đồ xu hướng */}
      <Card title="Biểu đồ xu hướng & Dự báo 24h">
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
           {["pm25", "pm10", "no2"].map(p => (
             <button 
               key={p}
               onClick={() => setChartPollutant(p)} 
               style={{ 
                 padding: "6px 12px", 
                 background: chartPollutant === p ? "#4F8EF7" : "#2A2D3A", 
                 color: "white", 
                 borderRadius: 6, 
                 border: "none", 
                 cursor: "pointer",
                 fontSize: 12,
                 fontWeight: 600
               }}
             >
               {p.toUpperCase()}
             </button>
           ))}
        </div>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3A" vertical={false} />
              <XAxis dataKey="time" stroke="#8B8FA8" fontSize={12} tickLine={false} />
              <YAxis stroke="#8B8FA8" fontSize={12} tickLine={false} axisLine={false} />
              <RechartsTooltip contentStyle={{ backgroundColor: "#1A1D27", borderColor: "#2A2D3A", borderRadius: 8, color: "#fff" }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Line type="monotone" dataKey={chartPollutant} stroke="#4F8EF7" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name={`Nồng độ ${chartPollutant.toUpperCase()}`} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Row 3: Model & SHAP */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Card title="Chỉ số Model" style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Model",       value: "XGBoost",  color: "#4F8EF7" },
              { label: "Weighted F1", value: "0.989",    color: "#00E400" },
              { label: "Accuracy",    value: "98.91%",   color: "#00E400" },
              { label: "ROC-AUC",     value: "0.9996",   color: "#4F8EF7" },
            ].map(m => (
              <div key={m.label} style={{
                display: "flex", justifyContent: "space-between",
                padding: "10px 12px", background: "#0F1117", borderRadius: 8
              }}>
                <span style={{ color: "#8B8FA8", fontSize: 13 }}>{m.label}</span>
                <span style={{ color: m.color, fontWeight: 600, fontSize: 13 }}>{m.value}</span>
              </div>
            ))}
          </div>
        </Card>
        
        <Card title="Panel Giải thích SHAP" style={{ flex: 2, minWidth: 320 }}>
          <div style={{ marginBottom: 16, padding: "12px", background: "rgba(79, 142, 247, 0.08)", borderRadius: 8, borderLeft: "4px solid #4F8EF7", color: "#E0E6ED", fontStyle: "italic", fontSize: 13, lineHeight: "1.5" }}>
            Chỉ số AQI chịu ảnh hưởng lớn nhất bởi sự gia tăng của <b>{topFeature.toUpperCase()}</b> ({shapFeatures[0].pct}% trọng số đóng góp), tiếp theo là {shapFeatures[1].name.toUpperCase()}.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {shapFeatures.map(f => (
              <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 90, fontSize: 12, color: "#8B8FA8" }}>{f.name.toUpperCase()}</div>
                <div style={{ flex: 1, background: "#0F1117", borderRadius: 4, height: 8 }}>
                  <div style={{ width: `${f.pct}%`, height: "100%", background: "#4F8EF7", borderRadius: 4 }} />
                </div>
                <div style={{ width: 35, fontSize: 12, color: "#8B8FA8", textAlign: "right" }}>{f.pct}%</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}