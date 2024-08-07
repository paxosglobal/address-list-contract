// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {AccessControlDefaultAdminRulesUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlDefaultAdminRulesUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IAddressList} from "./IAddressList.sol";

/**
 * @title AddressList: Manage a list of addresses.
 */
contract AddressList is IAddressList, AccessControlDefaultAdminRulesUpgradeable, UUPSUpgradeable {
    // DATA
    // Name of the contract.
    string public name;
    // Contract usage details.
    string public description;
    // Mapping of address to membership status.
    mapping(address => bool) internal _addrList;
    // Storage GAP
    uint256[23] private __gap_AddressList; // solhint-disable-line var-name-mixedcase
    // DATA ENDS

    // keccak256("ADDR_LIST_UPDATE_ROLE")
    bytes32 public constant ADDR_LIST_UPDATE_ROLE = 0x0723b03415002f06422f98c2d569ea0040321d014ea2d3686ab39551941dcade;

    // Events
    event AddToAddrList(address indexed addr);
    event RemoveFromAddrList(address indexed addr);
    event UpdateContractDetailsSet();

    // Errors
    error ZeroAddress();
    error InvalidName();
    error InvalidDescription();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initializes the contract
     * @dev Called on deployment, only can be called once.
     * @param name_ name of contract
     * @param description_ description of the contract
     * @param admin address of the default admin
     * @param addrListUpdater address of the addr list maintainer
     */
    function initialize(
        string memory name_,
        string memory description_,
        address admin,
        address addrListUpdater
    ) external initializer {

        // admin role is checked by OZ's AccessControlDefaultAdminRules
        if (addrListUpdater == address(0)) {
            revert ZeroAddress();
        }

        _updateContractDetails(name_, description_);

        __AccessControlDefaultAdminRules_init(3 hours, admin);
        __UUPSUpgradeable_init();

        _grantRole(ADDR_LIST_UPDATE_ROLE, addrListUpdater);
    }

    /**
     * @notice Update contract's details.
     * @param name_ name of contract
     * @param description_ description of the contract
     */
    function updateContractDetails(
        string memory name_,
        string memory description_
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _updateContractDetails(name_, description_);
    }

    /**
     * @notice Add to addr list.
     * @param toAddAddresses address[] This is the list of addresses to add to addr list.
     */
    function addToAddrList(
        address[] calldata toAddAddresses
    ) external onlyRole(ADDR_LIST_UPDATE_ROLE) {
        for (uint i = 0; i < toAddAddresses.length;) {
            _addrList[toAddAddresses[i]] = true;
            emit AddToAddrList(toAddAddresses[i]);
            unchecked { ++i; }
        }
    }

    /**
     * @notice Remove from addr list.
     * @param toRemoveAddresses address[] This is the list of addresses to remove from addr list.
     */
    function removeFromAddrList(
        address[] calldata toRemoveAddresses
    ) external onlyRole(ADDR_LIST_UPDATE_ROLE) {
        for (uint i = 0; i < toRemoveAddresses.length;) {
            delete _addrList[toRemoveAddresses[i]];
            emit RemoveFromAddrList(toRemoveAddresses[i]);
            unchecked { ++i; }
        }
    }

    /**
     * @notice Check if address is part of addr list.
     * @param addr address Check if this address is part of addr list.
     * @return bool True if address is part of addr list, false otherwise.
     */
    function inAddrList(
        address addr
    ) public view returns (bool) {
        return _addrList[addr];
    }

    /**
     * @notice Are any given address in list.
     * @param addresses address[] This is the list of addresses to check if any of them is part of list.
     */
    function isAnyAddrInList(
        address[] calldata addresses
    ) external view returns (bool) {
        for (uint256 i = 0; i < addresses.length;) {
            if (inAddrList(addresses[i])) {
                return true;
            }
            unchecked { ++i; }
        }
        return false;
    }

    /**
     * @dev required by the OZ UUPS module to authorize an upgrade 
     * of the contract. Restricted to DEFAULT_ADMIN_ROLE.
     */
    function _authorizeUpgrade(
        address
    ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {} // solhint-disable-line no-empty-blocks


    /**
     * @dev internal function to update contract's name and description.
     * @param name_ name of contract
     * @param description_ description of the contract
     */
    function _updateContractDetails(
        string memory name_,
        string memory description_
    ) private {
        if (bytes(name_).length == 0) {
            revert InvalidName();
        }

        if (bytes(description_).length == 0) {
            revert InvalidDescription();
        }

        name = name_;
        description = description_;
        emit UpdateContractDetailsSet();
    }

}
