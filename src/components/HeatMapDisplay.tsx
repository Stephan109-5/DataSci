import { MapContainer, TileLayer } from 'react-leaflet'
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3'
import 'leaflet/dist/leaflet.css'

type HeatMapDisplayProps = {
  data: any[]
  year: string
  valueCol: string
}

export default function HeatMapDisplay({ data, year, valueCol }: HeatMapDisplayProps) {
  // Filter data for the selected year and valid lat/lng/value
  const points = data
    .filter(row =>
      row.report_school_year === year &&
      row.latitude && row.longitude &&
      !isNaN(Number(row.latitude)) &&
      !isNaN(Number(row.longitude)) &&
      !isNaN(Number(row[valueCol]))
    )
    .map(row => [
      Number(row.latitude),
      Number(row.longitude),
      valueCol.endsWith('_pct')
        ? Math.abs(Number(row[valueCol])) // use raw for percent
        : Math.log10(Math.abs(Number(row[valueCol])) + 1) // log for big numbers
    ])

  console.log(points)

  const center: [number, number] = [42.9, -75.5]

  return (
    <MapContainer center={center} zoom={7} style={{ height: 500, width: '100%', margin: '24px 0' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <HeatmapLayer
        fitBoundsOnLoad
        fitBoundsOnUpdate
        points={points}
        longitudeExtractor={m => m[1]}
        latitudeExtractor={m => m[0]}
        intensityExtractor={m => m[2]}
        radius={30}
        blur={20}
        max={Math.max(...points.map(p => p[2]), 1)}
      />
    </MapContainer>
  )
}