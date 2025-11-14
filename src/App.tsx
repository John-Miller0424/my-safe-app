import { useState } from "react";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import type { BaseTransaction } from "@safe-global/safe-apps-sdk";
import { ERC20_ABI } from "./abi/erc20";
import { ethers } from "ethers";

function App() {
  const { sdk, safe } = useSafeAppsSDK();
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handlePayNow = async () => {
    if (!safe) {
      alert("This page must be opened inside Safe Apps.");
      return;
    }

    setIsSending(true);
    setStatus(null);

    try {
      // USDC contract (Ethereum mainnet)
      const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

      // Demo recipient
      const recipient = "0x000000000000000000000000000000000000dEaD";

      // Send 1 USDC (6 decimals)
      const amount = ethers.parseUnits("1", 6);

      // Encode transfer()
      const iface = new ethers.Interface(ERC20_ABI);
      const data = iface.encodeFunctionData("transfer", [
        recipient,
        amount,
      ]);

      const txs: BaseTransaction[] = [
        {
          to: USDC,
          value: "0",
          data,
        },
      ];

      const result = await sdk.txs.send({ txs });
      console.log("Transaction created:", result);

      setStatus("Transaction created — check Safe confirmation screen.");
    } catch (err) {
      console.error(err);
      setStatus("Error sending transaction.");
    }

    setIsSending(false);
  };

  // When not inside Safe
  if (!safe) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Safe App Demo</h2>
          <p>Open this app via Safe → Apps</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>My Safe App</h1>

        <p>Connected Safe:</p>
        <code>{safe.safeAddress}</code>

        <button
          style={styles.button}
          onClick={handlePayNow}
          disabled={isSending}
        >
          {isSending ? "Preparing..." : "Pay Now"}
        </button>

        {status && <p style={{ marginTop: 16 }}>{status}</p>}
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#f4f4f4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "420px",
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    padding: "12px 24px",
    fontSize: "16px",
    color: "#fff",
    background: "#2b8aef",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
};

export default App;
