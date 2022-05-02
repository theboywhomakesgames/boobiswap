var Exchange = artifacts.require("./Exchange.sol");
var Factory = artifacts.require("./Factory.sol");
var TestToken = artifacts.require("./Test1.sol");

module.exports = function(deployer) {
  deployer.deploy(TestToken);
  deployer.deploy(Factory);
};