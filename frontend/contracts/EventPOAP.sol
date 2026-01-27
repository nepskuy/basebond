// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventPOAP is ERC1155, Ownable {
    string public name = "BaseBond POAP";
    string public symbol = "BBPOAP";

    constructor() ERC1155("") Ownable(msg.sender) {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    // Soulbound Implementation: Prevent transfers (allow minting/burning only)
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        require(from == address(0) || to == address(0), "EventPOAP: Soulbound token, non-transferable");
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override {
        require(from == address(0) || to == address(0), "EventPOAP: Soulbound token, non-transferable");
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }
}
