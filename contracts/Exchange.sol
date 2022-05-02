pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange{
    uint256 public eth_pool;
    uint256 public token_pool;

    address public token_address;
    ERC20 public token;

    constructor(address ta) payable {
        token_address = ta;
        token = ERC20(token_address);
    }

    receive() external payable{
        
    }

    function get_eth_pool() public view returns(uint256){
        return address(this).balance;
    }

    function get_token_pool() public view returns(uint256){
        return token.balanceOf(address(this));
    }

    function eth_to_token() public payable {
        eth_pool = address(this).balance;
        token_pool = token.balanceOf(address(this));

        // set variables
        uint256 fee = msg.value / 500;
        uint256 invariant = eth_pool * token_pool;
        uint256 new_eth_pool = eth_pool + msg.value;
        uint256 new_token_pool = invariant / (new_eth_pool - fee);

        // calculate price
        uint256 tokens_out = token_pool - new_token_pool;

        // transfer
        token.transfer(msg.sender, tokens_out);
        token_pool = new_token_pool;
        eth_pool = new_eth_pool;
    }

    function token_to_eth(uint256 tokens_in) public {
        eth_pool = address(this).balance;
        token_pool = token.balanceOf(address(this));

        // set variables
        uint256 fee = tokens_in / 500;
        uint256 invariant = eth_pool * token_pool;
        uint256 new_token_pool = token_pool + tokens_in;
        uint256 new_eth_pool = invariant / (new_token_pool - fee);

        // calculate price
        uint256 eth_out = eth_pool - new_eth_pool;

        // transfer
        token.transferFrom(msg.sender, address(this), tokens_in);
        payable(msg.sender).transfer(eth_out);
        token_pool = new_token_pool;
        eth_pool = new_eth_pool;
    }
}