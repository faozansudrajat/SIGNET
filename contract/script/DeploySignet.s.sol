// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/SignetNFT.sol"; 

contract DeploySignet is Script {
    function run() external {
        // Mengambil Private Key dari Environment Variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Mulai mencatat transaksi
        vm.startBroadcast(deployerPrivateKey);

        // Deploy Contract
        SignetNFT signet = new SignetNFT();

        // Selesai mencatat
        vm.stopBroadcast();

        // Tampilkan alamat kontrak di terminal
        console.log("--------------------------------------------------");
        console.log("SignetNFT deployed successfully!");
        console.log("Contract Address:", address(signet));
        console.log("--------------------------------------------------");
    }
}