import React from 'react'
import { DataGrid } from '@mui/x-data-grid'

function PlayerTable({ stats }) {
    const columns = [
        { field: 'playerFullName', headerName: 'Player Name', flex: 1 },
        { field: 'team', headerName: 'Team' },
        { field: 'AVG', headerName: 'AVG'},
        { field: 'OPS', headerName: 'OPS'},
        { field: 'PA', headerName: 'PA'},
        { field: 'AB', headerName: 'AB'},
        { field: 'H', headerName: 'H' },
        { field: 'HR', headerName: 'HR' },
        { field: 'BB', headerName: 'BB' },
        { field: 'K', headerName: 'K' },
    ]

    const rows = stats?.map((stat, index) => ({ id: index, ...stat }))

    return (
        <div style={{ height: 600, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} />
        </div>
    )
}

export default PlayerTable
