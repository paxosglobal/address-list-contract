import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { Contract, keccak256, toUtf8Bytes } from "ethers";
import { ethers, upgrades } from "hardhat";

const CONTRACT_NAME = "AddressRegistryOracleV1"

const roles = {
    ASSET_PROTECTION_ROLE: keccak256(toUtf8Bytes("ASSET_PROTECTION_ROLE")),
}

describe("AddressRegistryOracleV1 testing", function () {
    async function deployFixture() {
        const [owner, admin, assetProtector, addr1, addr2] = await ethers.getSigners();
        const AddressRegistryOracleV1 = await ethers.getContractFactory(CONTRACT_NAME);
        let contract = await upgrades.deployProxy(AddressRegistryOracleV1, ["test-name", "test-decription", admin.address, assetProtector.address], {
            initializer: "initialize",
        });
        contract = (contract.connect(assetProtector) as Contract);
        return { contract, owner, admin, assetProtector, addr1, addr2};
    }

    describe("Add/Remove testing", function () {
        it("Add address", async function () {
            const { contract, addr1 } = await loadFixture(deployFixture);

            expect((await contract.inAddrList(addr1.address))).to.equal(false);
            await contract.addToAddrList([addr1.address]);
            expect((await contract.inAddrList(addr1.address))).to.equal(true);
        });

        it("Add multiple address", async function () {
            const { contract, addr1, addr2 } = await loadFixture(deployFixture);

            expect((await contract.inAddrList(addr1.address))).to.equal(false);
            expect((await contract.inAddrList(addr2.address))).to.equal(false);
            await contract.addToAddrList([addr1.address, addr2.address]);
            expect((await contract.inAddrList(addr1.address))).to.equal(true);
            expect((await contract.inAddrList(addr2.address))).to.equal(true);
        });

        it("remove address", async function () {
            const { contract, addr1 } = await loadFixture(deployFixture);

            await contract.addToAddrList([addr1.address]);
            expect((await contract.inAddrList(addr1.address))).to.equal(true);
            await contract.removeFromAddrList([addr1.address]);
            expect((await contract.inAddrList(addr1.address))).to.equal(false);
        });

        it("remove all address", async function () {
            const { contract, addr1, addr2 } = await loadFixture(deployFixture);
            await contract.addToAddrList([addr1.address, addr2.address]);
            await contract.removeFromAddrList([addr1.address, addr2.address]);
            expect((await contract.inAddrList(addr1.address))).to.equal(false);
            expect((await contract.inAddrList(addr2.address))).to.equal(false);
        });

        it("Check if none of the addr is part of list", async function () {
            const { contract, addr1, addr2 } = await loadFixture(deployFixture);
            await contract.addToAddrList([addr1.address, addr2.address]);
            expect((await contract.anyAddrInList([addr1.address, addr2.address]))).to.equal(true);
            await contract.removeFromAddrList([addr1.address, addr2.address]);
            expect((await contract.anyAddrInList([addr1.address, addr2.address]))).to.equal(false);
        });

        it("Check if one of the addr is part of list", async function () {
            const { contract, addr1, addr2 } = await loadFixture(deployFixture);
            await contract.addToAddrList([addr1.address, addr2.address]);
            expect((await contract.anyAddrInList([addr1.address, addr2.address]))).to.equal(true);
            await contract.removeFromAddrList([addr2.address]);
            expect((await contract.anyAddrInList([addr1.address, addr2.address]))).to.equal(true);
        });
    });

    describe("Unauthorized access testing", function () {
        it("Unauthorized access to addToAddrList", async function () {
            const { contract, admin,  addr1 } = await loadFixture(deployFixture);

            await expect((contract.connect(admin) as Contract).addToAddrList([addr1.address])).to.be.revertedWith(
                `AccessControl: account ${admin.address.toLowerCase()} is missing role ${
                    roles.ASSET_PROTECTION_ROLE
                  }`
            );
        });

        it("Unauthorized access to removeFromAddrList", async function () {
            const { contract, admin,  addr1 } = await loadFixture(deployFixture);

            await expect((contract.connect(admin) as Contract).removeFromAddrList([addr1.address])).to.be.revertedWith(
                `AccessControl: account ${admin.address.toLowerCase()} is missing role ${
                    roles.ASSET_PROTECTION_ROLE
                  }`
            );
        });

    });


});