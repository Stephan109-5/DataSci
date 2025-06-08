import { useState } from 'react'
import CsvUploader from './components/CsvUploader'
import AxisSelector from './components/AxisSelector'
import ChartDisplay from './components/ChartDisplay'
import MapDisplay from './components/MapDisplay'
import HeatMapDisplay from './components/HeatMapDisplay'
import { Container, Typography, CssBaseline, ThemeProvider, createTheme, FormControl, InputLabel, MenuItem, Select, Box } from '@mui/material'
import './App.css'

// Create a dark theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#181c24',
      paper: '#232936',
    },
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    text: {
      primary: '#fff',
      secondary: '#b0b8c1',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

function App() {
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [groupBy, setGroupBy] = useState('none')
  const [series, setSeries] = useState('none')
  const [value, setValue] = useState('none')
  const [heatmapYear, setHeatmapYear] = useState('none')
  const [heatmapValue, setHeatmapValue] = useState('none')
  const [mapValue, setMapValue] = useState('none')

  const handleData = (rows: any[], cols: string[]) => {
    setData(rows)
    setColumns(cols)
    setGroupBy('none')
    setSeries('none')
    setValue('none')
    // Set defaults for heatmap and map selectors
    const years = Array.from(new Set(rows.map(r => r.report_school_year)))
    setHeatmapYear(years.length > 0 ? years[0] : 'none')
    setHeatmapValue(cols.length > 0 ? cols[0] : 'none')
    setMapValue(cols.length > 0 ? cols[0] : 'none')
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          CSV Chart Viewer
        </Typography>
        <CsvUploader onData={handleData} />
        {columns.length > 2 && (
          <AxisSelector
            columns={columns}
            groupBy={groupBy}
            series={series}
            value={value}
            onChange={(axis, val) => {
              if (axis === 'groupBy') setGroupBy(val)
              else if (axis === 'series') setSeries(val)
              else setValue(val)
            }}
          />
        )}
        {data.length > 0 && groupBy !== 'none' && value !== 'none' && (
          <ChartDisplay data={data} groupBy={groupBy} series={series} value={value} />
        )}
        {data.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt:2, mb: 2 }}>
            <FormControl>
              <InputLabel>Map Value</InputLabel>
              <Select
                value={mapValue}
                label="Map Value"
                onChange={e => setMapValue(e.target.value)}
                size="small"
              >
                <MenuItem value="none">none</MenuItem>
                {columns.filter(col => col !== 'latitude' && col !== 'longitude').map(col =>
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        )}
        {data.length > 0 && mapValue !== 'none' && (
          <MapDisplay data={data} valueCol={mapValue} />
        )}
        {data.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <FormControl>
              <InputLabel>Year</InputLabel>
              <Select
                value={heatmapYear}
                label="Year"
                onChange={e => setHeatmapYear(e.target.value)}
                size="small"
              >
                <MenuItem value="none">none</MenuItem>
                {Array.from(new Set(data.map(r => r.report_school_year))).map(year =>
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                )}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Heatmap Value</InputLabel>
              <Select
                value={heatmapValue}
                label="Heatmap Value"
                onChange={e => setHeatmapValue(e.target.value)}
                size="small"
              >
                <MenuItem value="none">none</MenuItem>
                {columns.filter(col => col !== 'latitude' && col !== 'longitude').map(col =>
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        )}
        {data.length > 0 && heatmapYear !== 'none' && heatmapValue !== 'none' && (
          <HeatMapDisplay data={data} year={heatmapYear} valueCol={heatmapValue} />
        )}
      </Container>
    </ThemeProvider>
  )
}

export default App
