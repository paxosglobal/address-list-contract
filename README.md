# Address List Smart Contract

This repository hosts a Solidity smart contract designed to manage a list of addresses. The contract is built using OpenZeppelin's Universal Upgradeable Proxy Pattern (UUPS Proxy), ensuring upgradability and modularity.

## Key Features

The smart contract allows storage of a list of addresses on-chain, which can be accessed and utilized by other smart contracts through delegate calls.

### Interface for the Address List Smart Contract

```solidity
interface IAddressList {
  function inAddrList(address addr) external view returns (bool);
  function isAnyAddrInList(address[] calldata addresses) external view returns (bool);
}
```

### Roles and Addresses

The contract supports two distinct roles:

1. `DEFAULT_ADMIN_ROLE`: The default admin role, which has administrative privileges.
2. `ADDR_LIST_UPDATE_ROLE`: Allows the role owner to update the address list, allowing it to add/remove addressed from the list.


| Role                   | Role-hash                                                            |
| ---------------------- | ---------------------------------------------------------------------|
| DEFAULT_ADMIN_ROLE     | 0x0000000000000000000000000000000000000000000000000000000000000000   |
| ADDR_LIST_UPDATE_ROLE  | 0x0723b03415002f06422f98c2d569ea0040321d014ea2d3686ab39551941dcade   |

### ABI, Address, and Verification

The contract ABI is available in AddressList.abi, representing the ABI of the implementation contract.

### Upgradeability Proxy

To ensure upgradeability on the immutable blockchain, we employ a standard two-contract delegation pattern: a proxy contract represents the token, while all calls are delegated to an implementation contract.

This delegation leverages delegatecall, executing the code of the implementation contract within the context of the proxy storage. This enables the implementation pointer to be changed to a different implementation contract while retaining the same data and token contract address, which are associated with the proxy contract.

The Address List contract uses OpenZeppelin's [UUPSUpgradeable](https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/release-v4.9/contracts/proxy/utils/UUPSUpgradeable.sol).

## Development

The contract development environment is managed using the Hardhat tool.

### Commands

To install packages:

`npm install`

To compile the contract run:

`npm run compile`

To run unit tests:

`npm run test`

You can also run `npx hardhat coverage` to see a coverage report.
