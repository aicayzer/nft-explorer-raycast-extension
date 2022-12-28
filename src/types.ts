import { ReactNode } from "react";

export const chains = ["Ethereum", "Polygon", "Solana"];

export interface CommandForm {
  address: string;
  chain: typeof chains[number];
  pageNumber?: number;
  pageSize?: number;
}

export interface NFTPortErrorResponse {
  status_code: number;
  code: string;
  message: string;
}

export interface NFTDetailsData {
  data: unknown;
  allNfts: unknown[];
  nft: unknown;
  actions: (nft: unknown, showNftDetailsButton?: boolean) => ReactNode;
}

export interface ErrorViewData {
  isLoading: boolean;
  error: NFTPortErrorResponse;
}

export interface InputsFormData {
  isLoading: boolean;
  handleSubmit: (values: CommandForm) => void;
}
