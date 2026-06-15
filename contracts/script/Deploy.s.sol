// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {SavingsVault} from "../src/SavingsVault.sol";
import {CreditModule} from "../src/CreditModule.sol";
import {TestUSD} from "../src/TestUSD.sol";

contract Deploy is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        uint256 hardCap = vm.envOr("HARD_CAP", uint256(50 ether));
        address tokenAddr = vm.envOr("TOKEN", address(0));

        vm.startBroadcast(pk);

        if (tokenAddr == address(0)) {
            TestUSD t = new TestUSD();
            tokenAddr = address(t);
            t.mint(deployer, 1_000_000 ether);
        }

        SavingsVault vault = new SavingsVault(tokenAddr, deployer, deployer);
        CreditModule credit = new CreditModule(address(vault), deployer, hardCap);
        vault.setCreditModule(address(credit));

        vm.stopBroadcast();

        console.log("TOKEN", tokenAddr);
        console.log("VAULT", address(vault));
        console.log("CREDIT_MODULE", address(credit));
        console.log("AGENT_GUARDIAN", deployer);
    }
}
