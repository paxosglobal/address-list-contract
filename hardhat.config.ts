import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-chai-matchers';
import '@openzeppelin/hardhat-upgrades';
import "@nomiclabs/hardhat-solhint";
import 'solidity-coverage';
import "hardhat-gas-reporter"
import dotenv from 'dotenv';

dotenv.config();

const {
  PRIVATE_KEY,
  INFURA_API_KEY,
  MNUEMONIC_KEY
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
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      ...(PRIVATE_KEY ? { accounts: [PRIVATE_KEY] } : {}),
      ...(MNUEMONIC_KEY? { accounts: {
        mnemonic: MNUEMONIC_KEY,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 1,
        passphrase: "harshashah12345",
      }}: {}),
    },
  },
  gasReporter: {
    enabled: (process.env.GAS_REPORTER) ? true : false
  }
};

export default config;
