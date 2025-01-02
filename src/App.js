import React from 'react'
import PlayerStatsTable from './components/PlayerStatsTable';

export default function App() {
	return (
		<div>
			<header>
				<h2 style={{textAlign: 'center'}}>MLB Player Stats</h2>
			</header>
			<main>
				<PlayerStatsTable />
			</main>
		  </div>
	);
}
	

