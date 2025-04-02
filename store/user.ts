import { create } from "zustand";

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
  updateGameProfile: (updates: Partial<GameProfileState>) => void; // General update
  incrementQuantumChessWin: (totalGamesIncrement?: number) => void; // Optionally increment total games too
  incrementPuzzlesSolved: (isPerfect?: boolean) => void;
  updateRankAndXp: (rank: string, xp: number) => void;
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

export const useAppStore = create<AppStoreState & AppStoreActions>((set) => ({
  user: null,
  gameProfile: null,
  isLoading: false, // Start as not loading

  setLoading: (loading) => set({ isLoading: loading }),

  setUser: (user) => {
    const userWithDates = {
      ...user,
      emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
    };
    set({ user: userWithDates, isLoading: false });
  },
  clearUser: () => set({ user: null }),
  updateUserName: (name) =>
    set((state) => ({
      user: state.user ? { ...state.user, name: name } : null,
    })),
  updateUserImage: (imageUrl) =>
    set((state) => ({
      user: state.user ? { ...state.user, image: imageUrl } : null,
    })),

  // --- Game Profile Actions ---
  setGameProfile: (profile) => {
    // Convert string dates from DB to Date objects if necessary when setting
    const profileWithDates = {
      ...profile,
      createdAt: new Date(profile.createdAt),
      updatedAt: new Date(profile.updatedAt),
    };
    set({ gameProfile: profileWithDates, isLoading: false });
  },
  clearGameProfile: () => set({ gameProfile: null }),

  // General update function for flexibility
  updateGameProfile: (updates) =>
    set((state) => ({
      gameProfile: state.gameProfile
        ? { ...state.gameProfile, ...updates, updatedAt: new Date() } // Update updatedAt timestamp
        : null,
    })),

  incrementQuantumChessWin: (totalGamesIncrement = 1) =>
    set((state) => {
      if (!state.gameProfile) return {}; // No change if profile doesn't exist
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
      return {
        gameProfile: {
          ...state.gameProfile,
          currentRank: rank,
          xp: xp,
          updatedAt: new Date(),
        },
      };
    }),

  updateProgress: (progress) =>
    set((state) => {
      if (!state.gameProfile) return {};
      const currentProfile = state.gameProfile;
      return {
        gameProfile: {
          ...currentProfile,
          quantumChessSkillsProgress:
            progress.quantumChessSkills ??
            currentProfile.quantumChessSkillsProgress,
          puzzleSolvingProgress:
            progress.puzzleSolving ?? currentProfile.puzzleSolvingProgress,
          learningProgress:
            progress.learning ?? currentProfile.learningProgress,
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
          // Optionally update total games if a loss implies a game played
          // quantumChessTotalGames: state.gameProfile.quantumChessTotalGames + 1,
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

  // --- Combined Actions ---
  setUserAndProfile: (user, profile) => {
    // Convert dates similarly to individual setters
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
}));
