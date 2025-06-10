import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Box, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material'
import { useState } from 'react'

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type MapDisplayProps = {
  data: any[]
  columns: string[]
}

export default function MapDisplay({ data, columns }: MapDisplayProps) {
  const [valueCol, setValueCol] = useState(columns[0] || 'none')
  const [groupBy, setGroupBy] = useState(columns[0] || 'none')
  const [mapSeries, setMapSeries] = useState(columns[0] || 'none')

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
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl>
          <InputLabel>Group By</InputLabel>
          <Select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
            {columns.map(col => (
              <MenuItem key={col} value={col}>{col}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Series</InputLabel>
          <Select value={mapSeries} onChange={e => setMapSeries(e.target.value)}>
            {columns.map(col => (
              <MenuItem key={col} value={col}>{col}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Value</InputLabel>
          <Select value={valueCol} onChange={e => setValueCol(e.target.value)}>
            {columns.map(col => (
              <MenuItem key={col} value={col}>{col}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
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
                <b>{groupKey}</b><br />
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
    </Paper>
  )
}