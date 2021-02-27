const Proxy = artifacts.require("./AdminUpgradeabilityProxy.sol");
const Complaints = artifacts.require("./Complaints.sol");

module.exports = async function (deployer, network, accounts) {
  const owner = accounts[0];

  const proxy = await Proxy.deployed();
  await deployer.deploy(Complaints, proxy.address, {from: owner});
};
