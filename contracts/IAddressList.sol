// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title IAddressList: Interface for AddressList contract.
 * @notice List all the functions to be utilized by other contracts via delegate call.
 */
interface IAddressList {
  function inAddrList(address addr) external view returns (bool);
  function isAnyAddrInList(address[] calldata addresses) external view returns (bool);
}