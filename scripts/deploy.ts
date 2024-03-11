const { ethers, upgrades } = require("hardhat");

const { ADMIN_ADDRESS, ASSET_PROTECTOR } = process.env;

const initializerArgs = [
  ADMIN_ADDRESS,
  ASSET_PROTECTOR
]

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deployer: %s', await deployer.getAddress());

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('Account balance: %s', ethers.formatEther(balance));
  
  console.log("\nDeploying the contract...")
  const contractFactory = await ethers.getContractFactory('PaxosSanctionedListV1');

  const contract = await upgrades.deployProxy(contractFactory, initializerArgs, {
    initializer: 'initialize',
    kind: 'uups',
  });

  console.log("Deploy tx: %s", contract.deploymentTransaction().hash)

  await contract.waitForDeployment();

  console.log('contract proxy address: %s',contract.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
