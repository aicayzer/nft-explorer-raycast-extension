import { NFTDetailsData } from "./types";
import { ReactNode } from "react";
import { List } from "@raycast/api";
import { isNil, isArray, isObject } from "lodash";

export const NFTDetails = ({ data, nft }: Partial<NFTDetailsData>): JSX.Element => {
  const hasImage = !isNil(nft.cached_file_url) || !isNil(nft.metadata?.image);

  const renderMetadataValue = (label: string, value: any): ReactNode => {
    if (value == null) {
      return null;
    }

    label = label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, " ");

    if (isArray(value)) {
      return value.map((element) => {
        if (isObject(element)) {
          return Object.entries(element).map(([key, value]) => {
            if (key === "trait_type") {
              label = value;
              return null;
            } else if (key === "value") {
              value = value;
            }
            return renderMetadataValue(label, value);
          });
        }
      });
    }
    if (isObject(value)) {
      return Object.entries(value).map(([label, value]) => renderMetadataValue(label, value));
    }
    return <List.Item.Detail.Metadata.Label title={label} text={String(value)} />;
  };

  return (
    <List.Item.Detail
      markdown={hasImage && `<img src="${nft.cached_file_url ?? nft.metadata?.image}" width="180" height="180" />`}
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label
            title="Name"
            text={nft.metadata?.name ?? `${data.contract?.symbol} #${nft.token_id}`}
          />
          <List.Item.Detail.Metadata.Separator />
          {Object.entries(nft).map(([label, value]) => renderMetadataValue(label, value))}
        </List.Item.Detail.Metadata>
      }
    />
  );
};
