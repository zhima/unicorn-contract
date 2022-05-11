// SPDX-License-Identifier: Private
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract UniNFT is ERC721A, Ownable {

    enum Status {
        Waiting,
        WhiteListOnly,
        Started,
        Finished
    }

    bool public _revealed = false; //开盲盒

    Status public status;
    string baseURI;
    string public notRevealedURI;
    string public baseExtension = ".json";

    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public maxMintPerAddr = 5;
    uint256 public mintPrice = 0.02 ether;  // 0.02 ETH
    bytes32 public merkleRoot;

    event Minted(address minter, uint256 amount);
    event StatusChanged(Status status);
    event BaseURIChanged(string newBaseURI);

    modifier eoaOnly() {
        require(tx.origin == msg.sender, "EOA Only");
        _;
    }

    constructor(string memory initBaseURI, string memory initNotRevealedURI) ERC721A("Unicorn NFT", "UC-N") {
        baseURI = initBaseURI;
        notRevealedURI = initNotRevealedURI;
    }

    // internal
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        string memory _tokenURI = super.tokenURI(tokenId);

        if (_revealed == false) {
            return notRevealedURI;
        }
        
        return string(abi.encodePacked(_tokenURI, baseExtension));
    }

    function mint(uint256 quantity) external payable eoaOnly {
        require(status == Status.Started, "UC-N: not able to mint yet");
        _mint(quantity);
    }

    function whitelistMint(bytes32[] calldata merkleProof, uint256 quantity) external payable eoaOnly {
        require(
            status == Status.Started || status == Status.WhiteListOnly,
            "UC-N: not able to mint yet"
        );
        require(_whitelistVerify(merkleProof), "UC-N: Invalid merkle proof");
        _mint(quantity);
    }

    function _mint(uint256 quantity) internal {
        require(
            numberMinted(msg.sender) + quantity <= maxMintPerAddr,
            "UC-N: exceed the max limit of each account"
        );
        require(
            totalSupply() + quantity <= MAX_SUPPLY,
            "UC-N: exceed the total token amount"
        );
        require(
            quantity * mintPrice <= msg.value,
            "UC-N: Not engouth ETH sent"
        );

        _safeMint(msg.sender, quantity);
        refundIfOver(mintPrice * quantity);

        emit Minted(msg.sender, quantity);
    }

    function refundIfOver(uint256 price) private {
        require(msg.value >= price, "UC-N: Not engouth ETH sent");
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    function numberMinted(address addr) public view returns (uint256) {
        return _numberMinted(addr);
    }

    function _whitelistVerify(bytes32[] calldata merkleProof) internal view returns (bool) {
        return MerkleProof.verify(
            merkleProof,
            merkleRoot,
            keccak256(abi.encodePacked(msg.sender))
        );
    }

    function setMerkleRoot(bytes32 _MerkleRoot) public onlyOwner{
        merkleRoot = _MerkleRoot;
    }

    //开盲盒
    function flipReveal() public onlyOwner {
        _revealed = !_revealed;
    }

    function setStatus(Status _status) external onlyOwner {
        status = _status;
        emit StatusChanged(status);
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
        emit BaseURIChanged(newBaseURI);
    }

    //设置盲盒封面json文件的ipfs路径
    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedURI = _notRevealedURI;
    }

    //设置mint价格
    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }

    //设置每个地址可mint的最大数量
    function setMaxMintPerAddr(uint256 _maxMintPerAddr) public onlyOwner {
        maxMintPerAddr = _maxMintPerAddr;
    }

    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
        baseExtension = _newBaseExtension;
    }

    //提现
    function withdraw(address to) public onlyOwner {
        uint256 balance = address(this).balance;
        payable(to).transfer(balance);
    }
}