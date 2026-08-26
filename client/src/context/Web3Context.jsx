import React, { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import contractArtifact from "../config/contractArtifact.json";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      setHasMetaMask(true);

      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount("");
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask extension is required to perform blockchain operations.");
      return false;
    }

    try {
      setIsConnecting(true);
      setError("");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();

      setAccount(accounts[0]);
      setChainId(network.chainId.toString());

      if (contractArtifact && contractArtifact.address) {
        const signer = await provider.getSigner();
        const instance = new ethers.Contract(contractArtifact.address, contractArtifact.abi, signer);
        setContract(instance);
      }

      setIsConnecting(false);
      return accounts[0];
    } catch (err) {
      console.error("Wallet connection error:", err);
      setError(err.message || "Failed to connect MetaMask wallet");
      setIsConnecting(false);
      return false;
    }
  };

  const registerProductOnChain = async (productId, productHash) => {
    if (!account) {
      const connected = await connectWallet();
      if (!connected) throw new Error("Wallet connection required to register on blockchain");
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const instance = new ethers.Contract(contractArtifact.address, contractArtifact.abi, signer);

      console.log(`Submitting on-chain transaction for product ${productId}...`);
      const tx = await instance.registerProduct(productId, productHash);
      const receipt = await tx.wait();

      console.log("Blockchain transaction confirmed:", receipt.hash);
      return receipt.hash;
    } catch (err) {
      console.error("On-chain registration error:", err);
      throw new Error(err.reason || err.message || "Blockchain transaction failed or rejected");
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        chainId,
        hasMetaMask,
        isConnecting,
        contract,
        error,
        connectWallet,
        registerProductOnChain,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
