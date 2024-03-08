import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { Contract, keccak256, toUtf8Bytes } from "ethers";
import { ethers, upgrades } from "hardhat";

const CONTRACT_NAME = "PaxosSanctionedListV1"

const roles = {
    ASSET_PROTECTION_ROLE: keccak256(toUtf8Bytes("ASSET_PROTECTION_ROLE")),
}

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

        it("Add multiple address", async function () {
            const { contract, addr1, addr2 } = await loadFixture(deployFixture);

            expect((await contract.isAddrSanctioned(addr1.address))).to.equal(false);
            expect((await contract.isAddrSanctioned(addr2.address))).to.equal(false);
            await contract.sanctionAddress([addr1.address, addr2.address]);
            expect((await contract.isAddrSanctioned(addr1.address))).to.equal(true);
            expect((await contract.isAddrSanctioned(addr2.address))).to.equal(true);
        });

        it("Unsanction address", async function () {
            const { contract, addr1 } = await loadFixture(deployFixture);

            await contract.sanctionAddress([addr1.address]);
            expect((await contract.isAddrSanctioned(addr1.address))).to.equal(true);
            await contract.unSanctionAddress([addr1.address]);
            expect((await contract.isAddrSanctioned(addr1.address))).to.equal(false);
        });

        it("Unsanction multiple address", async function () {
            const { contract, addr1, addr2 } = await loadFixture(deployFixture);

            await contract.sanctionAddress([addr1.address, addr2.address]);
            expect((await contract.anyAddrSanctioned([addr1.address, addr2.address]))).to.equal(true);
            await contract.unSanctionAddress([addr1.address, addr2.address]);
            expect((await contract.anyAddrSanctioned([addr1.address, addr2.address]))).to.equal(false);
        });

        /*it("sanction only one address", async function () {
            const { contract, addr1, addr2 } = await loadFixture(deployFixture);
            await contract.sanctionAddress([addr1.address]);
            expect((await contract.anyAddrSanctioned([addr1.address, addr2.address]))).to.equal(true);
        });*/
    });

    describe("Unauthorized access testing", function () {
        it("Unauthorized access to sanctionAddress", async function () {
            const { contract, admin,  addr1 } = await loadFixture(deployFixture);

            await expect((contract.connect(admin) as Contract).sanctionAddress([addr1.address])).to.be.revertedWith(
                `AccessControl: account ${admin.address.toLowerCase()} is missing role ${
                    roles.ASSET_PROTECTION_ROLE
                  }`
            );
        });

        it("Unauthorized access to unSanctionAddress", async function () {
            const { contract, admin,  addr1 } = await loadFixture(deployFixture);

            await expect((contract.connect(admin) as Contract).unSanctionAddress([addr1.address])).to.be.revertedWith(
                `AccessControl: account ${admin.address.toLowerCase()} is missing role ${
                    roles.ASSET_PROTECTION_ROLE
                  }`
            );
        });

    });


});