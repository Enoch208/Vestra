export interface VestraUser {
  id: string;
  displayName: string;
  country: string;
  flag: string;
  dailyAmountCusd: number;
  streak: number;
  totalSavedCusd: number;
  score: number;
  status: "ACTIVE" | "CREDIT_ACTIVE" | "PAUSED";
  advanceOutstandingCusd?: number;
}

export interface SavingsEvent {
  id: string;
  timestamp: string;
  userDisplay: string;
  country: string;
  amountCusd: number;
  type: "CONTRIBUTION" | "REPAYMENT" | "ADVANCE";
  status: "PENDING" | "CONFIRMED" | "RECORDED";
  streak: number;
  txHash: string;
}

export interface ReputationEvent {
  kind: "CONTRIBUTION" | "REPAYMENT" | "STREAK_MILESTONE";
  label: string;
  amountCusd: number;
  onTime: boolean;
  dayNumber: number;
  txHash: string;
}

export interface CreditIdentityRecord {
  userDisplay: string;
  walletShort: string;
  country: string;
  flag: string;
  dailyAmountCusd: number;
  streak: number;
  totalSavedCusd: number;
  score: number;
  advanceEligibleCusd: number;
  events: ReputationEvent[];
}

export interface VestraSummary {
  verifiedUsers: number;
  totalContributions: number;
  reputationEvents: number;
  totalSavedCusd: number;
  advancesIssued: number;
  activeStreaks: number;
}

export const SEED_USERS: VestraUser[] = [
  {
    id: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    displayName: "maya.celo",
    country: "Nigeria",
    flag: "🇳🇬",
    dailyAmountCusd: 0.10,
    streak: 28,
    totalSavedCusd: 2.80,
    score: 680,
    status: "CREDIT_ACTIVE",
    advanceOutstandingCusd: 2.50,
  },
  {
    id: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
    displayName: "daniel.celo",
    country: "Kenya",
    flag: "🇰🇪",
    dailyAmountCusd: 0.20,
    streak: 14,
    totalSavedCusd: 2.80,
    score: 420,
    status: "ACTIVE",
  },
  {
    id: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
    displayName: "sofia.celo",
    country: "Philippines",
    flag: "🇵🇭",
    dailyAmountCusd: 0.50,
    streak: 42,
    totalSavedCusd: 21.00,
    score: 850,
    status: "CREDIT_ACTIVE",
  },
  {
    id: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
    displayName: "amara.celo",
    country: "Senegal",
    flag: "🇸🇳",
    dailyAmountCusd: 0.10,
    streak: 7,
    totalSavedCusd: 0.70,
    score: 210,
    status: "ACTIVE",
  },
  {
    id: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
    displayName: "rafael.celo",
    country: "Brazil",
    flag: "🇧🇷",
    dailyAmountCusd: 0.15,
    streak: 21,
    totalSavedCusd: 3.15,
    score: 560,
    status: "ACTIVE",
  },
  {
    id: "0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a",
    displayName: "priya.celo",
    country: "India",
    flag: "🇮🇳",
    dailyAmountCusd: 0.25,
    streak: 35,
    totalSavedCusd: 8.75,
    score: 720,
    status: "CREDIT_ACTIVE",
  },
];

export const MAYA_CREDIT_RECORD: CreditIdentityRecord = {
  userDisplay: "maya.celo",
  walletShort: "0x1a2b…9a0b",
  country: "Nigeria",
  flag: "🇳🇬",
  dailyAmountCusd: 0.10,
  streak: 28,
  totalSavedCusd: 2.80,
  score: 680,
  advanceEligibleCusd: 2.50,
  events: [
    {
      kind: "STREAK_MILESTONE",
      label: "28-day milestone",
      amountCusd: 2.80,
      onTime: true,
      dayNumber: 28,
      txHash: "0xd44be8d84fb264f288b83e7e2d523bd7b7265ab0b7354a718",
    },
    {
      kind: "REPAYMENT",
      label: "Advance repaid",
      amountCusd: 1.00,
      onTime: true,
      dayNumber: 25,
      txHash: "0xc5edc9fc015b052eac4352025c4460ca4bc1f2e606830c29",
    },
    {
      kind: "CONTRIBUTION",
      label: "Day 28",
      amountCusd: 0.10,
      onTime: true,
      dayNumber: 28,
      txHash: "0x4b6d68564529272963f599e646cd717cfea1d416adebab2b",
    },
    {
      kind: "CONTRIBUTION",
      label: "Day 27",
      amountCusd: 0.10,
      onTime: true,
      dayNumber: 27,
      txHash: "0x850107477832147f9eac73afa4d5578ccc41ee0c538a0733",
    },
  ],
};

