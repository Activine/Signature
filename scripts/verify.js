const hre = require("hardhat");

const addressContract = "";

async function main() {
  await hre.run("verify:verify", {
    address: addressContract,
    // constructorArguments: [someArg],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
