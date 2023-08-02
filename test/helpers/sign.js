const { ethers } = require("hardhat");

const marketplaceType = {
  SignData: [
    { name: "amount", type: "uint256" },
    { name: "buyer", type: "address" },
    { name: "uri", type: "string" },
    { name: "free", type: "bool" },
    { name: "whiteList", type: "address[]" },
  ],
};

const signMarketplaceDataByUser = async (domain, amount, buyer, uri, free, whiteList, user) =>
ethers.utils.splitSignature(
  await user._signTypedData(domain, marketplaceType, {
    amount,
    buyer,
    uri,
    free,
    whiteList
  })
);
module.exports = { signMarketplaceDataByUser };
