import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { Contract, keccak256, toUtf8Bytes, ZeroAddress, ZeroHash } from "ethers";
import { ethers, upgrades } from "hardhat";

const CONTRACT_NAME = "AddressListV1"

const roles = {
    ADDR_LIST_UPDATE_ROLE: keccak256(toUtf8Bytes("ADDR_LIST_UPDATE_ROLE"))
}

describe("AddressListV1 testing", function () {
    async function deployFixture() {
        const [owner, admin, addrListModifier, addr1, addr2] = await ethers.getSigners();
        const AddressListV1 = await ethers.getContractFactory(CONTRACT_NAME);

        let contract = await upgrades.deployProxy(AddressListV1, ["test-name", "test-description", admin.address, addrListModifier.address], {
            initializer: "initialize",
        });

        contract = (contract.connect(addrListModifier) as Contract);
        return { contract, owner, admin, addrListModifier, addr1, addr2};
    }

    describe("Initialization testing", function () {
        it("validate name and description", async function () {
            const { contract } = await loadFixture(deployFixture);

            expect(await contract.name()).to.equal("test-name");
            expect(await contract.description()).to.equal("test-description");
        });

        it("update name and description", async function () {
            const { contract, admin } = await loadFixture(deployFixture);
            const newName = "new-name";
            const newDescription = "new-description";

            expect(await (contract.connect(admin) as Contract).updateContractDetails(newName, newDescription)).to.emit(contract, "UpdateContractDetailsSet");
            expect(await contract.name()).to.equal(newName);
            expect(await contract.description()).to.equal(newDescription);
        });

        it("re-initialize should not work", async function () {
            const { contract, admin, addrListModifier } = await loadFixture(deployFixture);

            await expect(contract.initialize("new-name", "new-description", admin.address, addrListModifier.address)).to.be.revertedWith("Initializable: contract is already initialized");
        });

        it("zero address as addr list updater", async function () {
            const [admin] = await ethers.getSigners();
            const AddressListV1 = await ethers.getContractFactory(CONTRACT_NAME);

            let initializerArgs = ["test-name", "test-description", admin.address, ZeroAddress];

            await expect(upgrades.deployProxy(AddressListV1, initializerArgs, {
                initializer: "initialize",
            })).to.be.revertedWithCustomError(AddressListV1, "ZeroAddress");
        });

        it("zero address as admin protection", async function () {
            const [addrListModifier] = await ethers.getSigners();
            const AddressListV1 = await ethers.getContractFactory(CONTRACT_NAME);

            let initializerArgs = ["test-name", "test-description", ZeroAddress, addrListModifier.address];
            
            await expect(upgrades.deployProxy(AddressListV1, initializerArgs, {
                initializer: "initialize",
            })).to.be.revertedWith("AccessControl: 0 default admin");
        });

        it("invalid name argument for initialize ", async function () {
            const [addrListModifier] = await ethers.getSigners();
            const AddressListV1 = await ethers.getContractFactory(CONTRACT_NAME);

            await expect(upgrades.deployProxy(AddressListV1, ["", "test-description", ZeroAddress, addrListModifier.address], {
                initializer: "initialize",
            })).to.be.revertedWithCustomError(AddressListV1, "InvalidName");
        });

        it("invalid description argument for initialize ", async function () {
            const [addrListModifier] = await ethers.getSigners();
            const AddressListV1 = await ethers.getContractFactory(CONTRACT_NAME);

            await expect(upgrades.deployProxy(AddressListV1, ["test-name", "", ZeroAddress, addrListModifier.address], {
                initializer: "initialize",
            })).to.be.revertedWithCustomError(AddressListV1, "InvalidDescription");
        });

    });

    describe("Add/Remove address testing", function () {
        it("add address", async function () {
            const { contract, addr1 } = await loadFixture(deployFixture);

            expect((await contract.inAddrList(addr1.address))).to.equal(false);
            expect(await contract.addToAddrList([addr1.address]))
                .to.emit(contract, "AddToAddrList").withArgs(addr1.address);
            expect((await contract.inAddrList(addr1.address))).to.equal(true);
        });

        it("add multiple addresses", async function () {
            const { contract, addr1, addr2 } = await loadFixture(deployFixture);

            expect((await contract.inAddrList(addr1.address))).to.equal(false);
            expect((await contract.inAddrList(addr2.address))).to.equal(false);
            expect(await contract.addToAddrList([addr1.address, addr2.address]))
                .to.emit(contract, "AddToAddrList").withArgs(addr1.address)
                .to.emit(contract, "AddToAddrList").withArgs(addr2.address);
            expect((await contract.inAddrList(addr1.address))).to.equal(true);
            expect((await contract.inAddrList(addr2.address))).to.equal(true);
        });

        it("remove address", async function () {
            const { contract, addr1 } = await loadFixture(deployFixture);

            await contract.addToAddrList([addr1.address]);
            expect((await contract.inAddrList(addr1.address))).to.equal(true);
            expect(await contract.removeFromAddrList([addr1.address]))
                .to.emit(contract, "RemoveFromAddrList").withArgs(addr1.address);
            expect((await contract.inAddrList(addr1.address))).to.equal(false);
        });

        it("remove all addresses", async function () {
            const { contract, addr1, addr2 } = await loadFixture(deployFixture);

            await contract.addToAddrList([addr1.address, addr2.address]);
            expect(await contract.removeFromAddrList([addr1.address, addr2.address]))
                .to.emit(contract, "RemoveFromAddrList").withArgs(addr1.address)
                .to.emit(contract, "RemoveFromAddrList").withArgs(addr2.address);
            expect((await contract.inAddrList(addr1.address))).to.equal(false);
            expect((await contract.inAddrList(addr2.address))).to.equal(false);
        });

        it("check if none of the address is part of list", async function () {
            const { contract, addr1, addr2 } = await loadFixture(deployFixture);

            await contract.addToAddrList([addr1.address, addr2.address]);
            expect((await contract.isAnyAddrInList([addr1.address, addr2.address]))).to.equal(true);
            await contract.removeFromAddrList([addr1.address, addr2.address]);
            expect((await contract.isAnyAddrInList([addr1.address, addr2.address]))).to.equal(false);
        });

        it("check if one of the address is part of list", async function () {
            const { contract, addr1, addr2 } = await loadFixture(deployFixture);

            await contract.addToAddrList([addr1.address, addr2.address]);
            expect((await contract.isAnyAddrInList([addr1.address, addr2.address]))).to.equal(true);
            await contract.removeFromAddrList([addr2.address]);
            expect((await contract.isAnyAddrInList([addr1.address, addr2.address]))).to.equal(true);
        });
    });

    describe("Unauthorized access testing", function () {
        it("unauthorized access to addToAddrList", async function () {
            const { contract, admin, addr1 } = await loadFixture(deployFixture);

            await expect((contract.connect(admin) as Contract).addToAddrList([addr1.address])).to.be.revertedWith(
                `AccessControl: account ${admin.address.toLowerCase()} is missing role ${
                    roles.ADDR_LIST_UPDATE_ROLE
                  }`
            );
        });

        it("unauthorized access to removeFromAddrList", async function () {
            const { contract, admin, addr1 } = await loadFixture(deployFixture);

            await expect((contract.connect(admin) as Contract).removeFromAddrList([addr1.address])).to.be.revertedWith(
                `AccessControl: account ${admin.address.toLowerCase()} is missing role ${
                    roles.ADDR_LIST_UPDATE_ROLE
                  }`
            );
        });

        it("unauthorized access to _updateContractDetails", async function () {
            const { contract, admin, addr1 } = await loadFixture(deployFixture);

            await expect((contract.connect(addr1) as Contract).updateContractDetails("new-name","new-description")).to.be.revertedWith(
                `AccessControl: account ${addr1.address.toLowerCase()} is missing role ${
                    ZeroHash
                  }`
            );
        });

    });

    describe("Contract upgrade testing", function () {
        it("can upgrade contract with admin role", async () => {
            const { contract, admin } = await loadFixture(deployFixture);
            const newContract = await ethers.deployContract(CONTRACT_NAME);

            await expect((contract.connect(admin) as Contract).upgradeTo(newContract)).to.not.be.reverted;
        });
    
        it("cannot upgrade contract without admin role", async () => {
            const { contract, addr1 } = await loadFixture(deployFixture);
    
            await expect(
                (contract.connect(addr1) as Contract).upgradeTo(ZeroAddress)
            ).to.be.revertedWith(
                `AccessControl: account ${addr1.address.toLowerCase()} is missing role ${
                ZeroHash
            }`
          );
        });
    });
});