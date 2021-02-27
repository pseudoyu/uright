/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

const HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config();

const fullPathBuildDirectory = `${__dirname}/src/assets/contracts`;

module.exports = {

  plugins: ["truffle-security"],

  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  contracts_build_directory: fullPathBuildDirectory,
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      websockets: true
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC,
          "https://ropsten.infura.io/v3/" + process.env.INFURA_TOKEN, 0, 2),
      network_id: 3,
      gas: 3000000,
      gasPrice: 5000000000 // 5 Gwei
    },
    rinkeby: {
      provider: () => new HDWalletProvider("candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
          "https://rinkeby.infura.io/v3/" + process.env.INFURA_TOKEN, 0, 2),
      network_id: 4,
      gas: 3000000,
      gasPrice: 5000000000 // 5 Gwei
    },
    telsius: {
      // provider: () => new HDWalletProvider(process.env.MNEMONIC,
      //    process.env.NODE_RPC_URL, 0, 2),
      host: process.env.NODE_RPC_HOST, // without 'http://', e.g. HOST_IP/rpc
      port: process.env.NODE_RPC_PORT, // 80 if through nginx proxy
      from: process.env.NODE_RPC_FROM, // previously unlocked account in node
      network_id: 83584648538,
      gasPrice: 0,
      gas: 4500000,
      type: "quorum"
    },
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.2",       // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {             // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
      //  evmVersion: "byzantium"
      }
    }
  }
};
