import { expect } from "chai";
import { ethers } from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe("SupplyChain", function () {
  let supplyChain: any;
  let owner: any;
  let otherAccount: any;

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    supplyChain = await SupplyChain.deploy();
    await supplyChain.waitForDeployment();
  });

  it("Should allow owner to add supply", async function () {
    const tx = await supplyChain.addSupply(
      "Apples",
      "Fresh apples",
      100,
      "ProviderA",     // ✅ changed from owner.address to string
      "EmployeeA"
    );
    await tx.wait();

    const supplies = await supplyChain.getSupplies();
    expect(supplies.length).to.equal(1);
    expect(supplies[0].name).to.equal("Apples");
    expect(supplies[0].description).to.equal("Fresh apples");
    expect(supplies[0].quantity).to.equal(100);
    expect(supplies[0].provider).to.equal("ProviderA");
    expect(supplies[0].addedBy).to.equal("EmployeeA");
    expect(supplies[0].state).to.equal(0); // Created
  });

  it("Should not allow non-owner to add supply", async function () {
    await expect(
      supplyChain.connect(otherAccount).addSupply(
        "Oranges",
        "Juicy oranges",
        50,
        "ProviderB",    // ✅ changed from address to string
        "EmployeeB"
      )
    ).to.be.revertedWith("Only owner can perform this action");
  });

  it("Should allow owner to update supply state", async function () {
    const tx = await supplyChain.addSupply(
      "Bananas",
      "Ripe bananas",
      75,
      "ProviderC",    // ✅ string
      "EmployeeC"
    );
    await tx.wait();

    const updateTx = await supplyChain.updateSupplyState(0, 1); // Sold
    await updateTx.wait();

    const supplies = await supplyChain.getSupplies();
    expect(supplies[0].state).to.equal(1);
  });

  it("Should not allow non-owner to update supply state", async function () {
    const tx = await supplyChain.addSupply(
      "Mangoes",
      "Sweet mangoes",
      30,
      "ProviderD",
      "EmployeeD"
    );
    await tx.wait();

    await expect(
      supplyChain.connect(otherAccount).updateSupplyState(0, 2)
    ).to.be.revertedWith("Only owner can perform this action");
  });
});
