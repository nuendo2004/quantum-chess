"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useAppStore } from "../store/user";

function StoreInitializer() {
  const { data: session, status } = useSession();
  const setLoading = useAppStore((state) => state.setLoading);
  const setUserAndProfile = useAppStore((state) => state.setUserAndProfile);
  const clearUserAndProfile = useAppStore((state) => state.clearUserAndProfile);
  const zustandUser = useAppStore((state) => state.user);

  const fetchedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const syncStore = async () => {
      if (status === "loading") {
        return;
      }

      if (status === "unauthenticated") {
        if (zustandUser) {
          console.log("User unauthenticated, clearing store.");
          clearUserAndProfile();
        }
        fetchedUserIdRef.current = null;
        return;
      }

      if (status === "authenticated" && session?.user?.id) {
        const currentUserId = session.user.id;

        if (fetchedUserIdRef.current === currentUserId) {
          return;
        }

        console.log(
          `User authenticated (${currentUserId}). Fetching profile...`
        );
        setLoading(true);
        fetchedUserIdRef.current = null;

        try {
          const response = await fetch("/api/user");

          if (!response.ok) {
            if (response.status === 404) {
              console.warn("User found but game profile doesn't exist yet.");
            } else {
              throw new Error(
                `API Error: ${response.status} ${response.statusText}`
              );
            }
            clearUserAndProfile();
          } else {
            const data = await response.json();
            if (data.user) {
              console.log("Profile data fetched successfully. Updating store.");
              setUserAndProfile(data.user, data.gameProfile);
              fetchedUserIdRef.current = currentUserId;
            } else {
              console.error("API Error: Fetched data is missing user object.");
              clearUserAndProfile();
            }
          }
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
          clearUserAndProfile();
        } finally {
        }
      }
    };

    syncStore();
  }, [
    status,
    session?.user?.id,
    setLoading,
    setUserAndProfile,
    clearUserAndProfile,
    zustandUser,
  ]);

  return null;
}

export default StoreInitializer;
