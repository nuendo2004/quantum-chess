"use client";
import dynamic from "next/dynamic";

const QuantumChessGame = dynamic(() => import("./QuantumChessGame"), {
  ssr: false,
});

export default function Home() {
  return <QuantumChessGame />;
}
