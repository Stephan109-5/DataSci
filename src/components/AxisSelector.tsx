import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

type AxisSelectorProps = {
  columns: string[]
  groupBy: string
  series: string
  value: string
  onChange: (axis: 'groupBy' | 'series' | 'value', value: string) => void
}

export default function AxisSelector({ columns, groupBy, series, value, onChange }: AxisSelectorProps) {
  return (
    <div style={{ display: 'flex', gap: 16, margin: '16px 0' }}>
      <FormControl>
        <InputLabel>Group By</InputLabel>
        <Select value={groupBy} label="Group By" onChange={e => onChange('groupBy', e.target.value)}>
          <MenuItem value="none">none</MenuItem>
          {columns.map(col => <MenuItem key={col} value={col}>{col}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Series</InputLabel>
        <Select value={series} label="Series" onChange={e => onChange('series', e.target.value)}>
          <MenuItem value="none">none</MenuItem>

          {columns.map(col => <MenuItem key={col} value={col}>{col}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Value</InputLabel>
        <Select value={value} label="Value" onChange={e => onChange('value', e.target.value)}>
          {columns.map(col => <MenuItem key={col} value={col}>{col}</MenuItem>)}
        </Select>
      </FormControl>
    </div>
  )
}