# Address List Smart Contract

This repository contains a Solidity smart contract that stores a list of addresses. The contract is implemented using OpenZeppelin's Universal Upgradeable Proxy Pattern (UUPS Proxy), providing upgradability and modularity.

## Features

Smart contract stores a list of addresses on chain, which can be referenced by other smart contracts via delegate call.

### Interface for the Address List Smart Contract

```solidity
interface IAddressList {
  function inAddrList(address addr) external view returns (bool);
  function isAnyAddrInList(address[] calldata addresses) external view returns (bool);
}
```

### Roles and Addresses

It supports two roles:

1. `DEFAULT_ADMIN_ROLE`: The default admin role, which has administrative privileges.
2. `ADDR_LIST_UPDATE_ROLE`: Allows the role owner to update the address list, allowing it to add/remove addressed from the list.


| Role                   | Role-hash      |
| ---------------------- | ------------   |
| DEFAULT_ADMIN_ROLE     | 0x0            |
| ADDR_LIST_UPDATE_ROLE  | TODO_ADDRESS   |

### ABI, Address, and Verification

The contract abi is in `AddressList.abi`. It is the abi of the implementation contract.

### Upgradeability Proxy

To facilitate upgradeability on the immutable blockchain we follow a standard
two-contract delegation pattern: a proxy contract represents the token,
while all calls are delegated to an implementation contract.

The delegation uses `delegatecall`, which runs the code of the implementation contract
_in the context of the proxy storage_. This way the implementation pointer can
be changed to a different implementation contract while still keeping the same
data and token contract address, which are really for the proxy contract.

The Address List contract uses OpenZeppelin's [UUPSUpgradeable](https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/release-v4.9/contracts/proxy/utils/UUPSUpgradeable.sol).

## Development

The contract utilized hardhat tool for dev environment.

### Commands

To install packages:

`npm install`

To compile the contract run:

`npx hardhat compile`

To run unit tests:

`npx hardhat test`

You can also run `npx hardhat coverage` to see a coverage report.
