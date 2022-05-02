import * as React from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box, Divider, Typography } from '@mui/material';

import ERC20 from '../contracts/ERC20.json';

import { ethers } from 'ethers';

let eth_input = '0';
let token_input = '0';

export default function Exchange(props) {
    let accounts = null;
    let token = null;
    let has_provider = false;

    const { web3, exchange } = props;

    const [e2tPrice, setE2TPrice] = React.useState('-');
    const [t2ePrice, setT2EPrice] = React.useState('-');
    const [price, setPrice] = React.useState('-');

    try {
        accounts = props.accounts;
        token = props.contracts.token;

        has_provider = true;
    }
    catch (err) { }

    const update_price = async (exchange) => {
        let eth_pool = ethers.BigNumber.from(await exchange.methods.get_eth_pool().call());
        let token_pool = ethers.BigNumber.from(await exchange.methods.get_token_pool().call());
        let invariant = eth_pool.mul(token_pool);

        let new_eth_pool = eth_pool.add(1);
        let new_token_pool = invariant.div(new_eth_pool);
        setPrice(token_pool.sub(new_token_pool).toString());

        try{
            console.log(ethers.BigNumber.from(eth_input));
            let new_eth_pool1 = eth_pool.add(ethers.BigNumber.from(eth_input));
            let new_token_pool1 = invariant.div(new_eth_pool1);
            console.log(token_pool.sub(new_token_pool1).toString());
            setE2TPrice(token_pool.sub(new_token_pool1).toString());
        }catch(err){}

        try{
            let new_token_pool2 = token_pool.add(ethers.BigNumber.from(token_input));
            let new_eth_pool2 = invariant.div(new_token_pool2);
            console.log(token_pool.sub(new_eth_pool2).toString());
            setT2EPrice(eth_pool.sub(new_eth_pool2).toString());
        }catch(err){}
    }

    const update_eth_input = (evt) => {
        eth_input = evt.target.value;
    };

    const update_token_input = (evt) => {
        token_input = evt.target.value;
    };

    const eth_to_token = async (exchange, accounts, value) => {
        console.log(value);
        setE2TPrice("WAITING");
        await exchange.methods.eth_to_token().send({
            from: accounts[0],
            value: value
        });
        setE2TPrice("DONE");
    };

    const token_to_eth = async (exchange, accounts, value) => {
        console.log(value);
        setT2EPrice("WAITING");

        const token_contract = new web3.eth.Contract(
			ERC20.abi,
			await exchange.methods.token_address().call()
		);

        await token_contract
			.methods
			.approve(exchange._address, value)
			.send({ from: accounts[0] }, (d) => {
				console.log(d);
			});

        await exchange.methods.token_to_eth(value).send({
            from: accounts[0]
        });
        setT2EPrice("DONE");
    };

    React.useEffect(() => {
        console.log(token);
        if(exchange)
            update_price(exchange);
    });

    if (has_provider)
        return (
            <Card sx={{ minWidth: 400, maxWidth: 400 }}>
                <Grid container direction={"column"} alignContent="center" justifyItems={"center"}>
                    <Box p={2}>
                        <Typography variant='h5' align='center'>Exchange {price}/ETH</Typography>
                        <Button
                            sx={{ minWidth: '100%' }}
                            onClick={() => { update_price(exchange); }}
                        >
                            Update Price
                        </Button>
                    </Box>
                    <Divider />
                    <Box p={2}>
                        <TextField
                            label="ETH Amount"
                            variant="outlined"
                            onChange={update_eth_input}
                        />
                    </Box>
                    <Box pb={2}>
                        <Button
                            sx={{ minWidth: '100%' }}
                            onClick={() => { eth_to_token(exchange, accounts, eth_input) }}
                        >
                            ETH 2 Token - {e2tPrice}
                        </Button>
                    </Box>
                    <Divider />
                    <Box p={2}>
                        <TextField
                            label="Token Amount"
                            variant="outlined"
                            onChange={update_token_input}
                        />
                    </Box>
                    <Box pb={2}>
                        <Button
                            sx={{ minWidth: '100%' }}
                            onClick={() => { token_to_eth(exchange, accounts, token_input) }}
                        >
                            Token 2 ETH - {t2ePrice}
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