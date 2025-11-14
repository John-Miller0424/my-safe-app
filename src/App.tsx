import { useState } from "react";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import type { BaseTransaction } from "@safe-global/safe-apps-sdk";

function App() {
  const { sdk, safe } = useSafeAppsSDK();
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handlePayNow = async () => {
    if (!safe) {
      alert("This page must be opened inside Safe Apps.");
      return;
    }

    try {
      setIsSending(true);
      setStatus(null);

      // EXAMPLE TX:
      // Here we just send a dummy transaction: 0 ETH to the Safe itself.
      // You can change `to`, `value`, `data` later for real payments.
      const txs: BaseTransaction[] = [
        {
          to: safe.safeAddress, // Safe sends to itself (no real effect)
          value: "0",           // value in WEI as string (e.g. "1000000000000000" for 0.001 ETH)
          data: "0x",
        },
      ];

      const txResponse = await sdk.txs.send({ txs });
      console.log("Safe tx response:", txResponse);

      setStatus(
        "Transaction created. Check the Safe 'Transactions' tab / queue."
      );
    } catch (e) {
      console.error(e);
      setStatus("Error sending transaction. See console log.");
    } finally {
      setIsSending(false);
    }
  };

  // If not loaded inside Safe, show simple info
  if (!safe) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Safe App demo</h2>
          <p>Open this URL from Safe → Apps to use the Pay Now button.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={{ marginBottom: 8 }}>My Pay Demo</h1>
        <p style={{ marginBottom: 16 }}>
          Connected Safe: <code>{safe.safeAddress}</code>
        </p>

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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
  },
  card: {
    background: "#ffffff",
    padding: "24px 28px",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    maxWidth: "480px",
    width: "100%",
    textAlign: "center",
  },
  button: {
    marginTop: 12,
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    background: "#2b8aef",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default App;
