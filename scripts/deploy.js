const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  const contract = await ethers.deployContract("AccessRegistryOracle");

  await contract.waitForDeployment();

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
