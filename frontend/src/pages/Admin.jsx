import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const MOCK_STATIONS = [
  { id: "HN01", name: "Hoàn Kiếm, Hà Nội", status: "Active", lastUpdate: "10 mins ago" },
  { id: "HN02", name: "Cầu Giấy, Hà Nội", status: "Active", lastUpdate: "12 mins ago" },
  { id: "HCM01", name: "Q1, TP.HCM", status: "Warning", lastUpdate: "1 hour ago" },
  { id: "DN01", name: "Hải Châu, Đà Nẵng", status: "Offline", lastUpdate: "2 days ago" },
]

const F1_PERFORMANCE_DATA = [
  { date: '01/05', f1: 0.82 },
  { date: '08/05', f1: 0.85 },
  { date: '15/05', f1: 0.84 },
  { date: '22/05', f1: 0.89 },
  { date: '29/05', f1: 0.92 }, // Điểm sau khi tuning
  { date: '05/06', f1: 0.91 },
]

export default function Admin() {
  const [stations, setStations] = useState(MOCK_STATIONS)
  const [isRetraining, setIsRetraining] = useState(false)
  const [alertThreshold, setAlertThreshold] = useState(150)

  const handleRetrain = () => {
    setIsRetraining(true)
    // Giả lập gọi API retrain model
    setTimeout(() => {
      alert("Trigger retrain model thành công! Hệ thống đang huấn luyện lại với dữ liệu mới nhất.")
      setIsRetraining(false)
    }, 2000)
  }

  const handleDeleteStation = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá trạm này?")) {
      setStations(stations.filter(s => s.id !== id))
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Admin Portal</h2>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Panel 1: Quản lý Model & Retrain */}
        <div style={{ flex: 1, minWidth: 350, background: "#1A1D27", borderRadius: 12, padding: 20, border: "1px solid #2A2D3A" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Model Performance (F1 Score)</div>
            <button 
              onClick={handleRetrain}
              disabled={isRetraining}
              style={{
                background: isRetraining ? "#8B8FA8" : "#00E400",
                color: "#0F1117", border: "none", borderRadius: 6, padding: "8px 16px",
                fontWeight: 600, cursor: isRetraining ? "not-allowed" : "pointer",
                transition: "0.2s"
              }}>
              {isRetraining ? "⏳ Đang Retrain..." : "⚡ Trigger Retrain"}
            </button>
          </div>
          
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={F1_PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3A" vertical={false} />
                <XAxis dataKey="date" stroke="#8B8FA8" fontSize={12} />
                <YAxis stroke="#8B8FA8" fontSize={12} domain={[0.7, 1.0]} />
                <Tooltip contentStyle={{ backgroundColor: "#0F1117", borderColor: "#2A2D3A", color: "#fff" }} />
                <Line type="monotone" dataKey="f1" stroke="#4F8EF7" strokeWidth={3} dot={{ r: 5 }} name="Weighted F1" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel 2: Quản lý Ngưỡng cảnh báo */}
        <div style={{ width: 320, background: "#1A1D27", borderRadius: 12, padding: 20, border: "1px solid #2A2D3A" }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Cài đặt hệ thống</div>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, color: "#8B8FA8", marginBottom: 8 }}>
              Ngưỡng AQI gửi Alert tự động (Vùng)
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <input 
                type="number" 
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                style={{ flex: 1, background: "#0F1117", border: "1px solid #2A2D3A", color: "white", padding: "8px 12px", borderRadius: 6 }}
              />
              <button style={{ background: "#4F8EF7", color: "white", border: "none", padding: "0 16px", borderRadius: 6, cursor: "pointer" }}>
                Lưu
              </button>
            </div>
            <p style={{ fontSize: 12, color: "#FF7E00", marginTop: 8 }}>* Sẽ trigger banner cảnh báo đỏ trên Dashboard nếu vượt ngưỡng này.</p>
          </div>
        </div>
      </div>

      {/* Panel 3: CRUD Trạm cảm biến */}
      <div style={{ background: "#1A1D27", borderRadius: 12, padding: 20, border: "1px solid #2A2D3A" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Quản lý Trạm Cảm Biến (CRUD)</div>
          <button style={{ background: "#4F8EF7", color: "white", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>
            + Thêm trạm mới
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2A2D3A", textAlign: "left", color: "#8B8FA8" }}>
              <th style={{ padding: "12px 8px" }}>Mã Trạm</th>
              <th style={{ padding: "12px 8px" }}>Tên / Vị trí</th>
              <th style={{ padding: "12px 8px" }}>Cập nhật cuối</th>
              <th style={{ padding: "12px 8px" }}>Trạng thái</th>
              <th style={{ padding: "12px 8px", textAlign: "right" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {stations.map(s => (
              <tr key={s.id} style={{ borderBottom: "1px solid #2A2D3A" }}>
                <td style={{ padding: "12px 8px", fontWeight: 600 }}>{s.id}</td>
                <td style={{ padding: "12px 8px" }}>{s.name}</td>
                <td style={{ padding: "12px 8px", color: "#8B8FA8" }}>{s.lastUpdate}</td>
                <td style={{ padding: "12px 8px" }}>
                  <span style={{ 
                    padding: "4px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600,
                    background: s.status === "Active" ? "rgba(0, 228, 0, 0.15)" : s.status === "Offline" ? "rgba(255, 0, 0, 0.15)" : "rgba(255, 126, 0, 0.15)",
                    color: s.status === "Active" ? "#00E400" : s.status === "Offline" ? "#FF0000" : "#FF7E00"
                  }}>
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: "12px 8px", textAlign: "right" }}>
                  <button style={{ background: "transparent", border: "1px solid #8B8FA8", color: "#8B8FA8", padding: "4px 12px", borderRadius: 4, cursor: "pointer", marginRight: 8 }}>Sửa</button>
                  <button onClick={() => handleDeleteStation(s.id)} style={{ background: "rgba(255,0,0,0.1)", border: "1px solid #FF0000", color: "#FF0000", padding: "4px 12px", borderRadius: 4, cursor: "pointer" }}>Xoá</button>
                </td>
              </tr>
            ))}
            {stations.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: 20, color: "#8B8FA8" }}>Không có trạm nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}