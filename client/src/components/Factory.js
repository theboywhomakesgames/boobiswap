import * as React from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

import ERC20 from '../contracts/ERC20.json';

export default function Factory(props) {
	let factory = null;
	let accounts = null;
	let token = null;
	let has_provider = false;

	let erc20_input_value = '';

	const { onExchangeCreation, web3 } = props;

	try {
		accounts = props.accounts;
		const contracts = props.contracts;
		factory = contracts.factory;
		token = contracts.token;
		has_provider = true;
	}
	catch (err) { }

	const update_token_address_value = (evt) => {
		erc20_input_value = evt.target.value;
	};

	const create_exchange = async (token_address, factory, accounts, cb) => {
		console.log(token_address);
		console.log(accounts[0]);

		const token_contract = new web3.eth.Contract(
			ERC20.abi,
			token_address
		);

		let response = await token_contract.methods.balanceOf(
			accounts[0]
		).call();

		console.log(response);

		// allow the contract to spend ERC20 token
		await token_contract
			.methods
			.approve(factory._address, '5000000000000000000')
			.send({ from: accounts[0] }, (d) => {
				console.log(d);
			});

		// create exchange for the ERC20 token
		console.log("proceding");
		response = await factory.methods.createExchange(
			token_contract._address,
			'5000000000000000000'
		).send({ from: accounts[0], value: '1000000000000000000' }, (d) => {
			console.log(d);
		});

		response = await factory.methods.get_token_exchange(
			token_contract._address
		).call();

		cb(response, web3);
	}
	if (has_provider)
		return (
			<Card sx={{ minWidth: 275, maxWidth: 300 }}>
				<Grid container justifyContent={"center"}>
					<Box p={2}>
						<TextField
							id="erc20_address"
							label="ERC20 Address"
							variant="outlined"
							onChange={update_token_address_value}
						/>
					</Box>
					<Box pb={2}>
						<Button
							variant='contained'
							sx={{ minWidth: 200 }}
							onClick={() => { create_exchange(erc20_input_value, factory, accounts, onExchangeCreation) }}
						>
							Create Exchange
						</Button>
					</Box>
				</Grid>
			</Card>
		);
	else
		return (
			<div></div>
		);
}