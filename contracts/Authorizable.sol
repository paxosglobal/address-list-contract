// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

error ZerrorAddress();
error NotAuthorized();

contract Authorizable is Ownable {
    mapping(address => bool) public authorized;

    modifier onlyAuthorized() {
        if(!(authorized[msg.sender] || owner() == msg.sender)) revert NotAuthorized();
        _;
    }

    function addAuthorization(address _toAdd) public onlyOwner returns (bool){
        if (_toAdd == address(0)) revert ZerrorAddress();
        authorized[_toAdd] = true;
        return true;
    }

    function removeAuthorization(address _toRemove) public onlyOwner returns (bool){
        delete authorized[_toRemove];
        return true;
    }

    function isAuthorized(address _addr) public view onlyOwner returns (bool) {
        return authorized[_addr];
    }
}
