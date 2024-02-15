// import { Web3, Bytes } from "web3";
import { ethers, BytesLike } from "ethers";

export const sports = new Map<bigint, string>();

export const CHAINS_IDS = new Map<string, string>();

CHAINS_IDS.set("gnosis", "100");
CHAINS_IDS.set("matic", "137");
CHAINS_IDS.set("mumbai", "80001");
CHAINS_IDS.set("arbitrum-one", "42161");
CHAINS_IDS.set("arbitrum-goerli", "421613");

// tmp hack for linea
CHAINS_IDS.set("polygon-zkevm-testnet", "59140");
CHAINS_IDS.set("polygon-zkevm", "59144");

const AVATARS_PROVIDER_BASE_URL_DEV = "https://dev-avatars.azuro.org/images/";
const AVATARS_PROVIDER_BASE_URL_PROD = "https://avatars.azuro.org/images/";

// chainId -> avatars base url
export const AVATARS_PROVIDER_BASE_URLS = new Map<string, string>();

AVATARS_PROVIDER_BASE_URLS.set("100", AVATARS_PROVIDER_BASE_URL_PROD);
AVATARS_PROVIDER_BASE_URLS.set("137", AVATARS_PROVIDER_BASE_URL_PROD);
AVATARS_PROVIDER_BASE_URLS.set("42161", AVATARS_PROVIDER_BASE_URL_PROD);
AVATARS_PROVIDER_BASE_URLS.set("59144", AVATARS_PROVIDER_BASE_URL_PROD);

AVATARS_PROVIDER_BASE_URLS.set("80001", AVATARS_PROVIDER_BASE_URL_DEV);
AVATARS_PROVIDER_BASE_URLS.set("421613", AVATARS_PROVIDER_BASE_URL_DEV);
AVATARS_PROVIDER_BASE_URLS.set("59144", AVATARS_PROVIDER_BASE_URL_DEV);

export const CORE_TYPE_PRE_MATCH = "pre-match";
export const CORE_TYPE_PRE_MATCH_V2 = "pre-match-v2";
export const CORE_TYPE_EXPRESS = "express";
export const CORE_TYPE_EXPRESS_V2 = "express-v2";
export const CORE_TYPE_LIVE = "live";

export const CORE_TYPES = new Map<BytesLike, string>();

CORE_TYPES.set(
  ethers.getBytes(
    "0x56ff202de9ba417fbc2912bebe53dea80efb0df607262a180f0517649590c806"
  ),
  CORE_TYPE_PRE_MATCH
);
CORE_TYPES.set(
  ethers.getBytes(
    "0xa370412a877636f0419e753f8c70c2a0836cf09798778fd9a2285aaae2c168e7"
  ),
  CORE_TYPE_PRE_MATCH_V2
);
CORE_TYPES.set(
  ethers.getBytes(
    "0x36216ab39e2e6e2f7615df148032d88ba1863a2cb6295d3f972e47d1ac7a4a85"
  ),
  CORE_TYPE_EXPRESS
);
CORE_TYPES.set(
  ethers.getBytes(
    "0x0120c420fa0b8dacbc611f3b9d2b64da4e1e8984482ec9dff5b8371455ae24b0"
  ),
  CORE_TYPE_EXPRESS_V2
);
CORE_TYPES.set(
  ethers.getBytes(
    "0x889375b77befea7650d686ae2bb3a2d812c58007d3fc942cd8eb7cf4fc8d4e93"
  ),
  CORE_TYPE_LIVE
);

export const VERSION_V1 = "V1";
export const VERSION_V2 = "V2";
export const VERSION_V3 = "V3";

const V1_BASE = 9;
const V2_BASE = 12;
const V3_BASE = 12;

export const BASES_VERSIONS = new Map<string, number>();

BASES_VERSIONS.set(VERSION_V1, V1_BASE);
BASES_VERSIONS.set(VERSION_V2, V2_BASE);
BASES_VERSIONS.set(VERSION_V3, V3_BASE);

