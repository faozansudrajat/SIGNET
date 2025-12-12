// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SignetNFT.sol"; 

contract SignetNFTTest is Test {
    SignetNFT public signet;
    address public owner;
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        owner = address(this);
        signet = new SignetNFT();
    }

    // 1. Test Minting Sukses
    function testMintSuccess() public {
        string memory pHash = "hash_unik_123";
        string memory uri = "ipfs://metadata";
        
        uint256 tokenId = signet.mintEvidence(user1, pHash, uri);

        assertEq(signet.ownerOf(tokenId), user1);
        assertEq(signet.tokenURI(tokenId), uri);
        assertTrue(signet.isHashRegistered(pHash));
    }

    // 2. Test Hash Duplikat (Harus Revert)
    function testDuplicateHashReverts() public {
        string memory pHash = "hash_sama";
        
        // Mint pertama
        signet.mintEvidence(user1, pHash, "uri1");

        // Ekspektasi error saat mint kedua dengan hash yang sama
        vm.expectRevert("SIGNET: Hash already registered on-chain!");
        signet.mintEvidence(user2, pHash, "uri2"); 
    }

    // 3. Test Unauthorized User (Harus Revert)
    function testUnauthorizedReverts() public {
        vm.prank(user1); // Menyamar jadi user1
        
        vm.expectRevert("SIGNET: Caller is not authorized to mint.");
        signet.mintEvidence(user1, "hash_baru", "uri");
    }

    // 4. Test Add Publisher
    function testAddPublisher() public {
        signet.addPublisher(user2);
        
        vm.prank(user2);
        signet.mintEvidence(user1, "hash_user2", "uri");
        
        assertTrue(signet.isHashRegistered("hash_user2"));
    }
}