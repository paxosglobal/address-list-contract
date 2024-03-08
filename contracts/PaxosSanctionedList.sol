// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {AccessRegistryOracleAbstract} from "./AccessRegistryOracleAbstract.sol";

// PaxosSanctionedList: Provides external API to access sanctioned list.
contract PaxosSanctionedList is AccessRegistryOracleAbstract {
    /**
     * @notice Is given address sanctioned.
     * @param addr address This is the list of addresses to add to addr list.
     */
    function isAddrSanctioned(address addr) external view returns (bool) {
        return inAddrList(addr);
    }

    /**
     * @notice Is given address sanctioned.
     * @param addresses address[] This is the list of addresses to add to addr list.
     */
    function anyAddrSanctioned(address[] calldata addresses) external view returns (bool) {
        for (uint256 i = 0; i < addresses.length; i++) {
            if (inAddrList(addresses[i])) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Sanction address.
     * @param addresses address[] This is the list of addresses to be sanctioned.
     */
    function sanctionAddress(address[] calldata addresses) external {
        addToAddrList(addresses);
    }

    /**
     * @notice Remove address from sanctione list.
     * @param addresses address[] This is the list of addresses to be removed from sanctioned list.
     */
    function unSanctionAddress(address[] calldata addresses) external {
        removeFromAddrList(addresses);
    }
}
