const { expect, use } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require('merkletreejs');
const { keccak256 } = ethers.utils;

use(require('chai-as-promised'));

const { BASE_URI, NOT_REVEALED_URI } = process.env;

describe("UniNFT Test", function () {
  let mintedCount = 0;
  let contract;
  let tree;
  const baseURI = BASE_URI;
  const notRevealedURI = NOT_REVEALED_URI;

  before(async function () {
    const UniNFT = await ethers.getContractFactory('UniNFT');

    //合约部署默认用 getSigners 的第一个地址作为部署地址，也就是第一个地址就是 owner
    const uninft = await UniNFT.deploy(baseURI, notRevealedURI);
    contract = await uninft.deployed(); //deploy 和 deployed 返回的都是 Promise<Contract>，所以 await 后返回的都是一个 Contract 类型的变量，这时返回的合约引用默认连接的是 owner 地址

    const accounts = await hre.ethers.getSigners();
    const whitelisted = accounts.slice(0, 5);

    const leaves = whitelisted.map(account => keccak256(account.address));
    tree = new MerkleTree(leaves, keccak256, { sort: true });
    const merkleRoot = tree.getHexRoot();

    const setMerkleRootTx = await contract.setMerkleRoot(merkleRoot);
    await setMerkleRootTx.wait();
    //凡是调用写入的方法，都要调用 wait() 或者 deployed() 来等待确保该事务已经被矿工打包完成，但如果是读取的方法则不用 wait，可以直接用 await 的返回值进行比较
    
  });

  

  it('Waiting status mint not allowed', async function () {
    const [owner] = await hre.ethers.getSigners();
    const merkleProof = tree.getHexProof(keccak256(owner.address));
    
    await expect(contract.mint( 2, {value: ethers.utils.parseEther('0.04')})).to.be.rejectedWith(/UC-N: not able to mint yet/);
    await expect(contract.whitelistMint(merkleProof, 2, {value: ethers.utils.parseEther('0.04')})).to.be.rejectedWith(/UC-N: not able to mint yet/);
  });

  it('Only owner can change status', async function () {
    const [owner, addr1] = await hre.ethers.getSigners();
    
    await expect(contract.connect(addr1).setStatus(1)).to.be.rejected;
    await expect(contract.connect(owner).setStatus(1)).to.be.fulfilled;
  });

  it("Whitelist merkle allowed", async function () {
    const setStatusTx = await contract.setStatus(1);
    await setStatusTx.wait();
    const accounts = await hre.ethers.getSigners();
    const whitelisted = accounts.slice(0, 5);
    
    const merkleProof = tree.getHexProof(keccak256(whitelisted[2].address));
    await expect(contract.connect(whitelisted[2]).whitelistMint(merkleProof, 2, {value: ethers.utils.parseEther('0.04')})).to.not.be.rejected;
    mintedCount += 2;
  });

  it('Whitelist merkle invalid', async function () {
    const setStatusTx = await contract.setStatus(1);
    await setStatusTx.wait();

    const accounts = await hre.ethers.getSigners();
    const notWhitelisted = accounts.slice(5, 10);
    const whitelisted = accounts.slice(0, 5);
    //不在 whitelist 名单的钱包地址不能 mint
    const invalidMerkleProof = tree.getHexProof(keccak256(notWhitelisted[1].address));
    await expect(contract.connect(notWhitelisted[1]).whitelistMint(invalidMerkleProof, 2, {value: ethers.utils.parseEther('0.04')})).to.be.rejectedWith(/UC-N: Invalid merkle proof/);
    
    //merkleProof 与当前连接的钱包地址不一致的，不能 mint
    const validMerkleProof = tree.getHexProof(keccak256(whitelisted[0].address));
    await expect(contract.connect(notWhitelisted[1]).whitelistMint(validMerkleProof, 2, {value: ethers.utils.parseEther('0.04')})).to.be.rejectedWith(/UC-N: Invalid merkle proof/);
  });

  it('Whitelist mint', async function () {
    const setStatusTx = await contract.setStatus(1);
    await setStatusTx.wait();

    const accounts = await hre.ethers.getSigners();
    const whitelisted = accounts.slice(0, 5);
    const selectedAccount = whitelisted[3];
    const merkleProof = tree.getHexProof(keccak256(selectedAccount.address));
    const account2SignerContract = contract.connect(selectedAccount); //必须当前连接的钱包地址与 merkleProof 地址一致，且是 whitelist 名单中的地址才能 mint
    const whiteListMintPromise = account2SignerContract.whitelistMint(merkleProof, 2, {value: ethers.utils.parseEther('0.04')});
    await expect(whiteListMintPromise).to.be.fulfilled;
    const whiteListMintTx = await whiteListMintPromise;
    await expect(whiteListMintTx.wait()).to.be.fulfilled;
    const minted = await account2SignerContract.numberMinted(selectedAccount.address);
    expect(minted).to.equal(2);
    mintedCount += 2;
  });

  it('Public mint', async function() {
    const accounts = await hre.ethers.getSigners();
    const notWhitelisted = accounts.slice(5, 10);

    await expect(contract.mint( 2, {value: ethers.utils.parseEther('0.04')})).to.be.rejectedWith(/UC-N: not able to mint yet/);

    const setStatusTx = await contract.setStatus(2);
    await setStatusTx.wait();

    const selectedAccount = notWhitelisted[1];
    const account6OfSignerContract = contract.connect(selectedAccount);
    const publicMintPromise = account6OfSignerContract.mint( 2, {value: ethers.utils.parseEther('0.04')});
    await expect(publicMintPromise).to.be.fulfilled;
    const publicMintTx = await publicMintPromise;
    await expect(publicMintTx.wait()).to.be.fulfilled;
    const minted = await account6OfSignerContract.numberMinted(selectedAccount.address);
    expect(minted).to.equal(2);
    mintedCount += 2;
  });

  it('TokenURI revealed', async function() {
    const accounts = await hre.ethers.getSigners();
    const notWhitelisted = accounts.slice(5, 10);
    const selectedAccount = notWhitelisted[1];
    const account6OfSignerContract = contract.connect(selectedAccount);

    const tokenId = 5;
    const notRevealedURI = await account6OfSignerContract.tokenURI(tokenId);
    expect(notRevealedURI).to.equal(notRevealedURI);

    const flipRevealPromise = contract.flipReveal();
    await expect(flipRevealPromise).to.be.fulfilled;
    const flipRevealTx = await flipRevealPromise;
    await expect(flipRevealTx.wait()).to.be.fulfilled;
    const revealedURI = await account6OfSignerContract.tokenURI(tokenId);
    expect(revealedURI).to.equal(baseURI + tokenId + '.json');
  });

  it('Withdraw', async function () {
    const accounts = await hre.ethers.getSigners();
    const receiverAccount = accounts[4];
    const owner = accounts[0];
    const vaultBalance = await receiverAccount.getBalance();

    await expect(contract.connect(receiverAccount).withdraw(owner.address)).to.be.rejected; //只有 owner 才能 withdraw

    const withdrawPromise = contract.connect(owner).withdraw(receiverAccount.address);
    await expect(withdrawPromise).to.be.fulfilled;
    const withdrawTx = await withdrawPromise;
    await expect(withdrawTx.wait()).to.be.fulfilled;
    const newVaultBalance = await receiverAccount.getBalance();

    //由于 withdraw 过程中会消耗部分 gas，所以实际 withdraw 的金额会有一定的误差，所以不能用 equal 来比较，而是用大于等于
    const totalWithdraw = mintedCount * 0.02 - 0.01; 
    expect(newVaultBalance.gt(vaultBalance.add(ethers.utils.parseEther(totalWithdraw.toString())))).to.be.true;

    console.log('mintedCount: ', mintedCount);
    console.log(ethers.utils.formatEther(vaultBalance));
    console.log(ethers.utils.formatEther(newVaultBalance));
  });

});
