import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Dynamically import Telegram SDK only on client side
let WebApp: any = null;
if (typeof window !== "undefined") {
  WebApp = require("@twa-dev/sdk").default;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramContextType {
  webApp: typeof WebApp | null;
  user: TelegramUser | null;
  isReady: boolean;
  isTelegramEnvironment: boolean;
  expand: () => void;
  close: () => void;
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  showAlert: (message: string) => void;
  showConfirm: (message: string) => Promise<boolean>;
  shareToStory: (mediaUrl: string, text?: string) => void;
  openTelegramLink: (url: string) => void;
  openLink: (url: string) => void;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isTelegramEnvironment, setIsTelegramEnvironment] = useState(false);

  useEffect(() => {
    // Check if running inside Telegram
    const isTelegram = typeof window !== "undefined" && (window as any).Telegram?.WebApp;
    setIsTelegramEnvironment(!!isTelegram);

    if (isTelegram) {
      // Initialize Telegram Web App
      WebApp.ready();
      WebApp.expand();

      // Set theme
      WebApp.setHeaderColor("#000000");
      WebApp.setBackgroundColor("#000000");

      // Get user data
      const initDataUnsafe = WebApp.initDataUnsafe;
      if (initDataUnsafe?.user) {
        setUser(initDataUnsafe.user as TelegramUser);
      }

      setIsReady(true);

      // Enable closing confirmation
      WebApp.enableClosingConfirmation();
    } else {
      // Not in Telegram, still mark as ready for web version
      setIsReady(true);
    }
  }, []);

  const expand = () => {
    if (isTelegramEnvironment) {
      WebApp.expand();
    }
  };

  const close = () => {
    if (isTelegramEnvironment) {
      WebApp.close();
    }
  };

  const showMainButton = (text: string, onClick: () => void) => {
    if (isTelegramEnvironment) {
      WebApp.MainButton.setText(text);
      WebApp.MainButton.show();
      WebApp.MainButton.onClick(onClick);
    }
  };

  const hideMainButton = () => {
    if (isTelegramEnvironment) {
      WebApp.MainButton.hide();
    }
  };

  const showAlert = (message: string) => {
    if (isTelegramEnvironment) {
      WebApp.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = async (message: string): Promise<boolean> => {
    if (isTelegramEnvironment) {
      return new Promise((resolve) => {
        WebApp.showConfirm(message, resolve);
      });
    } else {
      return Promise.resolve(confirm(message));
    }
  };

  const shareToStory = (mediaUrl: string, text?: string) => {
    if (isTelegramEnvironment && WebApp.shareToStory) {
      WebApp.shareToStory(mediaUrl, { text });
    }
  };

  const openTelegramLink = (url: string) => {
    if (isTelegramEnvironment) {
      WebApp.openTelegramLink(url);
    } else {
      window.open(url, "_blank");
    }
  };

  const openLink = (url: string) => {
    if (isTelegramEnvironment) {
      WebApp.openLink(url);
    } else {
      window.open(url, "_blank");
    }
  };

  const value: TelegramContextType = {
    webApp: isTelegramEnvironment ? WebApp : null,
    user,
    isReady,
    isTelegramEnvironment,
    expand,
    close,
    showMainButton,
    hideMainButton,
    showAlert,
    showConfirm,
    shareToStory,
    openTelegramLink,
    openLink,
  };

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>;
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error("useTelegram must be used within a TelegramProvider");
  }
  return context;
}
