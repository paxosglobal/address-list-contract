const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AccessRegistryOracleV1 testing", function () {
    async function deployFixture() {
        const [owner, addr1, addr2, addr3] = await ethers.getSigners();

        const registryContract = await ethers.deployContract("AccessRegistryOracleV1");

        return { registryContract, owner, addr1, addr2 , addr3};
    }

    describe("Authorizable testing", function () {
        it("validate authorization state after add/remove action by owner", async function () {
            const { registryContract, addr1 } = await loadFixture(deployFixture);

            // by default, there is not authorization
            expect(await registryContract.isAuthorized(addr1.address)).to.equal(false);

            // We added an address, which is now authorized
            await registryContract.addAuthorization(addr1.address);
            expect(await registryContract.isAuthorized(addr1.address)).to.equal(true);

            // Re-adding the authorization should not fail
            await registryContract.addAuthorization(addr1.address);

            // We remove the address, which is now not authorized
            await registryContract.removeAuthorization(addr1.address);
            expect(await registryContract.isAuthorized(addr1.address)).to.equal(false);

            // Re-removing the authorization should not fail
            await registryContract.removeAuthorization(addr1.address)
        });

        it("non-owner unable to call any API", async function () {
            const { registryContract, addr1 } = await loadFixture(deployFixture);
            await expect(registryContract.connect(addr1).addAuthorization(addr1.address)).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(registryContract.connect(addr1).removeAuthorization(addr1.address)).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(registryContract.connect(addr1).isAuthorized(addr1.address)).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });


    describe("AccessRegistryOracle testing", function () {
        it("add/remove to Allow List and validate", async function () {
            const { registryContract, addr1, addr2, addr3 } = await loadFixture(deployFixture);

            // By default, no addresses exist.
            expect(await registryContract.isAllowed(addr1.address)).to.equal(false);
            expect(await registryContract.isAllowed(addr2.address)).to.equal(false);
            expect(await registryContract.isAllowed(addr3.address)).to.equal(false);

            // add couple of address to allowList
            await registryContract.addToAllowList([addr1, addr2]);

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
    });


});