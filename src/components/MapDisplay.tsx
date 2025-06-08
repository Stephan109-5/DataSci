import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type MapDisplayProps = {
  data: any[]
  valueCol: string
  groupBy: string
  mapSeries: string
}

export default function MapDisplay({ data, valueCol, groupBy, mapSeries }: MapDisplayProps) {
  // Group by the selected column, collect all rows for each group
  const grouped = data.reduce((acc: Record<string, any[]>, row) => {
    const key = row[groupBy]
    if (!key) return acc
    if (!acc[key]) acc[key] = []
    acc[key].push(row)
    return acc
  }, {})

  const center: [number, number] = [42.9, -75.5]

  return (
    <MapContainer center={center} zoom={7} style={{ height: 500, width: '100%', margin: '24px 0' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {Object.entries(grouped).map(([groupKey, rows]) => {
        const { latitude, longitude } = rows[0]
        if (!latitude || !longitude) return null
        return (
          <Marker key={groupKey} position={[Number(latitude), Number(longitude)]}>
            <Popup>
              <b>{groupKey}</b><br/>
              {valueCol}
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {rows.map(r => (
                  <li key={r[mapSeries] || Math.random()}>
                    <b>{r[mapSeries] || ''}:</b>{" "}
                    {r[valueCol] !== undefined
                      ? valueCol.endsWith('_pct')
                        ? `${(Number(r[valueCol]) * 100).toFixed(1)}%`
                        : r[valueCol]
                      : 'N/A'}
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