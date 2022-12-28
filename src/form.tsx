import { Action, ActionPanel, Form } from "@raycast/api";
import { chains, InputsFormData } from "./types";
import { useState } from "react";

export const InputsForm = ({ isLoading, handleSubmit }: InputsFormData) => {
  const [input, setInput] = useState<string>("");
  const [selectedChain, setSelectedChain] = useState<typeof chains[number]>(chains[0].toLowerCase());

  return (
    <Form
      navigationTitle={isLoading ? "🤖 Loading..." : "NFTPort"}
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="address"
        title="Address*: "
        value={input}
        onChange={setInput}
        placeholder={
          selectedChain === "solana" ? "Enter collection/wallet address" : "Enter contract/collection address"
        }
      />
      <Form.Dropdown id="chain" title="Chain: " defaultValue={selectedChain} onChange={setSelectedChain}>
        {chains.map((chain: string, i: number) => (
          <Form.Dropdown.Item key={i} value={chain.toLowerCase()} title={chain} />
        ))}
      </Form.Dropdown>
    </Form>
  );
};
