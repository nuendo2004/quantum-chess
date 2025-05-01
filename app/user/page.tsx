"use client";

import { useUserProfile } from "./useUserProfile";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorDisplay from "@/components/ErrorDisplay";
import ProfileContent from "./ProfileContent";

export default function ProfilePage() {
  const {
    user,
    gameProfile,
    isLoading,
    error,
    editMode,
    tempName,
    handleNameChange,
    handleEditToggle,
    handleCancelEdit,
    handleSaveProfile,
    status,
  } = useUserProfile();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!user && status === "unauthenticated") {
    return <ErrorDisplay error="Please log in to view your profile." />;
  }
  return (
    <ProfileContent
      user={user}
      gameProfile={gameProfile}
      editMode={editMode}
      tempName={tempName}
      handleNameChange={handleNameChange}
      handleEditToggle={handleEditToggle}
      handleCancelEdit={handleCancelEdit}
      handleSaveProfile={handleSaveProfile}
    />
  );
}
