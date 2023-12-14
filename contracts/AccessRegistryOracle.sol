// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {Authorizable} from "./Authorizable.sol";

/*
 * Listing all the TODO:
 *   1. Add events.
 *   2. Add comments.
 *   3. Behavior, if you add/remove duplicate, its a no-op.
 */

contract AccessRegistryOracle is Authorizable {
    // DATA
    mapping(address => bool) internal allowList;
    mapping(address => bool) internal blockList;

    // DATA ENDS

    function addToAllowList(
        address[] calldata _toAddAddresses
    ) external onlyAuthorized {
        for (uint i = 0; i < _toAddAddresses.length; i++) {
            allowList[_toAddAddresses[i]] = true;
        }
    }

    function removeFromAllowList(
        address[] calldata _toAddAddresses
    ) external onlyAuthorized {
        for (uint i = 0; i < _toAddAddresses.length; i++) {
            delete allowList[_toAddAddresses[i]];
        }
    }

    function addToBlockList(
        address[] calldata _toAddAddresses
    ) external onlyAuthorized {
        for (uint i = 0; i < _toAddAddresses.length; i++) {
            blockList[_toAddAddresses[i]] = true;
        }
    }

    function removeFromBlockList(
        address[] calldata _toAddAddresses
    ) external onlyAuthorized {
        for (uint i = 0; i < _toAddAddresses.length; i++) {
            delete blockList[_toAddAddresses[i]];
        }
    }

    // Check functions
    function isAllowed(
        address _addr
    ) external view onlyAuthorized returns (bool) {
        return allowList[_addr];
    }

    function isBlocked(
        address _addr
    ) external view onlyAuthorized returns (bool) {
        return blockList[_addr];
    }
}
