import { AVATARS_PROVIDER_BASE_URLS, CHAINS_IDS } from "../constants";

export function getImageUrl(
  network: string | null,
  sportId: BigInt,
  gameId: BigInt,
  participantName: string
): string | null {
  if (network === null) {
    return null;
  }

  let chainId: string | undefined;

  if (CHAINS_IDS.has(network)) {
    chainId = CHAINS_IDS.get(network);
  }

  if (chainId === undefined) {
    return null;
  }

  let baseUrl: string | undefined;

  if (AVATARS_PROVIDER_BASE_URLS.has(chainId)) {
    baseUrl = AVATARS_PROVIDER_BASE_URLS.get(chainId);
  }

  if (baseUrl === undefined) {
    return null;
  }

  return baseUrl
    .concat(sportId.toString())
    .concat("/")
    .concat(gameId.toString())
    .concat("/")
    .concat(participantName)
    .concat(".png");
}
