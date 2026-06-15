// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

uint8 constant REP_CONTRIBUTION = 1;
uint8 constant REP_REPAYMENT = 2;
uint8 constant REP_DEFAULT = 3;
uint8 constant REP_MISSED = 4;

interface IReputationSink {
    function record(address subject, uint8 kind, uint256 value, bool onTime) external;
}
