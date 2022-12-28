import { NFTDetailsData } from "./types";
import { List } from "@raycast/api";
import { NFTDetails } from "./details";

export const ListView = ({ data, allNfts, nft, actions }: NFTDetailsData) => {
  return (
    <List isShowingDetail>
      <List.Section title={nft.metadata?.name ?? `${data.contract?.symbol} #${nft.token_id}`}>
        <List.Item
          title={nft.metadata?.name ?? `${data.contract?.symbol} #${nft.token_id}`}
          actions={actions(nft)}
          detail={<NFTDetails data={data} nft={nft} />}
        />
      </List.Section>
      {allNfts.length > 0 && (
        <List.Section title="Other NFTs">
          {allNfts.map((anotherNft: unknown, i: number) => {
            const tokenId = nft.token_id ?? nft.mint_address;
            const anotherNftTokenId = anotherNft.token_id ?? anotherNft.mint_address;
            if (tokenId === anotherNftTokenId) return;
            return (
              <List.Item
                key={i}
                title={anotherNft.metadata?.name ?? `${data.contract?.symbol} #${anotherNft.token_id}`}
                actions={actions(anotherNft)}
                detail={<NFTDetails data={data} nft={anotherNft} />}
              />
            );
          })}
        </List.Section>
      )}
    </List>
  );
};
