import { BarChartPro } from '@mui/x-charts-pro'
import { Paper, Box, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material'
import { useState } from 'react'

type ChartDisplayProps = {
    data: any[]
    columns: string[]
}

function aggregateValue(data: any[], value: string) {
    const nums = data.map(row => Number(row[value])).filter(v => !isNaN(v))
    if (value.endsWith('_pct')) {
        // Average for percent columns
        return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0
    }
    // Sum for other columns
    return nums.reduce((a, b) => a + b, 0)
}

export default function ChartDisplay({ data, columns }: ChartDisplayProps) {
    const [groupBy, setGroupBy] = useState('none')
    const [series, setSeries] = useState('none')
    const [value, setValue] = useState('none')

    // Case 1: No group, no series - aggregate all data
    if (groupBy === 'none' && series === 'none' && value !== 'none') {
        const agg = aggregateValue(data, value)
        return (
            <Paper sx={{ p: 2, mt: 1, mb: 1 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl>
                        <InputLabel>Group By</InputLabel>
                        <Select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
                            <MenuItem value="none">none</MenuItem>
                            {columns.map(col => (
                                <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel>Series</InputLabel>
                        <Select value={series} onChange={e => setSeries(e.target.value)}>
                            <MenuItem value="none">none</MenuItem>
                            {columns.map(col => (
                                <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel>Value</InputLabel>
                        <Select value={value} onChange={e => setValue(e.target.value)}>
                            <MenuItem value="none">none</MenuItem>
                            {columns.map(col => (
                                <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Divider sx={{m: 1, borderWidth: '2px'}}/>
                <BarChartPro
                    xAxis={[{ data: [value], scaleType: 'band', label: value, zoom: true }]}
                    grid={{ horizontal: true }}
                    yAxis={[{ width: 80 }]}
                    series={[{ label: value, data: [agg] }]}
                    
                    height={400}
                />
            </Paper>
        )
    }

    // Case 2: Group by only, no series - aggregate by group
    if (series === 'none' && groupBy !== 'none' && value !== 'none') {
        const groups = Array.from(new Set(data.map(row => row[groupBy])))
        const aggData = groups.map(g => {
            const groupRows = data.filter(row => row[groupBy] === g)
            return aggregateValue(groupRows, value)
        })
        return (
            <Paper sx={{ p: 2, mt: 1, mb: 1 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl>
                        <InputLabel>Group By</InputLabel>
                        <Select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
                            <MenuItem value="none">none</MenuItem>
                            {columns.map(col => (
                                <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel>Series</InputLabel>
                        <Select value={series} onChange={e => setSeries(e.target.value)}>
                            <MenuItem value="none">none</MenuItem>
                            {columns.map(col => (
                                <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel>Value</InputLabel>
                        <Select value={value} onChange={e => setValue(e.target.value)}>
                            <MenuItem value="none">none</MenuItem>
                            {columns.map(col => (
                                <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Divider sx={{m: 1, borderWidth: '2px'}}/>
                <BarChartPro
                    xAxis={[{ data: groups, scaleType: 'band', label: groupBy, zoom: true }]}
                    yAxis={[{ width: 80 }]}
                    grid={{ horizontal: true }}
                    series={[{ label: value, data: aggData }]}
                    
                    height={400}
                />
            </Paper>
        )
    }

    // Case 3: Group by and series - grouped bar chart
    if (groupBy !== 'none' && series !== 'none' && value !== 'none') {
        const groups = Array.from(new Set(data.map(row => row[groupBy])))
        const seriesList = Array.from(new Set(data.map(row => row[series])))

        const chartSeries = seriesList.map(s => ({
            label: s,
            data: groups.map(g => {
                const groupRows = data.filter(row => row[groupBy] === g && row[series] === s)
                return aggregateValue(groupRows, value)
            })
        }))

        return (
            <Paper sx={{ p: 2, mt: 1, mb: 1 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl>
                        <InputLabel>Group By</InputLabel>
                        <Select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
                            <MenuItem value="none">none</MenuItem>
                            {columns.map(col => (
                                <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel>Series</InputLabel>
                        <Select value={series} onChange={e => setSeries(e.target.value)}>
                            <MenuItem value="none">none</MenuItem>
                            {columns.map(col => (
                                <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel>Value</InputLabel>
                        <Select value={value} onChange={e => setValue(e.target.value)}>
                            <MenuItem value="none">none</MenuItem>
                            {columns.map(col => (
                                <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Divider sx={{m: 1, borderWidth: '2px'}}/>
                <BarChartPro
                    xAxis={[{ data: groups, scaleType: 'band', label: groupBy, zoom: true }]}
                    grid={{ horizontal: true }}
                    yAxis={[{ width: 80 }]}
                    series={chartSeries}
                    
                    height={400}
                />
            </Paper>
        )
    }

    // Default: show only selectors
    return (
        <Paper sx={{ p: 2, mt: 1, mb: 1 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl>
                    <InputLabel>Group By</InputLabel>
                    <Select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
                        <MenuItem value="none">none</MenuItem>
                        {columns.map(col => (
                            <MenuItem key={col} value={col}>{col}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel>Series</InputLabel>
                    <Select value={series} onChange={e => setSeries(e.target.value)}>
                        <MenuItem value="none">none</MenuItem>
                        {columns.map(col => (
                            <MenuItem key={col} value={col}>{col}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel>Value</InputLabel>
                    <Select value={value} onChange={e => setValue(e.target.value)}>
                        <MenuItem value="none">none</MenuItem>
                        {columns.map(col => (
                            <MenuItem key={col} value={col}>{col}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Divider sx={{m: 1, borderWidth: '2px'}}/>
        </Paper>
    )
}