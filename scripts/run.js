const { ethers } = require("ethers");
const dotenv = require('dotenv');
const ContractABI = require('../artifacts/contracts/UniNFT.sol/UniNFT.json');

dotenv.config();

const runMain = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_JSONRPC_ENDPOINT);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const contract = new ethers.Contract(process.env.CONTRACT_ADDR, ContractABI.abi, signer);
    const setStatusTx = await contract.setStatus(2);
    console.log('Set Status successfully, waiting for confirmation...');
    await setStatusTx.wait();
    console.log('Set Status confirmed!');
    

    const mintTx = await contract.mint(2, {value: ethers.utils.parseEther('0.1')});
    console.log('Mint successfully, waiting for confirmation...');
    await mintTx.wait();
    console.log('Mint confirmed!');

    // const flipRevealTx = await contract.flipReveal();
    // console.log('flipReveal successfully, waiting for confirmation...');
    // await flipRevealTx.wait();
    // console.log('flipReveal confirmed!');

    const tokenURI = await contract.tokenURI(1);
    console.log('tokenURI:', tokenURI);
  } catch (error) {
    console.log('error:', error);
  }
}

runMain()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});

