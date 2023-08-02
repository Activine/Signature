// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Signature.sol";

contract Test is Signature, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event Success(
        uint256 amount,
        address buyer,
        string uri,
        bool free,
        address[] whiteList
    );

    event Failed(
        uint256 amount,
        address buyer,
        string uri,
        bool free,
        address[] whiteList
    );

    constructor(string memory _name, string memory _version) {
        __Signature_init(_name, _version);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function setRole(address newMinter) external onlyRole(MINTER_ROLE) {
        _grantRole(MINTER_ROLE, newMinter);
    }

    function purchase(
        SignData memory purchaseData,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        if (
            hasRole(
                MINTER_ROLE,
                _getSigner(msg.sender, purchaseData, v, r, s)
            )
        ) {
            emit Success(purchaseData.amount, purchaseData.buyer, purchaseData.uri, purchaseData.free, purchaseData.whiteList);
        } else {
            emit Failed(purchaseData.amount, purchaseData.buyer, purchaseData.uri, purchaseData.free, purchaseData.whiteList);
        }
    }
}
