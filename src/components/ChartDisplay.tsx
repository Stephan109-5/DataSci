import { BarChartPro } from '@mui/x-charts-pro'
import { Paper } from '@mui/material'

type ChartDisplayProps = {
    data: any[]
    groupBy: string
    series: string
    value: string
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

export default function ChartDisplay({ data, groupBy, series, value }: ChartDisplayProps) {
    // Case 1: No group, no series - aggregate all data
    if (groupBy === 'none' && series === 'none') {
        const agg = aggregateValue(data, value)
        return (
            <Paper sx={{ p: 2 }}>
                <BarChartPro
                    xAxis={[{ data: [value], scaleType: 'band', label: value, zoom: true }]}
                    grid={{ horizontal: true }}
                    yAxis={[{ width: 80 }]}
                    series={[{ label: value, data: [agg] }]}
                    width={1100}
                    height={400}
                />
            </Paper>
        )
    }

    // Case 2: Group by only, no series - aggregate by group
    if (series === 'none') {
        const groups = Array.from(new Set(data.map(row => row[groupBy])))
        const aggData = groups.map(g => {
            const groupRows = data.filter(row => row[groupBy] === g)
            return aggregateValue(groupRows, value)
        })
        return (
            <Paper sx={{ p: 2 }}>
                <BarChartPro
                    xAxis={[{ data: groups, scaleType: 'band', label: groupBy, zoom: true }]}
                    yAxis={[{ width: 80 }]}
                    grid={{ horizontal: true }}
                    series={[{ label: value, data: aggData }]}
                    width={1100}
                    height={400}
                />
            </Paper>
        )
    }

    // Case 3: Group by and series - grouped bar chart
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
        <Paper sx={{ p: 2 }}>
            <BarChartPro
                xAxis={[{ data: groups, scaleType: 'band', label: groupBy, zoom: true }]}
                grid={{ horizontal: true }}
                yAxis={[{ width: 80 }]}
                series={chartSeries}
                width={1100}
                height={400}
            />
        </Paper>
    )
}