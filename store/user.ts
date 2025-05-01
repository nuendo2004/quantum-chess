import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  dateCreated: string;
}

interface GameProfileState {
  id: string;
  userId: string;
  quantumChessWins: number;
  puzzlesSolved: number;
  achievementsUnlocked: number;
  currentRank: string;
  xp: number;
  quantumChessSkillsProgress: number;
  puzzleSolvingProgress: number;
  learningProgress: number;
  quantumChessTotalGames: number;
  quantumChessCurrentStreak: number;
  puzzleAverageTimeSeconds: number | null;
  puzzlePerfectSolutions: number;
  inGameToken: number;
  lastLoggedIn: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AppStoreState {
  user: UserState | null;
  gameProfile: GameProfileState | null;
  isLoading: boolean;
}

interface AppStoreActions {
  setUser: (user: UserState) => void;
  clearUser: () => void;
  updateUserName: (name: string) => void;
  updateUserImage: (imageUrl: string) => void;

  setGameProfile: (profile: GameProfileState) => void;
  clearGameProfile: () => void;
  updateGameProfile: (updates: Partial<GameProfileState>) => void;
  incrementQuantumChessWin: (totalGamesIncrement?: number) => void;
  incrementPuzzlesSolved: (isPerfect?: boolean) => void;
  updateRankAndXp: (rank: string | null, xp: number) => void;
  updateProgress: (progress: {
    quantumChessSkills?: number;
    puzzleSolving?: number;
    learning?: number;
  }) => void;
  resetQuantumChessStreak: () => void;
  updatePuzzleAverageTime: (newAverage: number) => void;

  setUserAndProfile: (
    user: UserState,
    profile: GameProfileState | null
  ) => void;
  clearUserAndProfile: () => void;

  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<AppStoreState & AppStoreActions>()(
  persist(
    (set) => ({
      user: null,
      gameProfile: null,
      isLoading: false,

      setLoading: (loading) => set({ isLoading: loading }),

      updateGameProfile: async (updates) => {
        const res = await fetch("/api/gameProfile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update gameProfile");
        const { gameProfile } = await res.json();
        set({ gameProfile });
      },

      setUser: (user) => {
        const userWithDates = {
          ...user,
          emailVerified: user.emailVerified
            ? new Date(user.emailVerified)
            : null,
        };
        set({ user: userWithDates, isLoading: false });
      },
      clearUser: () => set({ user: null }),
      updateUserName: (name) =>
        set((state) => ({
          user: state.user ? { ...state.user, name } : null,
        })),
      updateUserImage: (imageUrl) =>
        set((state) => ({
          user: state.user ? { ...state.user, image: imageUrl } : null,
        })),

      setGameProfile: (profile) => {
        const profileWithDates = {
          ...profile,
          createdAt: new Date(profile.createdAt),
          updatedAt: new Date(profile.updatedAt),
        };
        set({ gameProfile: profileWithDates, isLoading: false });
      },
      clearGameProfile: () => set({ gameProfile: null }),

      // updateGameProfile: (updates) =>
      //   set((state) => ({
      //     gameProfile: state.gameProfile
      //       ? { ...state.gameProfile, ...updates, updatedAt: new Date() }
      //       : null,
      //   })),

      incrementQuantumChessWin: (totalGamesIncrement = 1) =>
        set((state) => {
          if (!state.gameProfile) return {};
          return {
            gameProfile: {
              ...state.gameProfile,
              quantumChessWins: state.gameProfile.quantumChessWins + 1,
              quantumChessTotalGames:
                state.gameProfile.quantumChessTotalGames + totalGamesIncrement,
              quantumChessCurrentStreak:
                state.gameProfile.quantumChessCurrentStreak + 1,
              updatedAt: new Date(),
            },
          };
        }),

      incrementPuzzlesSolved: (isPerfect = false) =>
        set((state) => {
          if (!state.gameProfile) return {};
          return {
            gameProfile: {
              ...state.gameProfile,
              puzzlesSolved: state.gameProfile.puzzlesSolved + 1,
              puzzlePerfectSolutions:
                state.gameProfile.puzzlePerfectSolutions + (isPerfect ? 1 : 0),
              updatedAt: new Date(),
            },
          };
        }),

      updateRankAndXp: (rank, xp) =>
        set((state) => {
          if (!state.gameProfile) return {};
          state.updateGameProfile({
            currentRank: rank || state.gameProfile.currentRank,
            xp,
          });
          return {
            gameProfile: {
              ...state.gameProfile,
              currentRank: rank || state.gameProfile.currentRank,
              xp,
              updatedAt: new Date(),
            },
          };
        }),

      updateProgress: (progress) =>
        set((state) => {
          if (!state.gameProfile) return {};
          const cp = state.gameProfile;
          return {
            gameProfile: {
              ...cp,
              quantumChessSkillsProgress:
                progress.quantumChessSkills ||
                0 + cp.quantumChessSkillsProgress,
              puzzleSolvingProgress:
                progress.puzzleSolving || 0 + cp.puzzleSolvingProgress,
              learningProgress: progress.learning || 0 + cp.learningProgress,
              updatedAt: new Date(),
            },
          };
        }),

      resetQuantumChessStreak: () =>
        set((state) => {
          if (!state.gameProfile) return {};
          return {
            gameProfile: {
              ...state.gameProfile,
              quantumChessCurrentStreak: 0,
              updatedAt: new Date(),
            },
          };
        }),

      updatePuzzleAverageTime: (newAverage) =>
        set((state) => {
          if (!state.gameProfile) return {};
          return {
            gameProfile: {
              ...state.gameProfile,
              puzzleAverageTimeSeconds: newAverage,
              updatedAt: new Date(),
            },
          };
        }),

      setUserAndProfile: (user, profile) => {
        const userWithDates = user
          ? {
              ...user,
              emailVerified: user.emailVerified
                ? new Date(user.emailVerified)
                : null,
            }
          : null;
        const profileWithDates = profile
          ? {
              ...profile,
              createdAt: new Date(profile.createdAt),
              updatedAt: new Date(profile.updatedAt),
            }
          : null;
        set({
          user: userWithDates,
          gameProfile: profileWithDates,
          isLoading: false,
        });
      },

      clearUserAndProfile: () =>
        set({ user: null, gameProfile: null, isLoading: false }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        gameProfile: state.gameProfile,
      }),
    }
  )
);
