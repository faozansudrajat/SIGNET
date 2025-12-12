// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SignetNFT Evidence Contract
 * @author RJOG (Signet Team)
 * @notice Smart contract untuk mencetak bukti digital (Evidence) sebagai NFT.
 * @dev Menggunakan sistem whitelist publisher untuk manajemen konten.
 * Dilengkapi fitur 'Self-Registration' khusus untuk keperluan Demo/Hackathon.
 */
contract SignetNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // =============================================================
    //                        STATE VARIABLES
    // =============================================================

    /// @notice Menyimpan status hash file agar tidak ada duplikasi konten (Proof of Existence).
    mapping(string => bool) public isHashRegistered;
    
    /// @notice Daftar alamat wallet yang diizinkan untuk melakukan minting (Publisher).
    mapping(address => bool) public authorizedPublishers;

    // =============================================================
    //                           EVENTS
    // =============================================================

    event PublisherAuthorized(address indexed publisher);
    event PublisherRemoved(address indexed publisher);
    event EvidenceCreated(uint256 indexed tokenId, string pHash, address indexed owner, string tokenURI);

    // =============================================================
    //                         CONSTRUCTOR
    // =============================================================

    constructor() ERC721("SignetEvidence", "SIG") Ownable(msg.sender) {
        // Deployer otomatis terdaftar sebagai publisher pertama
        authorizedPublishers[msg.sender] = true;
    }

    // =============================================================
    //                          MODIFIERS
    // =============================================================

    /**
     * @dev Memastikan pemanggil fungsi sudah terdaftar sebagai Publisher.
     */
    modifier onlyAuthorized() {
        require(authorizedPublishers[msg.sender] == true, "SIGNET: Caller is not authorized. Please register first.");
        _;
    }

    // =============================================================
    //                       ADMIN FUNCTIONS
    // =============================================================

    /**
     * @notice Menambahkan alamat wallet baru ke daftar publisher.
     * @dev Hanya bisa dipanggil oleh Owner kontrak.
     * @param _publisher Alamat wallet yang ingin diizinkan.
     */
    function addPublisher(address _publisher) external onlyOwner {
        authorizedPublishers[_publisher] = true;
        emit PublisherAuthorized(_publisher);
    }

    /**
     * @notice Menghapus akses publisher dari alamat wallet tertentu.
     * @dev Hanya bisa dipanggil oleh Owner kontrak.
     * @param _publisher Alamat wallet yang ingin dihapus aksesnya.
     */
    function removePublisher(address _publisher) external onlyOwner {
        authorizedPublishers[_publisher] = false;
        emit PublisherRemoved(_publisher);
    }

    // =============================================================
    //                  DEMO / HACKATHON FEATURE
    // =============================================================

    /**
     * @notice Fitur pendaftaran mandiri untuk User Publik (DEMO ONLY).
     * @dev Memungkinkan user mendaftarkan diri sendiri sebagai publisher tanpa persetujuan Admin.
     * Fitur ini ditujukan untuk mempermudah pengujian saat Hackathon.
     */
    function registerAsPublisher() external {
        require(authorizedPublishers[msg.sender] == false, "SIGNET: You are already a registered publisher.");
        
        authorizedPublishers[msg.sender] = true;
        emit PublisherAuthorized(msg.sender);
    }

    // =============================================================
    //                        CORE LOGIC
    // =============================================================

    /**
     * @notice Mencetak (Mint) bukti digital baru sebagai NFT.
     * @dev Hanya bisa dipanggil oleh wallet yang sudah terdaftar (Authorized Publisher).
     * @param to Alamat wallet penerima NFT (User/Kreator).
     * @param pHash Hash unik dari file/dokumen (untuk mencegah duplikasi).
     * @param uri Link metadata IPFS yang berisi detail bukti.
     * @return tokenId ID dari NFT yang baru saja dicetak.
     */
    function mintEvidence(address to, string memory pHash, string memory uri) public onlyAuthorized returns (uint256) {
        // Validasi: Pastikan hash dokumen belum pernah didaftarkan sebelumnya
        require(isHashRegistered[pHash] == false, "SIGNET: Hash already registered on-chain!");

        // Update State: Tandai hash sebagai terpakai
        isHashRegistered[pHash] = true;

        uint256 tokenId = _nextTokenId++;
        
        // Minting NFT ke alamat tujuan
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit EvidenceCreated(tokenId, pHash, to, uri);
        
        return tokenId;
    }
}