import { useState } from 'react'
import CsvUploader from './components/CsvUploader'
import AxisSelector from './components/AxisSelector'
import ChartDisplay from './components/ChartDisplay'
import MapDisplay from './components/MapDisplay'
import { Container, Typography, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
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
  const [groupBy, setGroupBy] = useState('')
  const [series, setSeries] = useState('')
  const [value, setValue] = useState('')

  const handleData = (rows: any[], cols: string[]) => {
    setData(rows)
    setColumns(cols)
    setGroupBy('county_name')
    setSeries('report_school_year')
    setValue('grad_cnt')
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
        {data.length > 0 && groupBy && series && value && (
          <ChartDisplay data={data} groupBy={groupBy} series={series} value={value} />
        )}
        {data.length > 0 && <MapDisplay data={data} />}
      </Container>
    </ThemeProvider>
  )
}

export default App
