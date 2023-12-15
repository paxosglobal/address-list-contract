// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {AuthorizableAbstract} from "./AuthorizableAbstract.sol";

/**
 * @title AccessRegistry: Manage a list of address to allow and block them.
 */
contract AccessRegistryOracleAbstract is AuthorizableAbstract {
    // DATA
    mapping(address => bool) internal allowList;
    mapping(address => bool) internal blockList;
    // DATA ENDS

    // Events
    event ModifiedAllowList(address indexed _addr, string _action);
    event ModifiedBlockList(address indexed _addr, string _action);

    /**
     * @notice Add to allow list of wallet addresses.
     * @param _toAddAddresses address[] This is the list of addresses to add to allow list.
     */
    function addToAllowList(
        address[] calldata _toAddAddresses
    ) external onlyAuthorized {
        for (uint i = 0; i < _toAddAddresses.length; i++) {
            allowList[_toAddAddresses[i]] = true;
            emit ModifiedAllowList(_toAddAddresses[i], "Add");
        }
    }

    /**
     * @notice Remove from allow list of wallet addresses.
     * @param _toAddAddresses address[] This is the list of addresses to remove from allow list.
     */
    function removeFromAllowList(
        address[] calldata _toAddAddresses
    ) external onlyAuthorized {
        for (uint i = 0; i < _toAddAddresses.length; i++) {
            delete allowList[_toAddAddresses[i]];
            emit ModifiedAllowList(_toAddAddresses[i], "Remove");
        }
    }

    /**
     * @notice Add to block list of wallet addresses.
     * @param _toAddAddresses address[] This is the list of addresses to add to block list.
     */
    function addToBlockList(
        address[] calldata _toAddAddresses
    ) external onlyAuthorized {
        for (uint i = 0; i < _toAddAddresses.length; i++) {
            blockList[_toAddAddresses[i]] = true;
            emit ModifiedBlockList(_toAddAddresses[i], "Add");
        }
    }

    /**
     * @notice Remove from block list of wallet addresses.
     * @param _toAddAddresses address[] This is the list of addresses to remove from block list.
     */
    function removeFromBlockList(
        address[] calldata _toAddAddresses
    ) external onlyAuthorized {
        for (uint i = 0; i < _toAddAddresses.length; i++) {
            delete blockList[_toAddAddresses[i]];
            emit ModifiedBlockList(_toAddAddresses[i], "Remove");
        }
    }

    /**
     * @notice Check if address is part of allow list.
     * @param _addr address Check if this address is part of allow list.
     * @return bool True if address is part of allow list, false otherwise.
     */
    function isAllowed(
        address _addr
    ) external view onlyAuthorized returns (bool) {
        return allowList[_addr];
    }

    /**
     * @notice Check if address is part of block list.
     * @param _addr address Check if this address is part of block list.
     * @return bool True if address is part of block list, false otherwise.
     */
    function isBlocked(
        address _addr
    ) external view onlyAuthorized returns (bool) {
        return blockList[_addr];
    }
}
