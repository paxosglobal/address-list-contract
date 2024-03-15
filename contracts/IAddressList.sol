// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IAddressList {
  function inAddrList(address addr) external view returns (bool);
  function anyAddrInList(address[] calldata addresses) external view returns (bool);
}