"use client";

import UserProfileHeader from "./UserProfileHeader";
import Achievement from "./Achievement";
import Progress from "./Progress";
import GameStats from "./GameStats";
import GameFooter from "../../components/Footer";
import { useUserProfileResult } from "./useUserProfile";

type ProfileContentProps = Pick<
  useUserProfileResult,
  | "user"
  | "gameProfile"
  | "editMode"
  | "tempName"
  | "handleNameChange"
  | "handleEditToggle"
  | "handleCancelEdit"
  | "handleSaveProfile"
>;

export default function ProfileContent({
  user,
  gameProfile,
  editMode,
  tempName,
  handleNameChange,
  handleEditToggle,
  handleCancelEdit,
  handleSaveProfile,
}: ProfileContentProps) {
  if (!user) {
    return (
      <div
        className="min-h-screen flex justify-center items-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800"
        data-testid="profile-load-failure"
      >
        <p className="text-xl dark:text-white">Could not load user profile.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex flex-col"
      data-testid="profile-content-wrapper"
    >
      <main
        className="container mx-auto px-6 py-12 flex-grow"
        data-testid="profile-main-content"
      >
        <UserProfileHeader
          user={user}
          editMode={editMode}
          tempName={tempName}
          onNameChange={handleNameChange}
          onSave={handleSaveProfile}
          onEditToggle={handleEditToggle}
          onCancelEdit={handleCancelEdit}
        />

        <Achievement
          gameProfile={gameProfile}
          data-testid="achievement-section"
        />
        <Progress gameProfile={gameProfile} data-testid="progress-section" />
        <GameStats gameProfile={gameProfile} data-testid="gamestats-section" />
      </main>
      <GameFooter data-testid="game-footer" />
    </div>
  );
}
