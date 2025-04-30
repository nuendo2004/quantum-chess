"use client";

export function RewardGate({ children }: { children: ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const initialBalance = useRef<number | null>(null);
  const [rewardAmount, setRewardAmount] = useState(0);
  const { user, gameProfile } = useUserStore((state) => state);

  useEffect(() => {
    if (!user || !gameProfile) return;
    const balance = gameProfile.inGameToken;
    if (initialBalance.current === null) {
      initialBalance.current = balance;
      return;
    }
    if (balance > initialBalance.current) {
      setRewardAmount(balance - initialBalance.current);
      setShowModal(true);
      initialBalance.current = balance;
    }
  }, [gameProfile, user]);

  return (
    <>
      {children}
      <RewardModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        rewardAmount={rewardAmount}
      />
    </>
  );
}

import { ReactNode, useEffect, useRef, useState } from "react";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreInitializer from "@/components/StoreStoreInitializer";
import RewardModal from "@/components/RewardModal";
import { useUserStore } from "@/store/user";
export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Navbar />
      <StoreInitializer />
      <RewardGate>{children}</RewardGate>
      <Footer />
    </SessionProvider>
  );
}
