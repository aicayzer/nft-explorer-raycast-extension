import { Action, ActionPanel, Grid, Icon } from "@raycast/api";
import { useState } from "react";
import { chains, CommandForm, NFTPortErrorResponse } from "./types";
import { getContractNFTs } from "./lib/getContractNFTs";
import { isNil } from "lodash";
import { ErrorView } from "./error";
import { ListView } from "./list";
import { InputsForm } from "./form";
import { getWalletNFTs } from "./lib/getWalletNFTs";

export default function Command() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<NFTPortErrorResponse>();

  const [data, setData] = useState<any[]>([]);
  const [nfts, setNFTs] = useState<any[]>([]);

  const handleNFTPortResponse = (
    response: unknown,
    address: string,
    chain: typeof chains[number],
    tryForWalletNFTs?: boolean
  ) => {
    if (!isNil(response.error)) {
      if (response.error.code.code === "invalid_api_key" || !tryForWalletNFTs) {
        setError(response.error);
        setLoading(false);
        return;
      }
      tryForWalletNfts(address, chain);
      return;
    }
    setData(response);
    setNFTs(response.nfts);
  };

  const tryForWalletNfts = (address: string, chain: typeof chains[number]) => {
    getWalletNFTs({ address, chain })
      .then((response) => {
        console.log(JSON.stringify(response));
        handleNFTPortResponse(response, address, chain);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function handleSubmit({ address, chain }: CommandForm) {
    if (address.length === 0) return;

    setLoading(true);
    getContractNFTs({ address, chain })
      .then((response) => {
        console.log(JSON.stringify(response));
        handleNFTPortResponse(response, address, chain, true);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }

  if (!isNil(error)) return <ErrorView isLoading={isLoading} error={error} />;

  const getNFTActions = (nft: unknown, showNftDetailsButton = true): JSX.Element => (
    <ActionPanel>
      {showNftDetailsButton && (
        <Action.Push
          title="Show NFT Details"
          icon={Icon.Sidebar}
          target={
            <ListView
              data={data}
              allNfts={nfts}
              nft={nft}
              actions={(nft, showNftDetailsButton) => getNFTActions(nft, showNftDetailsButton)}
            />
          }
        />
      )}
      <Action.OpenInBrowser
        title="Open NFTPort API Docs"
        url="https://docs.nftport.xyz/reference/retrieve-contract-nfts"
      />
      <Action.CopyToClipboard title="Copy Token Id" content={nft.token_id ?? nft.mint_address} />
      <Action.CopyToClipboard
        title="Copy Contract Address"
        content={nft.contract_address ?? nft.on_chain_collection_key}
      />
      <Action.CopyToClipboard title="Copy Contract Name" content={data.contract?.name ?? nft.metadata?.symbol} />
      <Action.CopyToClipboard title="Copy Cached Image" content={nft.cached_file_url ?? nft.metadata?.image} />
    </ActionPanel>
  );

  if (nfts.length === 0) {
    return <InputsForm isLoading={isLoading} handleSubmit={handleSubmit} />;
  }

  return (
    <Grid columns={5} fit={Grid.Fit.Fill} isLoading={isLoading}>
      {nfts.map((nft, index) => (
        <Grid.Item
          key={index}
          content={{ value: { source: nft.cached_file_url } }}
          title={nft.metadata?.name ?? `${data.contract?.symbol} #${nft.token_id}`}
          subtitle={nft.metadata?.symbol ?? data.contract?.symbol}
          actions={getNFTActions(nft)}
        />
      ))}
    </Grid>
  );
}
