import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { User, GameProfile } from "@prisma/client";

export interface useUserProfileResult {
  user: User | null;
  gameProfile: GameProfile | null;
  isLoading: boolean;
  error: string | null;
  editMode: boolean;
  tempName: string;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditToggle: () => void;
  handleCancelEdit: () => void;
  handleSaveProfile: () => Promise<void>;
  isAuthenticated: boolean;
  status: "loading" | "authenticated" | "unauthenticated";
}

export function useUserProfile(): useUserProfileResult {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [gameProfile, setGameProfile] = useState<GameProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [tempName, setTempName] = useState("");

  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setIsLoading(true);
      setError(null);

      fetch("/api/user")
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(
              errorData.message || `HTTP error! status: ${res.status}`
            );
          }
          return res.json();
        })
        .then((data) => {
          if (!data.user) {
            throw new Error("User data not found in response.");
          }
          setUser(data.user);
          setGameProfile(data.gameProfile);
          setTempName(data.user.name || "");
        })
        .catch((err) => {
          console.error("Failed to fetch profile data:", err);
          setError(err.message || "Failed to load profile data.");
          setUser(null);
          setGameProfile(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (status === "unauthenticated") {
      setIsLoading(false);
      setError("Please log in to view your profile.");
      setUser(null);
      setGameProfile(null);
    } else {
      setIsLoading(true);
    }
  }, [status, session?.user]);

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTempName(event.target.value);
    },
    []
  );

  const handleEditToggle = useCallback(() => {
    setEditMode(true);
    setTempName(user?.name || "");
  }, [user?.name]);

  const handleCancelEdit = useCallback(() => {
    setEditMode(false);
    setTempName(user?.name || "");
  }, [user?.name]);

  const handleSaveProfile = useCallback(async () => {
    if (!user || tempName === user.name) {
      setEditMode(false);
      return;
    }

    try {
      const response = await fetch("/api/profile/update-name", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: tempName }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Revert optimistic update on failure
        // setTempName(user.name || "");
        // setUser(prev => prev ? { ...prev, name: user.name } : null);
        throw new Error(
          errorData.message ||
            `Failed to update profile. Status: ${response.status}`
        );
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setEditMode(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      setError(err.message || "Could not save profile changes.");
      setTempName(user.name || "");
      setEditMode(true);
    }
  }, [user, tempName]);

  return {
    user,
    gameProfile,
    isLoading: isLoading || status === "loading",
    error,
    editMode,
    tempName,
    handleNameChange,
    handleEditToggle,
    handleCancelEdit,
    handleSaveProfile,
    isAuthenticated,
    status,
  };
}
