import { Difficulty, TopicStatus, ExtractionStatus } from "./index";

export const EXTRACTION_STATUS_CONFIG: Record<
  ExtractionStatus,
  { label: string; color: "cyan" | "gold" | "rose" | "slate" }
> = {
  processing: { label: "Processing", color: "cyan" },
  ready: { label: "Ready", color: "gold" },
  error: { label: "Error", color: "rose" },
  "low-text": { label: "Low Text", color: "slate" },
};

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; color: "cyan" | "gold" | "rose" | "slate" | "violet"; xpMultiplier: number }
> = {
  novice: { label: "Novice", color: "cyan", xpMultiplier: 1.0 },
  apprentice: { label: "Apprentice", color: "gold", xpMultiplier: 1.25 },
  adept: { label: "Adept", color: "violet", xpMultiplier: 1.5 },
  master: { label: "Master", color: "rose", xpMultiplier: 2.0 },
};

export const STATUS_CONFIG: Record<
  TopicStatus,
  { label: string; color: "cyan" | "gold" | "rose" | "slate" | "violet" }
> = {
  locked: { label: "Locked", color: "slate" },
  available: { label: "Available", color: "cyan" },
  "in-progress": { label: "In Progress", color: "gold" },
  completed: { label: "Mastered", color: "violet" },
};

export const RANKS = [
  { level: 1, title: "Apprentice Scholar", icon: "BookOpen" },
  { level: 3, title: "Archive Scout", icon: "Compass" },
  { level: 5, title: "Rune Adept", icon: "Sparkles" },
  { level: 8, title: "Knowledge Knight", icon: "Shield" },
  { level: 12, title: "Grand Sage", icon: "Crown" },
] as const;

export const MAX_UPLOAD_FILE_SIZE_MB = 25;
