import { parseAbi, parseAbiItem } from "viem";

export const savingsVaultAbi = parseAbi([
  "function accounts(address) view returns (uint128 balance, uint128 lockedCollateral, uint64 dailyAmount, uint64 lastPullAt, uint32 streak, uint32 missedCount, bool active)",
  "function pullContribution(address user)",
  "function available(address user) view returns (uint256)",
  "function setVerified(address user, bool status)",
  "function verified(address) view returns (bool)",
  "function openAccount(uint64 dailyAmount)",
]);

export const erc20Abi = parseAbi([
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
]);

export const ACCOUNT_OPENED_EVENT = parseAbiItem(
  "event AccountOpened(address indexed user, uint64 dailyAmount)"
);

export const reputationAbi = parseAbi([
  "function giveFeedback(uint256 agentId, int128 value, uint8 valueDecimals, string tag1, string tag2, string endpoint, string feedbackURI, bytes32 feedbackHash)",
  "function getSummary(uint256 agentId, address[] clientAddresses, string tag1, string tag2) view returns (uint64 count, int128 summaryValue, uint8 summaryValueDecimals)",
]);

export const identityAbi = parseAbi([
  "function register(string agentURI) returns (uint256 agentId)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function getAgentWallet(uint256 agentId) view returns (address)",
  "function setAgentURI(uint256 agentId, string newURI)",
  "function tokenURI(uint256 tokenId) view returns (string)",
]);

export const REGISTERED_EVENT = parseAbiItem(
  "event Registered(uint256 indexed agentId, string agentURI, address indexed owner)"
);

export const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;

export const PULL_WINDOW = 86400n;
export const GRACE = 21600n;
