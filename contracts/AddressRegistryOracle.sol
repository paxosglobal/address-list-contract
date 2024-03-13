// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {AccessControlDefaultAdminRulesUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlDefaultAdminRulesUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {IAddressRegistryOracle} from "./IAddressRegistryOracle.sol";
/**
 * @title AddressRegistryOracle: Manage a list of address.
 */
contract AddressRegistryOracle is IAddressRegistryOracle, AccessControlDefaultAdminRulesUpgradeable, UUPSUpgradeable {
    // DATA
    string public name;
    string public description;

    mapping(address => bool) internal addrList;
    uint256[24] private __gap_AddressRegistryOracle; // solhint-disable-line var-name-mixedcase
    // DATA ENDS

    // keccak256("ASSET_PROTECTION_ROLE")
    bytes32 public constant ASSET_PROTECTION_ROLE = 0xe3e4f9d7569515307c0cdec302af069a93c9e33f325269bac70e6e22465a9796;

    // Events
    event ModifiedAddrList(address indexed _addr, string _action);

    /**
     * @notice Initializes the contract
     * @dev Called on deployment, only can be called once.
     * @param admin address of the default admin
     * @param assetProtector address of the asset protector
     */
    function initialize(
        string memory name_,
        string memory description_,
        address admin,
        address assetProtector
    ) external initializer {
        name = name_;
        description = description_;

        __AccessControlDefaultAdminRules_init(3 hours, admin);
        __UUPSUpgradeable_init();

        _grantRole(ASSET_PROTECTION_ROLE, assetProtector);
    }

    /**
     * @dev required by the OZ UUPS module to authorize an upgrade 
     * of the contract. Restricted to DEFAULT_ADMIN_ROLE.
     */
    function _authorizeUpgrade(
        address
    ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {} // solhint-disable-line no-empty-blocks

    /**
     * @notice Add to addr list.
     * @param toAddAddresses address[] This is the list of addresses to add to addr list.
     */
    function addToAddrList(
        address[] calldata toAddAddresses
    ) external onlyRole(ASSET_PROTECTION_ROLE) {
        for (uint i = 0; i < toAddAddresses.length; i++) {
            addrList[toAddAddresses[i]] = true;
            emit ModifiedAddrList(toAddAddresses[i], "Add");
        }
    }

    /**
     * @notice Remove from addr list.
     * @param toRemoveAddresses address[] This is the list of addresses to remove from addr list.
     */
    function removeFromAddrList(
        address[] calldata toRemoveAddresses
    ) external onlyRole(ASSET_PROTECTION_ROLE) {
        for (uint i = 0; i < toRemoveAddresses.length; i++) {
            delete addrList[toRemoveAddresses[i]];
            emit ModifiedAddrList(toRemoveAddresses[i], "Remove");
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
        return addrList[addr];
    }

    /**
     * @notice Are any given address in list.
     * @param addresses address[] This is the list of addresses to check if any of them is part of list.
     */
    function anyAddrInList(address[] calldata addresses) external view returns (bool) {
        for (uint256 i = 0; i < addresses.length; i++) {
            if (inAddrList(addresses[i])) {
                return true;
            }
        }
        return false;
    }

}
