// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IReputationSink} from "../../src/interfaces/IReputationSink.sol";

contract MockReputation is IReputationSink {
    struct Rec {
        address subject;
        uint8 kind;
        uint256 value;
        bool onTime;
    }

    Rec[] public records;

    function record(address subject, uint8 kind, uint256 value, bool onTime) external {
        records.push(Rec(subject, kind, value, onTime));
    }

    function count() external view returns (uint256) {
        return records.length;
    }

    function lastKind() external view returns (uint8) {
        return records[records.length - 1].kind;
    }
}
