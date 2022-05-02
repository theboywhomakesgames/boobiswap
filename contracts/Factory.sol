pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Exchange.sol";

// 500000000000000000000
contract Factory{
    mapping(address=>bool) public registered;
    mapping(address=>address) public exchangeBank;

    constructor() {

    }

    function createExchange(address token_address, uint256 initial_pool) public payable
        returns(address)
    {
        if(registered[token_address]){
            return exchangeBank[token_address];
        }else{
            ERC20 token = ERC20(token_address);
            address new_exchange_address = address(new Exchange(token_address));

            token.transferFrom(msg.sender, new_exchange_address, initial_pool);
            (bool success, ) = payable(new_exchange_address).call{value: msg.value}("");
            require(success, "err paying eth");

            exchangeBank[token_address] = new_exchange_address;
            registered[token_address] = true;

            return new_exchange_address;
        }
    }

    function get_token_exchange(address token_address) public view returns(address){
        if(registered[token_address]){
            return exchangeBank[token_address];
        }
        else{
            revert();
        }
    }
}