const Manifestations = artifacts.require("./Manifestations.sol");
const Proxy = artifacts.require("./AdminUpgradeabilityProxy.sol");

module.exports = async function (deployer, network, accounts) {
  const owner = accounts[0];
  const proxyAdmin = accounts[1];

  const proxy = await Proxy.deployed();

  deployer.deploy(Manifestations, {from: owner}).then(function (manifestations) {
    return proxy.upgradeTo(manifestations.address, {from: proxyAdmin})
  });
};
