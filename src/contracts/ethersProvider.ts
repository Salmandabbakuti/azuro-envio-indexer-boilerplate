import { ethers } from "ethers";

export const getEthersProvider = (rpcUrl: string): ethers.JsonRpcProvider => {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return provider;
};
