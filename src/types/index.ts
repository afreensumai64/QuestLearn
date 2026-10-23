export type Difficulty = "novice" | "apprentice" | "adept" | "master";

export type TopicStatus = "locked" | "available" | "in-progress" | "completed";

export interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  icon: string;
  category: string;
  estimatedMinutes: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  topicId: string;
  order: number;
  title: string;
  content: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  lessonId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserProgress {
  topicId: string;
  status: TopicStatus;
  completedLessons: string[];
  score: number;
  lastAccessedAt: string;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  streak: number;
  topicsCompleted: number;
  lessonsCompleted: number;
  rankTitle: string;
}

export interface KingdomRegion {
  id: string;
  name: string;
  description: string;
  topicIds: string[];
  unlockLevel: number;
  color: string;
}

export type ExtractionStatus = "processing" | "ready" | "error" | "low-text";

export interface LibraryItem {
  id: string;
  title: string;
  type: "pdf" | "text" | "ai-generated";
  uploadedAt: string;
  content: string;
  status: ExtractionStatus;
  errorMessage?: string;
  // PDF-specific metadata
  fileSize?: number;
  pageCount?: number;
  textPreview?: string;
  extractionStatus?: ExtractionStatus;
}

export interface AIStudyRequest {
  topicId: string;
  lessonId: string;
  userQuestion: string;
}

export interface AIStudyResponse {
  answer: string;
  relatedTopics: string[];
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export type ConnectionState = "idle" | "loading" | "success" | "error";
