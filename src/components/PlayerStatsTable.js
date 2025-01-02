import React, { useEffect, useState, useMemo } from 'react'
import { getPlayers, getPlayerGameLogs } from '../trumediaAPIService'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import { Dialog, DialogTitle, DialogContent, TableSortLabel } from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import Box from '@mui/material/Box'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import BaseballLoadingSpinner from './BaseballLoadingSpinner'
import { alpha } from '@mui/material/styles'
import RateStatChart from './RateStatChart'

const columns = [
    { id: 'playerImage', label: '', disablePadding: true, minWidth: 50 },
    { id: 'teamImage', label: '', disablePadding: false, minWidth: 30 },
    { id: 'playerName', label: 'Name', disablePadding: false, minWidth: 170 },
    { id: 'PA', label: 'PA', disablePadding: false, minWidth: 70 },
    { id: 'AB', label: 'AB', disablePadding: false, minWidth: 70 },
    { id: 'H', label: 'H', disablePadding: false, minWidth: 70 },
    { id: 'HR', label: 'HR', disablePadding: false, minWidth: 70 },
    { id: 'BB', label: 'BB', disablePadding: false, minWidth: 70 },
    { id: 'K', label: 'K', disablePadding: false, minWidth: 70 },
    { id: 'RBI', label: 'RBI', disablePadding: false, minWidth: 70 },
    { id: 'BA', label: 'BA', disablePadding: false, minWidth: 70 },
    { id: 'OBP', label: 'OBP', disablePadding: false, minWidth: 70 },
    { id: 'SLG', label: 'SLG', disablePadding: false, minWidth: 70 },
    { id: 'OPS', label: 'OPS', disablePadding: false, minWidth: 70 }
]

