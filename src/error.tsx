import { Action, ActionPanel, Grid, openCommandPreferences } from "@raycast/api";
import { ErrorViewData } from "./types";

export const ErrorView = ({ isLoading, error }: ErrorViewData) => {
  const genericError = "No results found";
  const apiKeyError = "API key incorrect";
  const apiKeyErrorDescription = "Please update your API in Raycast extension preferences and try again";

  return (
    <Grid fit={Grid.Fit.Fill} isLoading={isLoading}>
      <Grid.EmptyView
        icon={{ source: "nftport.png" }}
        title={error.code === "invalid_api_key" ? apiKeyError : genericError}
        description={error.code === "invalid_api_key" ? apiKeyErrorDescription : error.message}
        actions={
          error.code === "invalid_api_key" && (
            <ActionPanel>
              <Action title="Open Extension Preferences" onAction={openCommandPreferences} />
            </ActionPanel>
          )
        }
      />
    </Grid>
  );
};
