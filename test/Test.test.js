const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { signMarketplaceDataByUser } = require("./helpers/sign");

describe("Test", function () {
  let owner, user;
  let domainMarketplace, data;
  let MINTER_ROLE;

  before(async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    user = signers[1];

    const Test= await ethers.getContractFactory("Test", owner);
    test = await Test.deploy(
      "Marketplace",
      "1"
    );
    await test.deployed();

    domainMarketplace = {
      name: "Marketplace",
      version: "1",
      chainId: network.config.chainId,
      verifyingContract: test.address,
    };

    MINTER_ROLE = await test.MINTER_ROLE();

    data = {
      amount: 15,
      buyer: user.address,
      uri: "QmecYUVZSTr2UsPVqbeCxu3oNCMicQjn9NPmQN2i6gWNdp/2.json",
      free: true,
      whiteList: [owner.address, user.address]
    }
  })

  describe("Main Logic", function () {
    it("success", async function () {

      const signature = await signMarketplaceDataByUser(
        domainMarketplace,
        data.amount,
        data.buyer,
        data.uri,
        data.free,
        data.whiteList,
        owner
      );

      await expect(test.connect(user).purchase(
        data,
        signature.v,
        signature.r,
        signature.s)
      ).to.emit(test, "Success").withArgs(data.amount, data.buyer, data.uri, data.free, data.whiteList);
    })

    it("failed", async function () {

      const wrongSignature = await signMarketplaceDataByUser(
        domainMarketplace,
        data.amount,
        data.buyer,
        data.uri,
        data.free,
        data.whiteList,
        user
      );
      await expect(test.connect(user).purchase(
          data,
          wrongSignature.v,
          wrongSignature.r,
          wrongSignature.s)
        ).to.emit(test, "Failed").withArgs(data.amount, data.buyer, data.uri, data.free, data.whiteList);
    })

    it("success after grant minter role", async function () {
      await test.connect(owner).setRole(user.address);

      const signature = await signMarketplaceDataByUser(
        domainMarketplace,
        data.amount,
        data.buyer,
        data.uri,
        data.free,
        data.whiteList,
        user
      );

      await expect(test.connect(user).purchase(
        data,
        signature.v,
        signature.r,
        signature.s)
      ).to.emit(test, "Success").withArgs(data.amount, data.buyer, data.uri, data.free, data.whiteList);
    })
  })
})