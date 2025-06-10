import { useState } from 'react'
import CsvUploader from './components/CsvUploader'
import ChartDisplay from './components/ChartDisplay'
import MapDisplay from './components/MapDisplay'
import HeatMapDisplay from './components/HeatMapDisplay'
import { Container, Typography, CssBaseline, ThemeProvider, createTheme, Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
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
  const [data1, setData1] = useState<any[]>([])
  const [columns1, setColumns1] = useState<string[]>([])
  const [data2, setData2] = useState<any[]>([])
  const [columns2, setColumns2] = useState<string[]>([])

  const handleData1 = (rows: any[], cols: string[]) => {
    setData1(rows)
    setColumns1(cols)
    setData2([])      // Reset second data if first is re-uploaded
    setColumns2([])
  }

  const handleData2 = (rows: any[], cols: string[]) => {
    setData2(rows)
    setColumns2(cols)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ py: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Typography variant="h4" gutterBottom color="primary">
          Interactive Chart Viewer
        </Typography>
        <Box my={2} sx={{display: 'flex', gap: '1rem'}}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CsvUploader onData={handleData1}>Add CSV</CsvUploader>
            {data1.length > 0 && (
              <IconButton
                color="warning"
                size="small"
                onClick={() => {
                  setData1([]);
                  setColumns1([]);
                  setData2([]);
                  setColumns2([]);
                }}
                aria-label="Clear first CSV"
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
          {data1.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CsvUploader onData={handleData2}>Add Second CSV</CsvUploader>
              {data2.length > 0 && (
                <IconButton
                  color="warning"
                  size="small"
                  onClick={() => {
                    setData2([]);
                    setColumns2([]);
                  }}
                  aria-label="Clear second CSV"
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', width: '100%' }} justifyContent={'space-between'} gap={2}>
          {data1.length > 0 && (
            <Box
              sx={{
                flex: data2.length > 0 ? '1 1 50%' : '1 1 100%',
                minWidth: 0,
              }}
            >
              <ChartDisplay data={data1} columns={columns1} />
              <MapDisplay data={data1} columns={columns1} />
              <HeatMapDisplay data={data1} columns={columns1} />
            </Box>
          )}
          {data2.length > 0 && (
            <Box
              sx={{
                flex: '1 1 50%',
                minWidth: 0,
              }}
            >
              <ChartDisplay data={data2} columns={columns2} />
              <MapDisplay data={data2} columns={columns2} />
              <HeatMapDisplay data={data2} columns={columns2} />
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
