import { Button } from '@mui/material'
import Papa from 'papaparse'
import React, { type ReactNode } from 'react'

type CsvUploaderProps = {
  onData: (data: any[], columns: string[]) => void,
  children: ReactNode
}

export default function CsvUploader({ onData, children }: CsvUploaderProps) {
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
      {children}
      <input type="file" accept=".csv" hidden onChange={handleFile} />
    </Button>
  )
}