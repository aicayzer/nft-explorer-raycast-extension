import { CommandForm } from "../types";
import { getPreferenceValues } from "@raycast/api";
import fetch from "node-fetch";

export const getContractNFTs = async ({ address, chain, pageNumber = 1, pageSize = 50 }: CommandForm) => {
  const includeSolana = chain === "solana" ? "/solana" : "";

  const preferences = getPreferenceValues();
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: preferences.apiKey,
    },
  };
  const res = await fetch(
    `https://api.nftport.xyz/v0${includeSolana}/nfts/${address}?chain=${chain}&page_number=1&page_size=${pageSize}&include=metadata`,
    options
  );
  const data = await res.json();

  return data;
};
