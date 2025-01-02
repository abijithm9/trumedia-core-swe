
import { useTheme } from '@mui/material/styles'
import { LineChart } from '@mui/x-charts'

const RateStatChart = ({gameLogs, leagueAverageRateStats}) => {
    const theme = useTheme()

    const sortedGames = [...gameLogs].sort((a, b) => new Date(a.date) - new Date(b.date))
  
    const computeCumulativePlayerStats = () => {
        let playerStats = []
        let totalAB = 0
        let totalPA = 0
        let totalHits = 0
        let totalBB = 0
        let totalTB = 0

    sortedGames.forEach((sg) => {
        totalAB += sg.AB
        totalPA += sg.PA
        totalHits += sg.H
        totalBB += sg.BB
        totalTB += sg.TB

        const BA = totalAB > 0 ? totalHits / totalAB : 0.000
        const OBP = totalPA > 0 ? (totalHits + totalBB) / totalPA : 0.000
        const SLG = totalAB > 0 ? (totalTB / totalAB) : 0.000
        const OPS = parseFloat((OBP + SLG).toFixed(3))

        playerStats.push({
            date: new Date(sg.date),
            BA, 
            OBP,
            SLG,
            OPS
        })
    })
    return playerStats
}

    const cumulativePlayerStats = computeCumulativePlayerStats()
    const dates = cumulativePlayerStats.map(cps => cps.date)

    const series = [
        {
            label: 'BA',
            data: cumulativePlayerStats.map(cps => cps.BA),
            color: theme.palette.primary.main,
            valuePointRadius: 1,  
        },
        // {
        //     label: 'League AVG BA',
        //     data: Array(cumulativePlayerStats.length).fill(leagueAverageRateStats.BA),
        //     // color: theme.palette.primary.main,
        // },
        {
            label: 'OBP',
            data: cumulativePlayerStats.map(cps => cps.OBP),
            color: theme.palette.secondary.main,
        },
        // {
            // label: 'League AVG OBP',
            // data: Array(cumulativePlayerStats.length).fill(leagueAverageRateStats.OBP),
            // color: theme.palette.secondary.main,
        // },
        {
            label: 'SLG',
            data: cumulativePlayerStats.map(cps => cps.SLG),
            color: theme.palette.error.main,
        },
        // {
        //     label: 'League AVG SLG',
        //     data: Array(cumulativePlayerStats.length).fill(leagueAverageRateStats.SLG),
        //     color: theme.palette.error.main,
        // },
        {
            label: 'OPS',
            data: cumulativePlayerStats.map(cps => cps.OPS),
            color: theme.palette.success.main,
        },
        // {
        //     label: 'League AVG OPS',
        //     data: Array(cumulativePlayerStats.length).fill(leagueAverageRateStats.OPS),
        //     color: theme.palette.success.main,
        // }
    ]

    return (
        <LineChart
            height={300}
            series={series}
            xAxis={[{ 
                data: sortedGames.map((_, index) => index + 1),
                label: 'Game',
            }]}
            yAxis={[{ 
                label: 'Stat',
                min: 0,
                max: 1.5,
                tickFormat: (value) => value.toFixed(3)
            }]}
            legend={{ 
                position: 'top'
            }}
        />
    )
}

export default RateStatChart