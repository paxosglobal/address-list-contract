// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {AccessRegistryOracleAbstract} from "./AccessRegistryOracleAbstract.sol";

// SanctionedList: responsible to store the sanctioned address list.
contract PaxosSanctionedList is AccessRegistryOracleAbstract {

    function isAddrSanctioned(address addr) external view returns (bool) {
        return inAddrList(addr);
    }

    function sanctionAddress(address[] calldata addresses) external {
        addToAddrList(addresses);
    }

    function unSanctionAddress(address[] calldata addresses) external {
        removeFromAddrList(addresses);
    }
}
