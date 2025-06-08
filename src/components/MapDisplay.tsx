import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix for default marker icon in leaflet
import 'leaflet/dist/leaflet.css'
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type MapDisplayProps = {
  data: any[]
}

export default function MapDisplay({ data }: MapDisplayProps) {
  // Group by county_name, collect all years for each
  const grouped = data.reduce((acc: Record<string, any[]>, row) => {
    const key = row.county_name
    if (!acc[key]) acc[key] = []
    acc[key].push(row)
    return acc
  }, {})

  // Center on NY state
  const center: [number, number] = [42.9, -75.5]

  return (
    <MapContainer center={center} zoom={7} style={{ height: 500, width: '100%', margin: '24px 0' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {Object.values(grouped).map((rows, i) => {
        const { latitude, longitude, county_name } = rows[0]
        if (!latitude || !longitude) return null
        return (
          <Marker key={county_name} position={[Number(latitude), Number(longitude)]}>
            <Popup>
              <b>{county_name}</b>
              <ul style={{ paddingLeft: 16 }}>
                {rows.map(r => (
                  <li key={r.report_school_year}>
                    <b>{r.report_school_year}:</b> grad_pct: {(Number(r.grad_pct) * 100).toFixed(1)}%
                  </li>
                ))}
              </ul>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}