// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

error ZerrorAddress();
error NotAuthorized();

abstract contract AuthorizableAbstract is Ownable {
    // Mapping of address which are authorized.
    mapping(address => bool) public authorized;

    // Events
    event Authorized(address indexed _addr);
    event UnAuthorized(address indexed _addr);

    modifier onlyAuthorized() {
        if(!(authorized[msg.sender] || owner() == msg.sender)) revert NotAuthorized();
        _;
    }

    /**
     * @notice Add an address to the authorized list.
     * @param _toAdd address The address to add to the authorized list.
     * @return bool True if the address was added to the authorized list.
     */
    function addAuthorization(address _toAdd) public onlyOwner returns (bool){
        if (_toAdd == address(0)) revert ZerrorAddress();
        authorized[_toAdd] = true;
        emit Authorized(_toAdd);
        return true;
    }

    /**
     * @notice Remove an address from the authorized list.
     * @param _toRemove address The address to remove from the authorized list.
     * @return bool True if the address was remove from the authorized list.
     */
    function removeAuthorization(address _toRemove) public onlyOwner returns (bool){
        delete authorized[_toRemove];
        emit UnAuthorized(_toRemove);
        return true;
    }

    /**
     * @notice Add an address to the authorized list.
     * @param _addr address The address to add to the authorized list.
     * @return bool True if address is part of authorized list, False otherwise.
     */
    function isAuthorized(address _addr) public view onlyOwner returns (bool) {
        return authorized[_addr];
    }
}
