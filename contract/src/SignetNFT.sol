// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract SignetNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // 1. STATE VARIABLES
    // Database Hash On-Chain (Mencegah Duplikat)
    mapping(string => bool) public isHashRegistered;
    
    // Database Whitelist (Siapa yang boleh minting)
    mapping(address => bool) public authorizedPublishers;

    // 2. EVENTS (Penting untuk Dashboard & Debugging)
    event PublisherAuthorized(address indexed publisher);
    event PublisherRemoved(address indexed publisher);
    event EvidenceCreated(uint256 indexed tokenId, string pHash, address indexed owner, string tokenURI);

    constructor() ERC721("SignetEvidence", "SIG") Ownable(msg.sender) {
        // Otomatis whitelist deployer (Admin) agar Backend/Owner bisa minting
        authorizedPublishers[msg.sender] = true;
    }

    // 3. MODIFIER CUSTOM
    modifier onlyAuthorized() {
        require(authorizedPublishers[msg.sender] == true, "SIGNET: Caller is not authorized to mint.");
        _;
    }

    // 4. FUNGSI ADMIN: Menambah/Menghapus Client (Hanya Admin yang bisa)
    function addPublisher(address _publisher) external onlyOwner {
        authorizedPublishers[_publisher] = true;
        emit PublisherAuthorized(_publisher);
    }

    function removePublisher(address _publisher) external onlyOwner {
        authorizedPublishers[_publisher] = false;
        emit PublisherRemoved(_publisher);
    }

    // 5. FUNGSI MINTING (Bisa dipanggil oleh Client via Dashboard)
    // Modifier diganti dari 'onlyOwner' menjadi 'onlyAuthorized'
    function mintEvidence(address to, string memory pHash, string memory uri) public onlyAuthorized returns (uint256) {
        
        // Cek Duplikat Hash
        require(isHashRegistered[pHash] == false, "SIGNET: Hash already registered on-chain!");

        // Tandai hash terpakai
        isHashRegistered[pHash] = true;

        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        // Emit event agar Dashboard bisa menangkap notifikasi sukses
        emit EvidenceCreated(tokenId, pHash, to, uri);
        
        return tokenId;
    }
}