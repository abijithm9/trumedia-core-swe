import React from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

function Filter({ filter, setFilter }) {
  return (
    <div style={{ padding: '16px' }}>
      <FormControl fullWidth>
        <InputLabel>Filter</InputLabel>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <MenuItem value="Full Season">Full Season</MenuItem>
          <MenuItem value="Monthly">Monthly</MenuItem>
          <MenuItem value="First Half">First Half</MenuItem>
          <MenuItem value="Second Half">Second Half</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}

export default Filter