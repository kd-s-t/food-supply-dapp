import "@nomicfoundation/hardhat-ethers";
import hre from "hardhat";
const ethers = hre.ethers;
import fs from "fs";

async function main() {
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();

  await supplyChain.waitForDeployment();

  console.log(`SupplyChain deployed to: ${supplyChain.target}`);

  // Save ABI and address
  const abi = JSON.parse(fs.readFileSync("./artifacts/contracts/SupplyChain.sol/SupplyChain.json", "utf8")).abi;

  const contractData = {
      address: supplyChain.address,
      abi: abi
  };

  fs.writeFileSync("../nestjs/src/abis/SupplyChain.json", JSON.stringify(contractData, null, 2));
  fs.writeFileSync("../nextjs/public/SupplyChain.json", JSON.stringify(contractData, null, 2));
} 

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
