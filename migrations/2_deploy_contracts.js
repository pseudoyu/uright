const Manifestations = artifacts.require("./Manifestations.sol");
const SafeMath = artifacts.require("./SafeMath.sol");
const ExpirableLib = artifacts.require("./ExpirableLib.sol");
const Proxy = artifacts.require("./AdminUpgradeabilityProxy.sol");
const UploadEvidences = artifacts.require("./UploadEvidences.sol");

module.exports = async function(deployer, network, accounts) {
  const owner = accounts[0];
  const proxyAdmin = accounts[1];
  const timeToExpiry = 60 * 60 * 24;  // 24h

  await deployer.deploy(SafeMath);
  await deployer.link(SafeMath, [ExpirableLib, Manifestations]);
  await deployer.deploy(ExpirableLib);
  await deployer.link(ExpirableLib, [Manifestations]);
  await deployer.deploy(Manifestations, timeToExpiry);
  await deployer.deploy(Proxy, Manifestations.address, proxyAdmin, []);
  await deployer.deploy(UploadEvidences);

  const manifestations = await Manifestations.deployed();
  const proxy = await Proxy.deployed();
  const uploadEvidences = await UploadEvidences.deployed();
  const proxied = await Manifestations.at(proxy.address);

  await proxied.initialize(timeToExpiry);
  await proxied.addEvidenceProvider(uploadEvidences.address);
};
