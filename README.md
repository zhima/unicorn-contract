Unicorn NFT Contract
===============
## 介绍

本仓库代码是 [Unicorn NFT](https://github.com/zhima/unicorn-next) 的合约部分，仅做学习和测试使用。

## 生成 NFT 图片和元数据
本项目 NFT 图片的生成是以一个 svg 图片为基础，然后对其填充随机颜色生成的。具体的图片生成代码在 nft-art-generate/images 目录，元数据的生成代码在 nft-art-generate/metadata 目录。

运行以下命令生成 NFT 图片和元数据

```bash
npm run generate:image
npm run generate:metadata
```

生成 NFT 图片和元数据后，可以通过 [pinata](https://pinata.cloud/) 上传到 IPFS 存储，这是一个分布式文件存储系统，具有一旦上传就不可改变等特性。

注意上传时，要先上传 NFT 图片，然后获得上传后的 CID 填入到 metadata/index.js 的 image 字段中，然后再生成元数据文件，再上传元数据文件。

## 部署运行

首先要把 .env.example 文件重命名为 .env，然后在该文件中填入需要的环境变量。
为了方便测试，你可以使用本项目的 IPFS 地址作为测试：

- 盲盒地址：ipfs://QmV3Uc7JbXatJ3z8JxpgxXWvWc84jz1itd9USAYX3YN9Ee
- 正式版本：ipfs://QmYqQgwjZiVeMaxqnRMhC3X3SsxYgTttek6TUNB5MiYnuT/

注意正式地址最后是有斜杠 / 的，因为这是一个目录。

然后安装依赖

```bash
npm install
or
yarn install

//部署到 goerli 测试网
yarn deploy:goerli

// 部署后的 etherscan 验证，这是把本地的 solidity 源代码上传到 etherscan 进行验证，注意要把 CONTRACT_ADDR、BASE_URI、NOT_REVEALED_URI 替换为对应的值，verify 成功后到 https://goerli.etherscan.io/ 输入部署的合约地址查看 Contract 一栏
yarn verify:goerli
```

verify 后可以运行 run.js 对合约调用方法进行验证。

```
npx hardhat run scripts/run.js
```

## 添加新的 network

.env 中的 API_URL、INFURA_JSONRPC_ENDPOINT 要替换为对应网络的 endpoint 地址。

在 hardhat.config.js 中的 networks 一项增加新的网络，输入对应的 rpc endpoint URL 和 private key。

例如：
```
goerli: {
  url: API_URL,
  accounts: [PRIVATE_KEY],
},
```