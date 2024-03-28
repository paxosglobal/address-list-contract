const { ethers, upgrades } = require("hardhat");
import { getImplementationAddress } from '@openzeppelin/upgrades-core';

const { ADMIN_ADDRESS, ASSET_PROTECTOR, NAME, DESCRIPTION } = process.env;

const initializerArgs = [
  NAME,
  DESCRIPTION,
  ADMIN_ADDRESS,
  ASSET_PROTECTOR
]

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deployer: %s', await deployer.getAddress());

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('Account balance: %s', ethers.formatEther(balance));
  
  console.log("\nDeploying the contract...")
  const contractFactory = await ethers.getContractFactory('AddressListV1');

  const contract = await upgrades.deployProxy(contractFactory, initializerArgs, {
    initializer: 'initialize',
    kind: 'uups',
  });

  console.log("Deploy tx: %s", contract.deploymentTransaction().hash)

  await contract.waitForDeployment();

  console.log('Contract proxy address: %s',contract.target);
  console.log('Implementation address: %s',await getImplementationAddress(ethers.provider, contract.target))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
