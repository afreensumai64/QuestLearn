import type { UserStats, KingdomRegion, Topic } from "@/types";

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  topicsCount: number;
  progressPercent: number;
  description: string;
}

export interface ContinueLearningData {
  topicId: string;
  topicTitle: string;
  lessonId: string;
  lessonTitle: string;
  progressPercent: number;
  remainingMinutes: number;
  category: string;
}

export interface StreakDay {
  day: string;
  active: boolean;
  date?: string;
}

export interface RecommendedLessonData {
  topicTitle: string;
  lessonTitle: string;
  xpReward: number;
  goldReward: number;
  difficulty: "novice" | "apprentice" | "adept" | "master";
  estimatedMinutes: number;
  description: string;
}

export const demoUserStats: UserStats = {
  level: 7,
  xp: 2850,
  xpToNextLevel: 4000,
  gold: 620,
  streak: 14,
  topicsCompleted: 9,
  lessonsCompleted: 34,
  rankTitle: "Rune Adept",
};

export const demoStreakDays: StreakDay[] = [
  { day: "Mon", active: true },
  { day: "Tue", active: true },
  { day: "Wed", active: true },
  { day: "Thu", active: true },
  { day: "Fri", active: true },
  { day: "Sat", active: true },
  { day: "Sun", active: true },
];

export const demoContinueLearning: ContinueLearningData = {
  topicId: "data-structures",
  topicTitle: "Data Structures & Arcane Trees",
  lessonId: "binary-search-trees",
  lessonTitle: "Binary Search Trees & Balancing",
  progressPercent: 68,
  remainingMinutes: 12,
  category: "Computer Science",
};

export const demoRecommendedLesson: RecommendedLessonData = {
  topicTitle: "Artificial Intelligence",
  lessonTitle: "Neural Networks & Backpropagation",
  xpReward: 150,
  goldReward: 45,
  difficulty: "adept",
  estimatedMinutes: 18,
  description: "Unravel the gradients that power deep learning models through interactive rune calculations.",
};

export const demoSubjects: Subject[] = [
  {
    id: "cs",
    name: "Computer Science",
    icon: "Binary",
    color: "violet",
    topicsCount: 16,
    progressPercent: 72,
    description: "Algorithms, system design, and software craftsmanship.",
  },
  {
    id: "ai",
    name: "AI & Machine Learning",
    icon: "Brain",
    color: "cyan",
    topicsCount: 12,
    progressPercent: 45,
    description: "Neural architectures, optimization, and generative agents.",
  },
  {
    id: "math",
    name: "Applied Mathematics",
    icon: "Sigma",
    color: "gold",
    topicsCount: 10,
    progressPercent: 30,
    description: "Discrete math, linear algebra, and probability theory.",
  },
  {
    id: "physics",
    name: "Quantum Physics",
    icon: "Atom",
    color: "rose",
    topicsCount: 8,
    progressPercent: 15,
    description: "Wave-particle duality, state vectors, and entanglement.",
  },
];

export const demoRegions: KingdomRegion[] = [
  {
    id: "citadel-code",
    name: "Citadel of Code",
    description: "Towering spires where algorithms and foundational data architectures reside.",
    topicIds: ["data-structures", "algo-sorting", "system-design"],
    unlockLevel: 1,
    color: "violet",
  },
  {
    id: "peaks-of-perception",
    name: "Peaks of Perception",
    description: "High mountain sanctum of artificial intelligence, vision, and neural reasoning.",
    topicIds: ["neural-nets", "computer-vision", "nlp-foundations"],
    unlockLevel: 4,
    color: "cyan",
  },
  {
    id: "quantum-reach",
    name: "Quantum Reach",
    description: "Mysterious archipelago where probabilities intertwine and physical laws bend.",
    topicIds: ["quantum-gates", "linear-algebra"],
    unlockLevel: 8,
    color: "gold",
  },
  {
    id: "void-of-cryptography",
    name: "Void of Cryptography",
    description: "Deep subterranean vaults safeguarded by zero-knowledge proofs and prime factor shields.",
    topicIds: ["zk-proofs", "elliptic-curves"],
    unlockLevel: 12,
    color: "rose",
  },
];

export const demoTopics: Topic[] = [
  {
    id: "data-structures",
    title: "Data Structures & Arcane Trees",
    description: "Master tree traversals, AVL self-balancing, and hash tables for O(1) recall.",
    difficulty: "apprentice",
    icon: "FolderTree",
    category: "Computer Science",
    estimatedMinutes: 25,
    lessons: [
      {
        id: "trees-intro",
        topicId: "data-structures",
        order: 1,
        title: "Introduction to Tree Nodes",
        content: "Trees are hierarchical collections of nodes connected by edges, root to leaves.",
        questions: [
          {
            id: "q1",
            lessonId: "trees-intro",
            prompt: "What is the maximum number of children for a node in a Binary Tree?",
            options: ["1", "2", "Unlimited", "3"],
            correctIndex: 1,
            explanation: "A binary tree node can have at most two children: left and right.",
          },
        ],
      },
      {
        id: "binary-search-trees",
        topicId: "data-structures",
        order: 2,
        title: "Binary Search Trees & Balancing",
        content: "BST enforces that left child < parent and right child > parent, enabling fast lookup.",
        questions: [
          {
            id: "q2",
            lessonId: "binary-search-trees",
            prompt: "What is the average time complexity for searching in a balanced BST?",
            options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
            correctIndex: 2,
            explanation: "Each step cuts the remaining search space in half, resulting in logarithmic time.",
          },
        ],
      },
    ],
  },
  {
    id: "neural-nets",
    title: "Neural Architectures & Gradients",
    description: "Demystify perceptrons, activation functions, and gradient descent backprop.",
    difficulty: "adept",
    icon: "BrainCircuit",
    category: "AI & Machine Learning",
    estimatedMinutes: 30,
    lessons: [
      {
        id: "gradient-descent",
        topicId: "neural-nets",
        order: 1,
        title: "Gradient Descent Optimization",
        content: "Gradient descent moves model weights in the opposite direction of the loss function gradient.",
        questions: [
          {
            id: "q3",
            lessonId: "gradient-descent",
            prompt: "What hyperparameter controls the step size during weight updates?",
            options: ["Batch Size", "Learning Rate", "Epoch Count", "Weight Decay"],
            correctIndex: 1,
            explanation: "The learning rate scales the gradient to adjust how big of a step weights take.",
          },
        ],
      },
    ],
  },
];
