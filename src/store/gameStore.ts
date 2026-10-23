import { create } from "zustand";
import type { LibraryItem, UserStats } from "@/types";
import { demoUserStats } from "@/data/demoData";

export interface BattleQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Boss {
  name: string;
  title: string;
  maxHp: number;
  avatar: string;
  color: string;
}

interface GameStore {
  stats: UserStats;
  isBattleActive: boolean;
  battleDoc: LibraryItem | null;
  startBattle: (doc: LibraryItem) => void;
  closeBattle: () => void;
  awardRewards: (xp: number, gold: number) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  stats: { ...demoUserStats },
  isBattleActive: false,
  battleDoc: null,

  startBattle: (doc) =>
    set({
      isBattleActive: true,
      battleDoc: doc,
    }),

  closeBattle: () =>
    set({
      isBattleActive: false,
      battleDoc: null,
    }),

  awardRewards: (xpEarned, goldEarned) =>
    set((state) => {
      let newXp = state.stats.xp + xpEarned;
      let newLevel = state.stats.level;
      let xpToNext = state.stats.xpToNextLevel;

      while (newXp >= xpToNext) {
        newXp -= xpToNext;
        newLevel += 1;
        xpToNext = Math.round(xpToNext * 1.3);
      }

      return {
        stats: {
          ...state.stats,
          level: newLevel,
          xp: newXp,
          xpToNextLevel: xpToNext,
          gold: state.stats.gold + goldEarned,
          lessonsCompleted: state.stats.lessonsCompleted + 1,
        },
      };
    }),
}));
