# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

Install dependencies:
```shell
npm install @openzeppelin/contracts
npm install --save-dev erc721a 
npm install --save-dev dotenv
npm install --save-dev hardhat-gas-reporter
npm install --save-dev @nomiclabs/hardhat-etherscan
```

将 .env.example 重命名为 .env，然后填入其中各个字段的值

verify成功后倒 https://rinkeby.etherscan.io/ 输入合约地址查看合约验证结果

npm install
sol
deploy.js
test
.env
hardhat.config.js
real deploy