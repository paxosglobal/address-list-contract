// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {AccessRegistryOracleAbstract} from "./AccessRegistryOracleAbstract.sol";

// PaxosSanctionedList: Provides external API to access sanctioned list.
contract PaxosSanctionedList is AccessRegistryOracleAbstract {

    /**
     * @notice Is given address sanctioned.
     * @param toAddAddresses address[] This is the list of addresses to add to addr list.
     */
    function isAddrSanctioned(address addr) external view returns (bool) {
        return inAddrList(addr);
    }

    /**
     * @notice Sanction address.
     * @param addresses address[] This is the list of addresses to be sanctioned.
     */
    function sanctionAddress(address[] calldata addresses) external {
        addToAddrList(addresses);
    }

.    /**
     * @notice Remove address from sanctione list.
     * @param addresses address[] This is the list of addresses to be removed from sanctioned list.
     */
    function unSanctionAddress(address[] calldata addresses) external {
        removeFromAddrList(addresses);
    }
}
