Unicorn NFT Contract
===============
## 介绍

本仓库代码是 [Unicorn NFT](https://github.com/zhima/unicorn-next) 的合约部分，仅做学习和测试使用。

## 安装运行

首先要把 .env.example 文件重命名为 .env，然后在该文件中填入需要的环境变量。
为了方便测试，你可以使用国产良心的 ipfs 地址作为测试：

- 盲盒地址：ipfs://QmbyUfWA5fuedutDAJ5CPs4ujVAfhPhn2Hi1URhAPwYJM7/
- 正式版本：ipfs://QmVYZi6XyTgC9xmZnH8Co1pEuNRUpr3WjFUpVN1N6uLstB/

然后安装依赖

```bash
npm install
```


Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat run scripts/sample-script.js
npx hardhat help
```

Install dependencies:
```bash
npm install @openzeppelin/contracts
npm install --save-dev erc721a 
npm install --save-dev dotenv
npm install --save-dev hardhat-gas-reporter
npm install --save-dev @nomiclabs/hardhat-etherscan
```

verify成功后倒 https://rinkeby.etherscan.io/ 输入合约地址查看合约验证结果

1. npm install
2. write sol
3. .env
4. hardhat.config.js
5. run deploy.js
6. test
7. real deploy