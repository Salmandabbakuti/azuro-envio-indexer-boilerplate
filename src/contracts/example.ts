import { Contract } from "ethers";

import { getEthersProvider } from "./ethersProvider";
import { CHAIN_RPC_URLS } from "../constants";

export const getTokenDetails = async (
  chainId: number,
  contractAddress: string
) => {
  const rpcUrl = CHAIN_RPC_URLS.get(chainId);
  if (!rpcUrl) {
    console.log("unsupported chainId");
    return {
      name: "",
      symbol: "",
      decimals: 0
    };
  }
  const provider = getEthersProvider(rpcUrl);
  const contract = new Contract(
    contractAddress,
    [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)"
    ],
    provider
  );
  try {
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals()
    ]);

    return {
      name,
      symbol,
      decimals
    };
  } catch (err) {
    console.error("An error occurred", err);
    return {
      name: "",
      symbol: "",
      decimals: 0
    };
  }
};
