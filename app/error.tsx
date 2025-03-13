"use client";

import React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Something went wrong 😢</h1>
      <p>{error.message}</p>
      <button
        onClick={reset}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        Try Again
      </button>
    </div>
  );
}
