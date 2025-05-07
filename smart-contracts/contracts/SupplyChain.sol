// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SupplyChain is Ownable, ReentrancyGuard {
    enum SupplyState { Created, Sold, Shipped, Delivered }

    struct Supply {
        string name;
        string description;
        uint256 quantity;
        string provider;
        address addedBy;
        SupplyState state;
    }

    Supply[] public supplies;

    event SupplyAdded(string name, string provider, address addedBy);
    event SupplyStateUpdated(uint256 index, SupplyState newState);

    constructor() Ownable(msg.sender) {}

    function addSupply(
        string memory _name,
        string memory _description,
        uint256 _quantity,
        string memory _provider
    ) public onlyOwner nonReentrant {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_quantity > 0, "Quantity must be greater than zero");
        require(bytes(_provider).length > 0, "Provider cannot be empty");

        supplies.push(
            Supply(
                _name,
                _description,
                _quantity,
                _provider,
                tx.origin,
                SupplyState.Created
            )
        );

        emit SupplyAdded(_name, _provider, tx.origin);
    }

    function updateSupplyState(uint256 index, uint8 newState) public onlyOwner nonReentrant {
        require(index < supplies.length, "Invalid index");
        require(newState <= uint8(SupplyState.Delivered), "Invalid state");

        supplies[index].state = SupplyState(newState);
        emit SupplyStateUpdated(index, SupplyState(newState));
    }

    function getSupplies() public view returns (Supply[] memory) {
        return supplies;
    }
}
