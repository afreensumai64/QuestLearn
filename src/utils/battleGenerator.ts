import type { LibraryItem } from "@/types";
import type { BattleQuestion, Boss } from "@/store/gameStore";

const BOSS_TEMPLATES: Array<Omit<Boss, "title">> = [
  {
    name: "Ignis the Knowledge Drake",
    maxHp: 100,
    avatar: "🐲",
    color: "from-rose-500 to-amber-500",
  },
  {
    name: "Chronos the Archive Golem",
    maxHp: 100,
    avatar: "🗿",
    color: "from-amber-500 to-emerald-500",
  },
  {
    name: "Malakor the Cryptic Lich",
    maxHp: 100,
    avatar: "💀",
    color: "from-violet-600 to-indigo-600",
  },
  {
    name: "Aetheria the Rune Sovereign",
    maxHp: 100,
    avatar: "👑",
    color: "from-cyan-500 to-blue-600",
  },
];

/**
 * Creates dynamic boss fight parameters and quiz challenges from an uploaded document.
 */
export function generateBossFightFromDocument(doc: LibraryItem): {
  boss: Boss;
  questions: BattleQuestion[];
} {
  // Select boss based on document id or hash
  const bossIndex = Math.abs(doc.title.length + doc.id.length) % BOSS_TEMPLATES.length;
  const template = BOSS_TEMPLATES[bossIndex];

  const boss: Boss = {
    ...template,
    title: `Guardian of ${doc.title.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ")}`,
  };

  // Generate dynamic questions from content if available
  const content = doc.content.trim();
  const sentences = content
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30 && s.length < 180);

  const generatedQuestions: BattleQuestion[] = [];

  // If we have enough sentences, create fill-in-the-blank / concept check questions
  if (sentences.length >= 3) {
    sentences.slice(0, 4).forEach((sentence, idx) => {
      // Find prominent words (length > 5)
      const words = sentence
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 5);

      if (words.length > 0) {
        const targetWord = words[Math.floor(words.length / 2)];
        const prompt = sentence.replace(new RegExp(`\\b${targetWord}\\b`, "i"), "_______");

        // Distractor vocabulary
        const distractors = [
          "algorithmic",
          "distributed",
          "asynchronous",
          "hierarchical",
          "deterministic",
          "computational",
          "probabilistic",
          "recurrent",
        ].filter((d) => d.toLowerCase() !== targetWord.toLowerCase());

        const options = [
          targetWord,
          distractors[(idx * 2) % distractors.length],
          distractors[(idx * 2 + 1) % distractors.length],
          distractors[(idx * 2 + 2) % distractors.length],
        ];

        // Shuffle options
        const shuffled = options
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);

        const correctIndex = shuffled.indexOf(targetWord);

        generatedQuestions.push({
          id: `q-${idx}`,
          prompt: `Fill in the missing knowledge: "${prompt}"`,
          options: shuffled,
          correctIndex: Math.max(0, correctIndex),
          explanation: `Extracted from the text: "${sentence}"`,
        });
      }
    });
  }

  // If questions are fewer than 3, append curated RPG challenge questions based on document theme
  const fallbackQuestions: BattleQuestion[] = [
    {
      id: "fb-1",
      prompt: `Based on "${doc.title}", what is the primary purpose of this study document?`,
      options: [
        "To synthesize and test fundamental principles in this discipline",
        "To compile historical fiction literature",
        "To archive irrelevant legacy data logs",
        "To generate random noise patterns",
      ],
      correctIndex: 0,
      explanation: "The document encapsulates structured study material designed for core understanding.",
    },
    {
      id: "fb-2",
      prompt: "What strategy yields maximum XP and retention when studying technical materials?",
      options: [
        "Passive scanning without testing recall",
        "Active recall and immediate checkpoint trials",
        "Reading backwards once a month",
        "Skipping all core explanations",
      ],
      correctIndex: 1,
      explanation: "Active recall reinforces memory traces through neural retrieval pathways.",
    },
    {
      id: "fb-3",
      prompt: "Which component in the QuestLearn realm stores and accesses your extracted materials?",
      options: [
        "The Knowledge Library & Zustand Store",
        "The Dark Dungeon Abyss",
        "The Discard Bin",
        "The Static Vault",
      ],
      correctIndex: 0,
      explanation: "The Knowledge Library and reactive library store provide instant text access.",
    },
  ];

  const finalQuestions =
    generatedQuestions.length >= 2
      ? [...generatedQuestions, ...fallbackQuestions.slice(0, 3 - generatedQuestions.length)]
      : fallbackQuestions;

  return { boss, questions: finalQuestions };
}