export const RECENT_EVENTS: SavingsEvent[] = [
  {
    id: "0xc5edc9fc015b052eac4352025c4460ca4bc1f2e606830c29",
    timestamp: "2026-06-14T08:42:15Z",
    userDisplay: "maya.celo",
    country: "Nigeria",
    amountCusd: 0.10,
    type: "CONTRIBUTION",
    status: "RECORDED",
    streak: 28,
    txHash: "0xc5edc9fc015b05…1bab",
  },
  {
    id: "0x4b6d68564529272963f599e646cd717cfea1d416adebab2b",
    timestamp: "2026-06-14T08:42:16Z",
    userDisplay: "sofia.celo",
    country: "Philippines",
    amountCusd: 0.50,
    type: "CONTRIBUTION",
    status: "RECORDED",
    streak: 42,
    txHash: "0x4b6d6856452927…808",
  },
  {
    id: "0xd44be8d84fb264f288b83e7e2d523bd7b7265ab0b7354a71",
    timestamp: "2026-06-14T08:44:02Z",
    userDisplay: "priya.celo",
    country: "India",
    amountCusd: 0.25,
    type: "CONTRIBUTION",
    status: "CONFIRMED",
    streak: 35,
    txHash: "0xd44be8d84fb264…36b",
  },
  {
    id: "0x850107477832147f9eac73afa4d5578ccc41ee0c538a0733",
    timestamp: "2026-06-14T08:44:59Z",
    userDisplay: "daniel.celo",
    country: "Kenya",
    amountCusd: 0.20,
    type: "CONTRIBUTION",
    status: "PENDING",
    streak: 14,
    txHash: "0x850107477832…6d3",
  },
  {
    id: "0x57b6378d86207972e3bde5f8ce2e8c8c197b45956210ad67",
    timestamp: "2026-06-14T08:45:12Z",
    userDisplay: "maya.celo",
    country: "Nigeria",
    amountCusd: 1.00,
    type: "REPAYMENT",
    status: "RECORDED",
    streak: 28,
    txHash: "0x57b6378d862079…ba7",
  },
  {
    id: "0xbc5de3ae4fcd9590e701d9ce1d1468cacd477ec1e61d1798",
    timestamp: "2026-06-14T08:45:33Z",
    userDisplay: "rafael.celo",
    country: "Brazil",
    amountCusd: 0.15,
    type: "CONTRIBUTION",
    status: "RECORDED",
    streak: 21,
    txHash: "0xbc5de3ae4fcd95…a5",
  },
  {
    id: "0xa379778102f7868f7eaed053e4142310fb5f913db8428e60",
    timestamp: "2026-06-14T08:45:48Z",
    userDisplay: "amara.celo",
    country: "Senegal",
    amountCusd: 0.10,
    type: "CONTRIBUTION",
    status: "CONFIRMED",
    streak: 7,
    txHash: "0xa37977810…51",
  },
  {
    id: "0x34852d6abcdd1cfa82ead200dc43e2bfac9c5abb8b15f35",
    timestamp: "2026-06-14T08:46:02Z",
    userDisplay: "sofia.celo",
    country: "Philippines",
    amountCusd: 2.50,
    type: "ADVANCE",
    status: "RECORDED",
    streak: 42,
    txHash: "0x34852d6abcdd…9",
  },
];

export const VESTRA_SUMMARY: VestraSummary = {
  verifiedUsers: 0,
  totalContributions: 0,
  reputationEvents: 0,
  totalSavedCusd: 0,
  advancesIssued: 0,
  activeStreaks: 0,
};
