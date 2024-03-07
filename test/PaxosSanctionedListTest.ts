import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, upgrades } from "hardhat";

const CONTRACT_NAME = "PaxosSanctionedListV1"

describe("PaxosSanctionedListV1 testing", function () {
    async function deployFixture() {
        const [owner, admin, assetProtector, addr1, addr2] = await ethers.getSigners();
        const PaxosSanctionedListV1 = await ethers.getContractFactory(CONTRACT_NAME);
        let contract = await upgrades.deployProxy(PaxosSanctionedListV1, [admin.address, assetProtector.address], {
            initializer: "initialize",
        });
        contract = (contract.connect(assetProtector) as Contract);
        return { contract, owner, admin, assetProtector, addr1, addr2};
    }

    describe("Basic testing", function () {
        it("Add address", async function () {
            const { contract, addr1 } = await loadFixture(deployFixture);

            expect((await contract.isAddrSanctioned(addr1.address))).to.equal(false);
            await contract.sanctionAddress([addr1.address]);
            expect((await contract.isAddrSanctioned(addr1.address))).to.equal(true);
        });
    });

    /*describe("AccessRegistryOracle testing", function () {
        it("add/remove to Allow List and validate", async function () {
            const { registryContract, addr1, addr2, addr3 } = await loadFixture(deployFixture);

            // By default, no addresses exist.
            expect(await registryContract.isAllowed(addr1.address)).to.equal(false);
            expect(await registryContract.isAllowed(addr2.address)).to.equal(false);
            expect(await registryContract.isAllowed(addr3.address)).to.equal(false);


            let address = []
            for (var i = 0; i < 1; i++) {
                address.push(addr1);
            }
            // add couple of address to allowList
            result = await registryContract.addToAllowList(address);
            console.log(result);
            const transactionReceipt = await ethers.provider.getTransactionReceipt(result.hash);
            console.log("gas used ", transactionReceipt.gasUsed);


            // address are in the allow list
            expect(await registryContract.isAllowed(addr1.address)).to.equal(true);
            expect(await registryContract.isAllowed(addr2.address)).to.equal(true);
            expect(await registryContract.isAllowed(addr3.address)).to.equal(false);

            // Re-adding the address should not fail
            await registryContract.addToAllowList([addr1, addr2]);

            //Remove a valid address and one non existent address.
            await registryContract.removeFromAllowList([addr1, addr3]);
            expect(await registryContract.isAllowed(addr1.address)).to.equal(false);
            expect(await registryContract.isAllowed(addr2.address)).to.equal(true);
            expect(await registryContract.isAllowed(addr3.address)).to.equal(false);
        });

        it("non-authorized user should not be able to call any API", async function () {
            const { registryContract, addr1} = await loadFixture(deployFixture);
            await expect(registryContract.connect(addr1).addToAllowList([addr1.address])).to.be.revertedWithCustomError(registryContract, "NotAuthorized");
            await expect(registryContract.connect(addr1).removeFromAllowList([addr1.address])).to.be.revertedWithCustomError(registryContract, "NotAuthorized");
            await expect(registryContract.connect(addr1).isAllowed(addr1.address)).to.be.revertedWithCustomError(registryContract, "NotAuthorized");
            await expect(registryContract.connect(addr1).isBlocked(addr1.address)).to.be.revertedWithCustomError(registryContract, "NotAuthorized");

        });

        it("add/remove to Block List and validate", async function () {
            const { registryContract, addr1, addr2, addr3 } = await loadFixture(deployFixture);

            // By default, no addresses exist.
            expect(await registryContract.isBlocked(addr1.address)).to.equal(false);
            expect(await registryContract.isBlocked(addr2.address)).to.equal(false);
            expect(await registryContract.isBlocked(addr3.address)).to.equal(false);

            // add couple of address to blockList
            await registryContract.addToBlockList([addr1, addr2]);

            // address added are in the block list
            expect(await registryContract.isBlocked(addr1.address)).to.equal(true);
            expect(await registryContract.isBlocked(addr2.address)).to.equal(true);
            expect(await registryContract.isBlocked(addr3.address)).to.equal(false);

            // Re-adding the address should not fail
            await registryContract.addToBlockList([addr1, addr2]);

            //Remove a blocked address and non-existent address.
            await registryContract.removeFromBlockList([addr1, addr3]);
            expect(await registryContract.isBlocked(addr1.address)).to.equal(false);
            expect(await registryContract.isBlocked(addr2.address)).to.equal(true);
            expect(await registryContract.isBlocked(addr3.address)).to.equal(false);

        });
    });*/


});