import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-chai-matchers';
import "@nomicfoundation/hardhat-verify";
import '@openzeppelin/hardhat-upgrades';
import "@nomiclabs/hardhat-solhint";
import 'solidity-coverage';
import "hardhat-gas-reporter"
import dotenv from 'dotenv';

dotenv.config();

const {
  PRIVATE_KEY,
  NETWORK_URL,
  CHAINSCAN_API_KEY
} = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    ethMain: {
      url: NETWORK_URL,
      ...(PRIVATE_KEY ? { accounts: [PRIVATE_KEY] } : {}),
    },
    ethSepolia: {
      url: NETWORK_URL,
      ...(PRIVATE_KEY ? { accounts: [PRIVATE_KEY] } : {}),
    },
    polygonMain: {
      url: NETWORK_URL,
      ...(PRIVATE_KEY ? { accounts: [PRIVATE_KEY] } : {}),
    },
    polygonMumbai: {
      url: NETWORK_URL,
      ...(PRIVATE_KEY ? { accounts: [PRIVATE_KEY] } : {}),
    },
    polygonAmoy: {
      url: NETWORK_URL,
      ...(PRIVATE_KEY ? { accounts: [PRIVATE_KEY] } : {}),
    },
  },
  gasReporter: {
    enabled: (process.env.GAS_REPORTER) ? true : false
  },
  etherscan: {
    apiKey: CHAINSCAN_API_KEY,
  },
};

export default config;
