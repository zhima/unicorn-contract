// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

const { BASE_URI, NOT_REVEALED_URI } = process.env;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const UniNFT = await hre.ethers.getContractFactory('UniNFT');

  // 真正 NFT 的 ipfs 地址以及盲盒封面 ipfs 地址
  const uninft = await UniNFT.deploy(
    BASE_URI,
    NOT_REVEALED_URI
  );

  await uninft.deployed();

  console.log('UniNFT Deployed to:', uninft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
