// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Test1 is ERC20 {
    constructor() ERC20("Test1", "TST") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}