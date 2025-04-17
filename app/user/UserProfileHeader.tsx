"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  PencilIcon,
  ShieldCheckIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { User } from "@prisma/client";

interface UserProfileHeaderProps {
  user: User;
  editMode: boolean;
  tempName: string;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onEditToggle: () => void;
  onCancelEdit: () => void;
}

export default function UserProfileHeader({
  user,
  editMode,
  tempName,
  onNameChange,
  onSave,
  onEditToggle,
  onCancelEdit,
}: UserProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8"
      data-testid="user-profile-header"
    >
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="relative group">
          <Image
            src={user.image || "/default-avatar.png"}
            className="w-32 h-32 rounded-full border-4 border-purple-200 dark:border-purple-900 object-cover"
            alt="User avatar"
            width={128}
            height={128}
            priority
            onError={(e) => {
              e.currentTarget.src = "/default-avatar.png";
            }}
            data-testid="user-avatar"
          />
          <button
            title="Change Avatar (Not Implemented)"
            className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-colors cursor-not-allowed opacity-50"
            disabled
            data-testid="change-avatar-button"
          >
            <PencilIcon className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            {editMode ? (
              <input
                type="text"
                value={tempName}
                onChange={onNameChange}
                className="text-3xl font-bold bg-transparent border-b-2 border-purple-600 dark:text-white dark:border-purple-400 focus:outline-none focus:ring-0 flex-grow min-w-[150px]"
                aria-label="Edit user name"
                autoFocus
                data-testid="user-name-input"
              />
            ) : (
              <h1
                className="text-3xl font-bold dark:text-white mr-auto"
                data-testid="user-name-display"
              >
                {user.name || "Unnamed User"}
              </h1>
            )}
            <div className="flex gap-2 items-center flex-shrink-0">
              <button
                onClick={editMode ? onSave : onEditToggle}
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium whitespace-nowrap px-3 py-1 rounded border border-purple-600 dark:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  editMode && (tempName.trim() === "" || tempName === user.name)
                }
                data-testid={editMode ? "save-name-button" : "edit-name-button"}
              >
                {editMode ? "Save Changes" : "Edit Name"}
              </button>
              {editMode && (
                <button
                  onClick={onCancelEdit}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium ml-2 px-3 py-1 rounded border border-gray-400 dark:border-gray-500"
                  data-testid="cancel-edit-name-button"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 flex-shrink-0" />
              <span data-testid="user-email">
                {user.email || "No email set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrophyIcon className="h-5 w-5 flex-shrink-0" />
              <span data-testid="user-member-since">
                Member since{" "}
                {user.dateCreated && user.dateCreated !== "unknown"
                  ? new Date(user.dateCreated).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
