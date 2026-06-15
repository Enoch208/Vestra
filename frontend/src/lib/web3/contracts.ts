import { parseAbi } from "viem";

export const VESTRA_AGENT_ID = BigInt(9387);

export const REPUTATION_REGISTRY =
  "0x8004BAa17C55a88189AE136b182e5fdA19dE9b63" as `0x${string}`;

export const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`;

export const reputationAbi = parseAbi([
  "function giveFeedback(uint256 agentId, int128 value, uint8 valueDecimals, string tag1, string tag2, string endpoint, string feedbackURI, bytes32 feedbackHash)",
  "function getSummary(uint256 agentId, address[] clientAddresses, string tag1, string tag2) view returns (uint64 count, int128 summaryValue, uint8 summaryValueDecimals)",
]);

export const VAULT = "0xf3c25dbd82FE887138B3a589455E4867740a4520" as `0x${string}`;
export const USDC = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C" as `0x${string}`;
export const IDENTITY_REGISTRY = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432" as `0x${string}`;
export const USER_AGENT_URI = "https://vestra-six-self.vercel.app/.well-known/agent-card.json";

export const vaultAbi = parseAbi([
  "function setVerified(address user, bool status)",
  "function verified(address) view returns (bool)",
  "function accounts(address) view returns (uint128 balance, uint128 lockedCollateral, uint64 dailyAmount, uint64 lastPullAt, uint32 streak, uint32 missedCount, bool active)",
  "function openAccount(uint64 dailyAmount)",
]);

export const identityAbi = parseAbi([
  "function register(string agentURI) returns (uint256 agentId)",
]);

export const usdcAbi = parseAbi([
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
]);

export const CREDIT_MODULE = "0x24eD128B46e54d3Cb20F33B5b872073f45E61454" as `0x${string}`;

export const creditModuleAbi = parseAbi([
  "function eligibleAmount(address user) view returns (uint256)",
  "function requestAdvance(uint128 amount)",
  "function repay(uint256 amount)",
  "function advances(address) view returns (uint128 principal, uint128 outstanding, uint128 collateral, uint64 dueDate, uint8 status)",
]);
