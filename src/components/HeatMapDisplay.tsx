import { MapContainer, TileLayer, Tooltip, CircleMarker } from 'react-leaflet'
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3'
import 'leaflet/dist/leaflet.css'
import { Box, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material'
import { useState } from 'react'

type HeatMapDisplayProps = {
  data: any[]
  columns: string[]
}

export default function HeatMapDisplay({ data, columns }: HeatMapDisplayProps) {
  // Find all unique years
  const years = Array.from(new Set(data.map(row => row.report_school_year)))
  const [year, setYear] = useState(years[0] || 'none')
  const [valueCol, setValueCol] = useState(columns[0] || 'none')

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
        ? Math.abs(Number(row[valueCol]))
        : Math.log10(Math.abs(Number(row[valueCol])) + 1) //Use log scale to handle large values
    ])

  const center: [number, number] = [42.9, -75.5]

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl>
          <InputLabel>Year</InputLabel>
          <Select value={year} onChange={e => setYear(e.target.value)}>
            {years.map(y => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
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
        {points.map((p, i) => (
          <CircleMarker
            key={i}
            center={[p[0], p[1]]}
            radius={4}
            fillOpacity={0}
            stroke={false}
          >
            <Tooltip>
              Intensity: {p[2].toFixed(2)}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <span>Low</span>
        <Box
          sx={{
            height: 16,
            width: 120,
            background: 'linear-gradient(to right, #00f, #0ff, #0f0, #ff0, #f00)',
            borderRadius: 2,
          }}
        />
        <span>High</span>
      </Box>
    </Paper>
  )
}