const timeRanges = [
    { value: 'full', label: 'Full Season' },
    { value: 'firstHalf', label: 'First Half' },
    { value: 'secondHalf', label: 'Second Half' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' }
]

const teams = [
    { value: 'ALL', label: 'All players'},
    { value: 'AZ', label: 'Arizona Diamondbacks' },
    { value: 'ATL', label: 'Atlanta Braves' },
    { value: 'BAL', label: 'Baltimore Orioles' },
    { value: 'BOS', label: 'Boston Red Sox' },
    { value: 'CHC', label: 'Chicago Cubs' },
    { value: 'CWS', label: 'Chicago White Sox' },
    { value: 'CIN', label: 'Cincinnati Reds' },
    { value: 'CLE', label: 'Cleveland Guardians' },
    { value: 'COL', label: 'Colorado Rockies' },
    { value: 'DET', label: 'Detroit Tigers' },
    { value: 'HOU', label: 'Houston Astros' },
    { value: 'KC', label: 'Kansas City Royals' },
    { value: 'LAA', label: 'Los Angeles Angels' },
    { value: 'LAD', label: 'Los Angeles Dodgers' },
    { value: 'MIA', label: 'Miami Marlins' },
    { value: 'MIL', label: 'Milwaukee Brewers' },
    { value: 'MIN', label: 'Minnesota Twins' },
    { value: 'NYM', label: 'New York Mets' },
    { value: 'NYY', label: 'New York Yankees' },
    { value: 'OAK', label: 'Oakland Athletics' },
    { value: 'PHI', label: 'Philadelphia Phillies' },
    { value: 'PIT', label: 'Pittsburgh Pirates' },
    { value: 'SD', label: 'San Diego Padres' },
    { value: 'SF', label: 'San Francisco Giants' },
    { value: 'SEA', label: 'Seattle Mariners' },
    { value: 'STL', label: 'St. Louis Cardinals' },
    { value: 'TB', label: 'Tampa Bay Rays' },
    { value: 'TEX', label: 'Texas Rangers' },
    { value: 'TOR', label: 'Toronto Blue Jays' },
    { value: 'WSH', label: 'Washington Nationals' }
]

const getComparisonColor = (value, leagueAvg, isInverse = false) => {
    const diff = isInverse ? leagueAvg - value : value - leagueAvg
    const maxDiff = leagueAvg * 0.5
    const intensity = Math.min(Math.abs(diff) / maxDiff, 1)
    if (diff > 0) {
        return alpha('#D22B2B', intensity * 0.5) // Red for above average
    } else {
        return alpha('#0047AB', intensity * 0.5) // Blue for below average
    }
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
    return 0
}
  
function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy)
}

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property)
    }
  
    return (
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              align={column.numeric ? 'right' : 'left'}
              padding={column.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === column.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={createSortHandler(column.id)}
              >
                {column.label}
                {orderBy === column.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    )
  }

const PlayerStatsTable = () => {
    const [players, setPlayers] = useState([])
    const [aggregatedStats, setAggregatedStats] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFiltering, setIsFiltering] = useState(false)
    const [filteredStats, setFilteredStats] = useState(null)
    const [order, setOrder] = React.useState('desc')
    const [orderBy, setOrderBy] = React.useState('PA')
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(50)
    const [timeFilter, setTimeFilter] = useState('full')
    const [teamFilter, setTeamFilter] = useState('ALL')
    const [leagueAverageStats, setLeagueAverageStats] = useState([])
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const [selectedPlayerGameLogs, setSelectedPlayerGameLogs] = useState([])
    const [openChart, setOpenChart] = useState(false)

    const handleSelectPlayer = async (playerId) => {
        try {
            const response = await getPlayerGameLogs(playerId)
            setSelectedPlayerGameLogs(response.data)
            const player = response.data.find(player => player.playerId === playerId)
            setSelectedPlayer(player)
            setOpenChart(true)
        } catch (error) {
            console.error(`Unable to fetch game logs for playerId: ${playerId}`)
        }
    }

    const handleClosePlayer = () => {
        setOpenChart(false)
        setSelectedPlayerGameLogs([])
        setSelectedPlayer(null)
    }
    const handleTimeFilterChange = (event) => {
        setTimeFilter(event.target.value)
    }
    
    const handleTeamFilterChange = (event) => {
        setTeamFilter(event.target.value)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const aggregateStats = (gameLogs) => {
        let teamFilteredGames = gameLogs
        if (teamFilter !== 'ALL') {
            teamFilteredGames = teamFilteredGames.filter(game => game.currentTeamAbbrevName === teamFilter)
            if (gameLogs.length === 0) {
                return null
            }
        }
        const filteredGames = teamFilteredGames.filter(game => {
            const gameDate = new Date(game.date)
            const month = gameDate.getMonth() + 1

            switch (timeFilter) {
                case 'firstHalf':
                    return month < 7
                case 'secondHalf':
                    return month >= 7
                case 'full':
                    return true
                default:
                    return month === parseInt(timeFilter)
            }
        })

        if (filteredGames.length === 0) {
            return null
        }

        const totalStats = filteredGames.reduce(
            (totals, game) => {
                totals.PA += game.PA
                totals.AB += game.AB
                totals.H += game.H
                totals.HR += game.HR
                totals.BB += game.BB
                totals.K += game.K
                totals.TB += game.TB
                totals.HBP += game.HBP
                totals.SF += game.SF
                totals.RBI += game.RBI
                return totals
            },
        { PA: 0, AB: 0, H: 0, HR: 0, BB: 0, K: 0, TB: 0, HBP: 0, SF: 0, RBI: 0 })

        const BA = totalStats.AB > 0 ? (totalStats.H / totalStats.AB).toFixed(3) : "0.000"
        const OBP = (totalStats.AB + totalStats.BB + totalStats.HBP + totalStats.SF) > 0 ? parseFloat((((totalStats.H + totalStats.BB + totalStats.HBP) / (totalStats.AB + totalStats.BB + totalStats.HBP + totalStats.SF))).toFixed(3)) : "0.000"
        const SLG = totalStats.AB > 0 ? (totalStats.TB / totalStats.AB).toFixed(3) : "0.000"
        const OPS = (parseFloat(OBP) + parseFloat(SLG)).toFixed(3) || 0

        return { ...totalStats, BA, OBP, SLG, OPS }
    }

    const leagueAverageComputations = async (allGameLogs) => {
        try {
            const filteredGames = allGameLogs.flat().filter(game => {
                const gameDate = new Date(game.date)
                const month = gameDate.getMonth() + 1
    
                switch (timeFilter) {
                    case 'firstHalf':
                        return month < 7
                    case 'secondHalf':
                        return month >= 7
                    case 'full':
                        return true
                    default:
                        return month === parseInt(timeFilter)
                }
            })

            const totalAggregatedStats = filteredGames.reduce(
                (totals, player) => {
                    totals.PA += player.PA
                    totals.AB += player.AB
                    totals.H += player.H
                    totals.HR += player.HR
                    totals.BB += player.BB
                    totals.K += player.K
                    totals.TB += player.TB
                    totals.HBP += player.HBP
                    totals.SF += player.SF
                    totals.RBI += player.RBI
                    return totals
                },
            { PA: 0, AB: 0, H: 0, HR: 0, BB: 0, K: 0, TB: 0, HBP: 0, SF: 0, RBI: 0 })

            const BA = totalAggregatedStats.AB > 0 ? parseFloat(((totalAggregatedStats.H / totalAggregatedStats.AB)).toFixed(3)) : 0.000
            const OBP = (totalAggregatedStats.AB + totalAggregatedStats.BB + totalAggregatedStats.HBP + totalAggregatedStats.SF) > 0 ? parseFloat((((totalAggregatedStats.H + totalAggregatedStats.BB + totalAggregatedStats.HBP) / (totalAggregatedStats.AB + totalAggregatedStats.BB + totalAggregatedStats.HBP + totalAggregatedStats.SF))).toFixed(3)) : 0.000
            const SLG = totalAggregatedStats.AB > 0 ? parseFloat(((totalAggregatedStats.TB / totalAggregatedStats.AB)).toFixed(3)) : 0.000
            const OPS = parseFloat((OBP + SLG).toFixed(3)) || 0.000

            // Compute averages per player (133 players)
            const playerCount = 133
            const averageStats = {
                PA: Math.round(totalAggregatedStats.PA / playerCount),
                AB: Math.round(totalAggregatedStats.AB / playerCount),
                H: Math.round(totalAggregatedStats.H / playerCount),
                HR: Math.round(totalAggregatedStats.HR / playerCount),
                BB: Math.round(totalAggregatedStats.BB / playerCount),
                K: Math.round(totalAggregatedStats.K / playerCount),
                TB: Math.round(totalAggregatedStats.TB / playerCount),
                RBI: Math.round(totalAggregatedStats.RBI / playerCount),
                BA,
                OBP,
                SLG,
                OPS
            }

        setLeagueAverageStats(averageStats)
        } catch (error) {
            console.error('Error computing league average stats')
        }
    } 

    useEffect(() => {
        const fetchAndAggregateStats = async () => {
        setLoading(true)
        setIsFiltering(true)
        setFilteredStats(null) 
        try {
            const playersResponse = await getPlayers()
            const playersData = playersResponse.data
            setPlayers(playersData)

            const gameLogsPromises = playersData.map(player => 
                getPlayerGameLogs(player.playerId)
                    .then(response => response.data)
            )

            const allGameLogs = await Promise.all(gameLogsPromises)
            await leagueAverageComputations(allGameLogs)

            let aggregatedPlayerStats = playersData.map((player, index) => {
                const aggregated = aggregateStats(allGameLogs[index])
                if (!aggregated) {
                    return null
                }
                return {
                    playerId: player.playerId,
                    playerName: player.playerFullName,
                    playerImage: player.playerImage,
                    teamImage: player.teamImage,
                    ...aggregated,
                }
            }).filter(Boolean)

            setAggregatedStats(aggregatedPlayerStats)
            setFilteredStats(aggregatedPlayerStats)
        } catch (error) {
            console.error('Error fetching or aggregating stats:', error)
        } finally {
            setLoading(false)
            setIsFiltering(false)
        }
    }
    fetchAndAggregateStats()
    }, [timeFilter, teamFilter])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }
 
    const sortedAndPaginatedStats = useMemo(
        () => {
            if (!filteredStats) return []
            return [...filteredStats]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        },
        [filteredStats, order, orderBy, page, rowsPerPage]
    )
    
    if (loading && isFiltering) {
        return <BaseballLoadingSpinner/>
    }

    return (
        <div>
            <Paper sx={{ width: '90%', overflow: 'hidden', padding: '5%'}}>
                <FormControl sx={{mb: 2, minWidth: 200}}>
                    <InputLabel>Time Range</InputLabel>
                    <Select
                        value={timeFilter}
                        label="Time Range"
                        onChange={handleTimeFilterChange}
                    >
                        {timeRanges.map((range) => (
                            <MenuItem key={range.value} value={range.value}>
                                {range.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{mb: 2, minWidth: 200}}>
                    <InputLabel>Team</InputLabel>
                    <Select
                        value={teamFilter}
                        label="Team"
                        onChange={handleTeamFilterChange}
                    >
                        {teams.map((team) => (
                            <MenuItem key={team.value} value={team.value}>
                                {team.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TableContainer sx={{ height: '28em' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={aggregateStats.length}
                        />
                        <TableBody>
                            {sortedAndPaginatedStats.map((stat) => {
                                return (
                                    <TableRow 
                                        hover 
                                        role="checkbox" 
                                        tabIndex={-1} 
                                        key={stat.playerId.toString()}
                                        onClick={() => handleSelectPlayer(stat.playerId)}
                                        sx={{cursor: 'pointer'}}
                                    >
                                        {columns.map((column) => {
                                            const value = stat[column.id]
                                            if (['playerImage','teamImage'].includes(column.id)) {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        <img 
                                                            src={value} 
                                                            alt={column.label}
                                                            style={{
                                                                width: column.minWidth,
                                                                objectFit: 'cover',
                                                            }}
                                                        />
                                                    </TableCell>
                                                )
                                            }
                                            else {
                                                const backgroundColor = ['PA', 'AB', 'H', 'HR', 'BB', 'RBI', 'BA', 'OBP', 'SLG', 'OPS'].includes(column.id) 
                                                    ? getComparisonColor(parseFloat(value), leagueAverageStats[column.id]) 
                                                    : column.id === 'K' 
                                                        ? getComparisonColor(parseFloat(value), leagueAverageStats[column.id], true) 
                                                        : 'inherit'
                                                return (
                                                    <TableCell 
                                                        key={column.id} 
                                                        align={column.align} 
                                                        sx={{ backgroundColor }}
                                                    >
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                )
                                            }
                                        })}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[20, 50, 100]}
                    component="div"
                    count={aggregatedStats.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Dialog
                open={openChart}
                onClose={handleClosePlayer}
                maxWidth='md'
                fullWidth
            >
                <Box sx={{ position: 'absolute', left: 50, top: 16 }}>
                    <img src={selectedPlayer?.playerImage} style={{height: '50px', width: '50px', objectFit: 'cover'}} />
                </Box>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    {selectedPlayer?.playerFullName} - Season Rate Stats
                </DialogTitle>
                <DialogContent>
                    {selectedPlayerGameLogs.length > 0 && (
                        <RateStatChart gameLogs={selectedPlayerGameLogs} leagueAverageRateStats={leagueAverageStats}/>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PlayerStatsTable
