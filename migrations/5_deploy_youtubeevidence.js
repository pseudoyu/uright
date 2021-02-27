const Manifestations = artifacts.require("./Manifestations.sol");
const Proxy = artifacts.require("./AdminUpgradeabilityProxy.sol");
const YouTubeEvidences = artifacts.require("./YouTubeEvidences.sol");

module.exports = async function(deployer, network, accounts) {
  let customGasPrice = 10000000000; // 10 GWei
  if (network === "telsius" )
    customGasPrice = 0;

  await deployer.deploy(YouTubeEvidences, customGasPrice);

  const proxy = await Proxy.deployed();
  const youTubeEvicences = await YouTubeEvidences.deployed();
  const proxied = await Manifestations.at(proxy.address);

  await proxied.addEvidenceProvider(youTubeEvicences.address);
};
