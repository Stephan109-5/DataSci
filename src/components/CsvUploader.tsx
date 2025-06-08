import { Button } from '@mui/material'
import Papa from 'papaparse'
import React from 'react'

type CsvUploaderProps = {
  onData: (data: any[], columns: string[]) => void
}

export default function CsvUploader({ onData }: CsvUploaderProps) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onData(results.data, results.meta.fields || [])
      }
    })
  }

  return (
    <Button variant="contained" component="label">
      Upload CSV
      <input type="file" accept=".csv" hidden onChange={handleFile} />
    </Button>
  )
}