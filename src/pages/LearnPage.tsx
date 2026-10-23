import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Sparkles,
  Coins,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { demoTopics } from "@/data/demoData";
import type { Topic, Lesson } from "@/types";

export function LearnPage({ initialTopicId }: { initialTopicId?: string }) {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(
    demoTopics.find((t) => t.id === initialTopicId) || demoTopics[0]
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const activeQuestion = selectedLesson?.questions[0];

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setSelectedLesson(null);
    setHasSubmitted(false);
    setSelectedAnswer(null);
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setSelectedAnswer(null);
    setHasSubmitted(false);
  };

  const handleSubmitQuiz = () => {
    if (selectedAnswer === null || !activeQuestion) return;
    setHasSubmitted(true);
    if (selectedAnswer === activeQuestion.correctIndex) {
      setQuizScore((prev) => prev + 1);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="Quests & Lessons"
        subtitle="Embark on focused study quests. Answer checkpoint trials to earn XP and Gold."
        icon={<BookOpen className="h-6 w-6" />}
      />

      {!selectedLesson ? (
        /* Topic Overview & Lesson List */
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Topic selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Select Quest Line
            </h3>
            {demoTopics.map((topic) => {
              const isSelected = topic.id === selectedTopic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? "border-violet-500 bg-midnight-800/80 shadow-glow"
                      : "border-midnight-700/50 bg-midnight-800/40 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge color="violet">{topic.category}</Badge>
                    <span className="text-xs text-slate-500">{topic.estimatedMinutes}m</span>
                  </div>
                  <h4 className="mt-2 text-base font-bold text-white">{topic.title}</h4>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {topic.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Lessons in Selected Topic */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-midnight-700/50 bg-midnight-800/60 p-6 backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div>
                  <Badge color="gold" className="mb-2">
                    {selectedTopic.difficulty.toUpperCase()} QUEST
                  </Badge>
                  <h3 className="text-xl font-bold text-white font-fantasy">
                    {selectedTopic.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">{selectedTopic.description}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Topic Trials ({selectedTopic.lessons.length} Lessons)
                </h4>

                {selectedTopic.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-midnight-700/40 bg-midnight-900/60 hover:border-violet-500/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-midnight-800 font-bold text-xs text-violet-300 border border-midnight-700">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-slate-200">
                          {lesson.title}
                        </h5>
                        <span className="text-xs text-slate-500">
                          {lesson.questions.length} trial question
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStartLesson(lesson)}
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      Begin
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Active Lesson & Quiz Trial */
        <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedLesson(null)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Lessons
          </Button>

          <div className="rounded-2xl border border-midnight-700/50 bg-midnight-800/60 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4 border-b border-midnight-700/40 pb-4">
              <div>
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
                  {selectedTopic.title}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-fantasy mt-0.5">
                  {selectedLesson.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge color="cyan">+50 XP</Badge>
                <Badge color="gold">+20 Gold</Badge>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed mb-8">
              <p className="bg-midnight-900/60 p-4 rounded-xl border border-midnight-700/50">
                {selectedLesson.content}
              </p>
            </div>

            {/* Quiz Trial Section */}
            {activeQuestion && (
              <div className="border-t border-midnight-700/40 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  <h3 className="text-base font-semibold text-white">
                    Knowledge Trial Checkpoint
                  </h3>
                </div>

                <p className="text-sm font-medium text-slate-200 mb-4">
                  {activeQuestion.prompt}
                </p>

                <div className="space-y-2.5">
                  {activeQuestion.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === activeQuestion.correctIndex;

                    let optionStyle =
                      "border-midnight-700/50 bg-midnight-900/60 hover:border-slate-500 text-slate-300";
                    if (hasSubmitted) {
                      if (isCorrect) {
                        optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-200";
                      } else if (isSelected) {
                        optionStyle = "border-rose-500 bg-rose-500/10 text-rose-200";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-violet-500 bg-violet-500/10 text-violet-200";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasSubmitted}
                        onClick={() => setSelectedAnswer(idx)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm text-left transition-all ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {hasSubmitted && isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        )}
                        {hasSubmitted && isSelected && !isCorrect && (
                          <XCircle className="h-4 w-4 text-rose-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {hasSubmitted && (
                  <div
                    className={`mt-4 p-4 rounded-xl border ${
                      selectedAnswer === activeQuestion.correctIndex
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-200"
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1">
                      {selectedAnswer === activeQuestion.correctIndex
                        ? "✨ Brilliant! Correct Answer!"
                        : "❌ Not quite right."}
                    </p>
                    <p className="text-xs opacity-90">{activeQuestion.explanation}</p>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  {hasSubmitted ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setHasSubmitted(false);
                        setSelectedAnswer(null);
                      }}
                      leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                    >
                      Retry Trial
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={selectedAnswer === null}
                      onClick={handleSubmitQuiz}
                    >
                      Submit Answer
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLesson(null)}
                  >
                    Finish Lesson
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
