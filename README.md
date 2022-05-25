Unicorn NFT Contract
===============
## 介绍

本仓库代码是 [Unicorn NFT](https://github.com/zhima/unicorn-next) 的合约部分，仅做学习和测试使用。

## 安装运行

首先要把 .env.example 文件重命名为 .env，然后在该文件中填入需要的环境变量。
为了方便测试，你可以使用本项目的 IPFS 地址作为测试：

- 盲盒地址：ipfs://QmV3Uc7JbXatJ3z8JxpgxXWvWc84jz1itd9USAYX3YN9Ee
- 正式版本：ipfs://QmYqQgwjZiVeMaxqnRMhC3X3SsxYgTttek6TUNB5MiYnuT/

注意正式地址最后是有斜杠 / 的，因为这是一个目录。

然后安装依赖

```bash
npm install
```

## 生成 NFT 图片和元数据
本项目 NFT 图片的生成是以一个 svg 图片为基础，然后对其填充随机颜色生成的。具体的图片生成代码在 nft-art-generate/images 目录，元数据的生成代码在 nft-art-generate/metadata 目录。

运行以下命令生成 NFT 图片和元数据

```bash
npm run generate:image
npm run generate:metadata
```

生成 NFT 图片和元数据后，可以通过 [pinata](https://pinata.cloud/) 上传到 IPFS 存储，这是一个分布式文件存储系统，具有一旦上传就不可改变等特性。

注意上传时，要先上传 NFT 图片，然后获得上传后的 CID 填入到 metadata/index.js 的 image 字段中，然后再生成元数据文件，再上传元数据文件。


## Hardhat 命令

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat run scripts/sample-script.js
npx hardhat help
```

## 从零开始需要安装的依赖

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