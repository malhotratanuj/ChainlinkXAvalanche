// hardhat.config.js

require("dotenv").config()
require("@nomiclabs/hardhat-ethers")
 
module.exports = {
  solidity: "0.8.6",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    fuji: {
      url: "https://quaint-green-cherry.avalanche-testnet.quiknode.pro/61620aa241785ec33ddaebbfe8ffe2e801732308/ext/bc/C/rpc/",
      accounts: ['0x8c105d6f766052e234ea13f70c18819905c64b9a27daf0392580594f45842a94'],
      chainId: 43113,
    },
  },
}