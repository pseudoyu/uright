const ENSRegistry = artifacts.require("\@ensdomains/ens/ENSRegistry.sol");
const PublicResolver = artifacts.require("\@ensdomains/ens/PublicResolver.sol");
const ReverseRegistrar = artifacts.require("\@ensdomains/ens/ReverseRegistrar.sol");

const namehash = require("eth-ens-namehash");

module.exports = async function (deployer, network, accounts) {
  const owner = accounts[0];
  const rootNode = web3.utils.asciiToHex(0);

  deployer.then(async () => {
    if (network === "development") {
      await deployer.deploy(ENSRegistry);
      await deployer.deploy(PublicResolver, ENSRegistry.address);
      await deployer.deploy(ReverseRegistrar, ENSRegistry.address, PublicResolver.address);

      const ens = await ENSRegistry.deployed();
      const resolver = await PublicResolver.deployed();
      const reverseResolver = await ReverseRegistrar.deployed();

      await ens.setSubnodeOwner(rootNode, sha3('eth'), owner);
      await ens.setSubnodeOwner(rootNode, sha3('reverse'), owner);
      await ens.setSubnodeOwner(namehash.hash('reverse'), sha3('addr'), reverseResolver.address);

      return Promise.all([
        setENSName(ens, resolver, reverseResolver, accounts[0], 'Alice', owner),
        setENSName(ens, resolver, reverseResolver, accounts[1], 'Bob', owner),
        setENSName(ens, resolver, reverseResolver, accounts[2], 'Charlie', owner),
      ]);
    }
  });
};

function sha3(string) {
  return web3.utils.sha3(string);
}

async function setENSName(ens, resolver, reverseResolver, address, name, owner) {
  await ens.setSubnodeOwner(namehash.hash('eth'), sha3(name), address, {from: owner});
  return reverseResolver.setName(`${name}.eth`, {from: address});
}
