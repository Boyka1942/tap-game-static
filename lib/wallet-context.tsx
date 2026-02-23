import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Platform } from "react-native";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connectWallet: (onConnected?: (address: string) => void) => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async (onConnected?: (address: string) => void) => {
    if (Platform.OS === "web") {
      // Web: Use MetaMask or manual input
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({
            method: "eth_requestAccounts",
          });
          if (accounts && accounts.length > 0) {
            const walletAddr = accounts[0];
            setAddress(walletAddr);
            setIsConnected(true);
            // Store wallet address locally
            localStorage.setItem("wallet_address", walletAddr);
            // Notify callback
            if (onConnected) onConnected(walletAddr);
          }
        } catch (error) {
          console.error("Error connecting wallet:", error);
          // Fallback to manual input
          const manualAddress = prompt("MetaMask not available. Enter your wallet address manually:");
          if (manualAddress && manualAddress.startsWith("0x") && manualAddress.length === 42) {
            setAddress(manualAddress);
            setIsConnected(true);
            localStorage.setItem("wallet_address", manualAddress);
            // Notify callback
            if (onConnected) onConnected(manualAddress);
          } else if (manualAddress) {
            alert("Invalid wallet address. Please enter a valid Ethereum address.");
          }
        }
      } else {
        // No MetaMask, use manual input
        const manualAddress = prompt("Enter your Ethereum wallet address (0x...):");
        if (manualAddress && manualAddress.startsWith("0x") && manualAddress.length === 42) {
          setAddress(manualAddress);
          setIsConnected(true);
          localStorage.setItem("wallet_address", manualAddress);
          // Notify callback
          if (onConnected) onConnected(manualAddress);
        } else if (manualAddress) {
          alert("Invalid wallet address. Please enter a valid Ethereum address starting with 0x.");
        }
      }
    } else {
      // Mobile: Manual input
      alert("Please use the web version to connect your wallet.");
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
    if (Platform.OS === "web" && typeof window !== "undefined") {
      localStorage.removeItem("wallet_address");
    }
  };

  // Check for existing connection on mount
  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("wallet_address");
      if (savedAddress) {
        setAddress(savedAddress);
        setIsConnected(true);
      }
    }
  }, []);

  return (
    <WalletContext.Provider value={{ address, isConnected, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
