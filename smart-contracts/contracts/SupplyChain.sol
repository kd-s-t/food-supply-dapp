// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SupplyChain {
    enum SupplyState { Created, Sold, Shipped, Delivered }

    struct Supply {
        string name;
        string description;
        uint256 quantity;
        string provider;
        string addedBy;
        SupplyState state;
    }

    address public owner;
    Supply[] public supplies;

    event SupplyAdded(string name, string provider, string addedBy);
    event SupplyStateUpdated(uint256 index, SupplyState newState);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addSupply(
        string memory _name,
        string memory _description,
        uint256 _quantity,
        string memory _provider,
        string memory _addedBy
    ) public onlyOwner {
        supplies.push(
            Supply(
                _name,
                _description,
                _quantity,
                _provider,
                _addedBy,
                SupplyState.Created
            )
        );
        emit SupplyAdded(_name, _provider, _addedBy);
    }

    function updateSupplyState(uint256 index, uint8 newState) public onlyOwner {
        require(index < supplies.length, "Invalid index");
        supplies[index].state = SupplyState(newState);
        emit SupplyStateUpdated(index, SupplyState(newState));
    }

    function getSupplies() public view returns (Supply[] memory) {
        return supplies;
    }
}