export const C1e9 = BigInt("1000000000");
export const C1e12 = BigInt("1000000000000");

export const MULTIPLIERS_VERSIONS = new Map<string, bigint>();

MULTIPLIERS_VERSIONS.set(VERSION_V1, C1e9);
MULTIPLIERS_VERSIONS.set(VERSION_V2, C1e12);
MULTIPLIERS_VERSIONS.set(VERSION_V3, C1e12);

export const X_PROFIT = BigInt(75);
export const X_PROFIT_DIVIDER = BigInt(100);

export const CUSTOM_FIRST_BLOCK_TIMESTAMPS = new Map<string, BigInt>();

// polygon usdc prod
CUSTOM_FIRST_BLOCK_TIMESTAMPS.set(
  "0x2a838ab9b037db117576db8d0dcc3b686748ef7c",
  BigInt(1675900800)
);
// gnosis xdai prod
CUSTOM_FIRST_BLOCK_TIMESTAMPS.set(
  "0x204e7371ade792c5c006fb52711c50a7efc843ed",
  BigInt(1675123200)
);

// mumbai usdc dev
CUSTOM_FIRST_BLOCK_TIMESTAMPS.set(
  "0xbaeb482a9933168d0708d9c8f6f6dc056994e35e",
  BigInt(1675900800)
);
// gnosis xdai dev
CUSTOM_FIRST_BLOCK_TIMESTAMPS.set(
  "0xe068bf88317fa2eb3eaecbfe1e486d8b2dde7761",
  BigInt(1675123200)
);

// literals
export const GAME_STATUS_CREATED = ethers.toUtf8Bytes("Created");
export const GAME_STATUS_PAUSED = ethers.toUtf8Bytes("Paused");
export const GAME_STATUS_CANCELED = ethers.toUtf8Bytes("Canceled");
export const GAME_STATUS_RESOLVED = ethers.toUtf8Bytes("Resolved");

export const CONDITION_STATUS_CREATED = ethers.toUtf8Bytes("Created");
export const CONDITION_STATUS_RESOLVED = ethers.toUtf8Bytes("Resolved");
export const CONDITION_STATUS_CANCELED = ethers.toUtf8Bytes("Canceled");
export const CONDITION_STATUS_PAUSED = ethers.toUtf8Bytes("Paused");

export const BET_TYPE_ORDINAR = ethers.toUtf8Bytes("Ordinar");
export const BET_TYPE_EXPRESS = ethers.toUtf8Bytes("Express");

export const BET_STATUS_ACCEPTED = ethers.toUtf8Bytes("Accepted");
export const BET_STATUS_CANCELED = ethers.toUtf8Bytes("Canceled");
export const BET_STATUS_RESOLVED = ethers.toUtf8Bytes("Resolved");

export const FREEBET_STATUS_CREATED = ethers.toUtf8Bytes("Created");
export const FREEBET_STATUS_REISSUED = ethers.toUtf8Bytes("Reissued");
export const FREEBET_STATUS_REDEEMED = ethers.toUtf8Bytes("Redeemed");
export const FREEBET_STATUS_WITHDRAWN = ethers.toUtf8Bytes("Withdrawn");

export const BET_RESULT_WON = ethers.toUtf8Bytes("Won");
export const BET_RESULT_LOST = ethers.toUtf8Bytes("Lost");

export const SELECTION_RESULT_WON = ethers.toUtf8Bytes("Won");
export const SELECTION_RESULT_LOST = ethers.toUtf8Bytes("Lost");

export const LP_TRANSACTION_TYPE_DEPOSIT = ethers.toUtf8Bytes("Deposit");
export const LP_TRANSACTION_TYPE_WITHDRAWAL = ethers.toUtf8Bytes("Withdrawal");

export const DEFAULT_COUNTRY = ethers.toUtf8Bytes("International Tournaments");
