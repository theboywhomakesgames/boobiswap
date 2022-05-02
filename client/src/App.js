import React, { Component } from "react";
import getWeb3 from "./getWeb3";

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Factory from './components/Factory';
import Exchange from './components/Exchange';

import "./App.css";

import TestTokenArtifact from "./contracts/Test1.json";
import FactoryArtifact from "./contracts/Factory.json";
import ExchangeArtifact from "./contracts/Exchange.json";

// Test Token
const TST_ADDRESS = "0x048d846F993A0D116253F8708Fab9a7f7A59bd79";

// Factory
const FACTORY_ADDRESS = "0x5527829C490b8E13E46Dc62c43a3F81F7d78Dd61";

class App extends Component {
	state = { storageValue: 0, web3: null, accounts: null, contracts: null, exchanges: [] };

	componentDidMount = async () => {
		try {
			// Get network provider and web3 instance.
			const web3 = await getWeb3();

			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();

			// Get the factory contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork1 = FactoryArtifact.networks[networkId];
			const factory_contract = new web3.eth.Contract(
				FactoryArtifact.abi,
				deployedNetwork1 && deployedNetwork1.address,
			);

			// Set web3, accounts, and contract to the state, and then proceed with an
			this.setState({ web3, accounts, contracts: { factory: factory_contract } }, () => {
				console.log("successfully connected the wallet");
			});
		} catch (error) {
			// Catch any errors for any of the above operations.
			alert(
				`Failed to load web3, accounts, or contract. Check console for details.`,
			);
			console.error(error);
		}
	};

	onExchangeCreation = (exchangeAddress, web3) => {
		const exchange_contract = new web3.eth.Contract(
			ExchangeArtifact.abi,
			exchangeAddress
		);

		this.setState({ exchanges: [...this.state.exchanges, exchange_contract] }, () => {
			console.log("exchange added");
		});
	};

	render() {
		return (
			<Container maxWidth="sm">
				<Grid container spacing={2} justifyContent='center'>
					<img src="./BoobiSwap.png" />
					<Box mt={6}>
						<Factory
							contracts={this.state.contracts}
							accounts={this.state.accounts}
							web3={this.state.web3}
							onExchangeCreation={this.onExchangeCreation}
						/>
					</Box>
					{this.state.exchanges.map((item, i) => {
						return (
							<Box key={i} p={6}>
								<Exchange
									contracts={this.state.contracts}
									accounts={this.state.accounts}
									web3={this.state.web3}
									exchange={item}
								/>
							</Box>
						);
					})}
				</Grid>
			</Container>
		);
	}
}

export default App;
