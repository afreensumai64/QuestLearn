import { useState, useEffect, useRef } from "react";
import {
  Shield,
  Zap,
  Heart,
  Swords,
  X,
  Volume2,
  VolumeX,
  Award,
  Coins,
  Sparkles,
  RotateCcw,
  Clock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/gameStore";
import { generateBossFightFromDocument } from "@/utils/battleGenerator";
import { sound } from "@/utils/soundEffects";

const ROUND_TIME_SECONDS = 18;

export function LiveArenaBattle() {
  const { isBattleActive, battleDoc, closeBattle, awardRewards, stats } = useGameStore();

  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [combo, setCombo] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_SECONDS);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [floatingText, setFloatingText] = useState<{ text: string; color: string; target: "boss" | "player" } | null>(null);
  const [bossFlinching, setBossFlinching] = useState(false);
  const [playerFlinching, setPlayerFlinching] = useState(false);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [potionUsed, setPotionUsed] = useState(false);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [shieldUsed, setShieldUsed] = useState(false);
  const [battleState, setBattleState] = useState<"fighting" | "victory" | "defeat">("fighting");

  // Generate boss and questions from active document
  const { boss, questions } = useRef(
    battleDoc
      ? generateBossFightFromDocument(battleDoc)
      : {
          boss: { name: "Ancient Archivist", title: "Guardian of the Tome", maxHp: 100, avatar: "🐲", color: "from-rose-500 to-amber-500" },
          questions: [],
        }
  ).current;

  const currentQuestion = questions[currentQIndex % (questions.length || 1)];

  // Timer countdown
  useEffect(() => {
    if (!isBattleActive || battleState !== "fighting") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleBossAttack("Time ran out! Boss struck while you were preparing!");
          return ROUND_TIME_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBattleActive, battleState, currentQIndex]);

  if (!isBattleActive || !battleDoc) return null;

  const triggerFloat = (text: string, color: string, target: "boss" | "player") => {
    setFloatingText({ text, color, target });
    setTimeout(() => setFloatingText(null), 1200);
  };

  const handleBossAttack = (reason: string) => {
    if (!isSoundMuted) sound.playHit();
    setPlayerFlinching(true);
    setTimeout(() => setPlayerFlinching(false), 400);

    if (isShieldActive) {
      setIsShieldActive(false);
      triggerFloat("BLOCKED BY SHIELD!", "text-cyan-300", "player");
      setCombatLog((prev) => [`🛡️ Your Aegis Shield absorbed the attack!`, ...prev.slice(0, 4)]);
      return;
    }

    const damage = 25;
    const newHp = Math.max(0, playerHp - damage);
    setPlayerHp(newHp);
    setCombo(1);
    triggerFloat(`-${damage} HP`, "text-rose-400 font-bold", "player");
    setCombatLog((prev) => [`⚠️ ${reason} (-${damage} HP)`, ...prev.slice(0, 4)]);

    if (newHp <= 0) {
      setBattleState("defeat");
      if (!isSoundMuted) sound.playDefeat();
    }
  };

  const handlePlayerAttack = (optionIndex: number) => {
    if (battleState !== "fighting") return;

    if (optionIndex === currentQuestion.correctIndex) {
      // Correct answer! Player attacks!
      if (!isSoundMuted) sound.playAttack();
      setBossFlinching(true);
      setTimeout(() => setBossFlinching(false), 400);

      const baseDamage = 35;
      const damage = Math.round(baseDamage * (1 + (combo - 1) * 0.25));
      const nextBossHp = Math.max(0, bossHp - damage);
      setBossHp(nextBossHp);

      const isCrit = combo >= 2;
      triggerFloat(
        isCrit ? `CRITICAL! -${damage} HP` : `-${damage} HP`,
        "text-amber-300 font-bold",
        "boss"
      );

      setCombo((prev) => prev + 1);
      setCombatLog((prev) => [
        `⚔️ Scholar casts Arcane Ray for ${damage} DMG! (Streak x${combo + 1})`,
        ...prev.slice(0, 4),
      ]);

      if (nextBossHp <= 0) {
        setBattleState("victory");
        if (!isSoundMuted) sound.playVictory();
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.5 },
        });
      } else {
        // Advance to next question
        setTimeLeft(ROUND_TIME_SECONDS);
        setEliminatedOptions([]);
        setCurrentQIndex((prev) => (prev + 1) % questions.length);
      }
    } else {
      // Wrong answer
      handleBossAttack("Miscast Rune! Boss countered your spell!");
    }
  };

  // Power-up 1: 50/50 Lightning
  const useFiftyFifty = () => {
    if (fiftyFiftyUsed || !currentQuestion) return;
    setFiftyFiftyUsed(true);
    if (!isSoundMuted) sound.playPowerup();

    const wrongIndices = currentQuestion.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== currentQuestion.correctIndex);

    // Pick 2 wrong indices to eliminate
    const toEliminate = wrongIndices.slice(0, 2);
    setEliminatedOptions(toEliminate);
    setCombatLog((prev) => [`⚡ Lightning bolt dissolved 2 incorrect runes!`, ...prev.slice(0, 4)]);
  };

  // Power-up 2: Healing Potion
  const usePotion = () => {
    if (potionUsed || playerHp >= 100) return;
    setPotionUsed(true);
    if (!isSoundMuted) sound.playPowerup();
    const heal = 35;
    setPlayerHp((prev) => Math.min(100, prev + heal));
    triggerFloat(`+${heal} HP HEAL!`, "text-emerald-300 font-bold", "player");
    setCombatLog((prev) => [`🧪 Quaffed Elixir of Vitality (+${heal} HP)!`, ...prev.slice(0, 4)]);
  };

  // Power-up 3: Aegis Ward
  const useShield = () => {
    if (shieldUsed || isShieldActive) return;
    setShieldUsed(true);
    setIsShieldActive(true);
    if (!isSoundMuted) sound.playPowerup();
    triggerFloat("SHIELD EQUIPPED!", "text-cyan-300 font-bold", "player");
    setCombatLog((prev) => [`🛡️ Summoned barrier against next incoming strike!`, ...prev.slice(0, 4)]);
  };

  const handleClaimVictory = () => {
    const earnedXp = 250;
    const earnedGold = 85;
    awardRewards(earnedXp, earnedGold);
    closeBattle();
  };

  const handleRetryBattle = () => {
    setBossHp(100);
    setPlayerHp(100);
    setCurrentQIndex(0);
    setCombo(1);
    setTimeLeft(ROUND_TIME_SECONDS);
    setBattleState("fighting");
    setPotionUsed(false);
    setFiftyFiftyUsed(false);
    setShieldUsed(false);
    setIsShieldActive(false);
    setEliminatedOptions([]);
    setCombatLog([`⚔️ Arena rekindled! The battle begins anew!`]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-950/90 p-3 sm:p-6 backdrop-blur-xl animate-fade-in">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-3xl border border-violet-500/40 bg-gradient-to-b from-midnight-900 to-midnight-950 p-5 sm:p-7 shadow-2xl shadow-violet-950/50">
        
        {/* Arena Header */}
        <div className="flex items-center justify-between pb-4 border-b border-midnight-700/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-glow">
              <Swords className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white font-fantasy tracking-wider">
                  Live Knowledge Arena
                </h3>
                <span className="animate-pulse rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/40">
                  LIVE BATTLE
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                Forged from: {battleDoc.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Combo Streak Pill */}
            {combo > 1 && (
              <Badge color="gold" className="animate-bounce font-bold">
                🔥 x{combo} Combo!
              </Badge>
            )}

            {/* Mute button */}
            <button
              onClick={() => setIsSoundMuted(!isSoundMuted)}
              className="rounded-xl border border-midnight-700 bg-midnight-800/80 p-2 text-slate-400 hover:text-white transition-all"
              aria-label="Toggle sound"
            >
              {isSoundMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={closeBattle}
              className="rounded-xl border border-midnight-700 bg-midnight-800/80 p-2 text-slate-400 hover:text-rose-400 transition-all"
              aria-label="Exit arena"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* COMBATANTS HUD */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          
          {/* PLAYER CARD */}
          <div
            className={`relative rounded-2xl border p-4 bg-midnight-800/60 backdrop-blur-md transition-all duration-200 ${
              playerFlinching
                ? "border-rose-500 bg-rose-500/20 scale-95"
                : "border-cyan-500/30"
            }`}
          >
            {floatingText && floatingText.target === "player" && (
              <div className="absolute top-2 right-4 animate-bounce text-sm font-bold z-10">
                <span className={floatingText.color}>{floatingText.text}</span>
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/30 border border-violet-400/40 text-xl">
                  🧙‍♂️
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Scholar (You)</h4>
                  <span className="text-[10px] text-violet-300 font-semibold">
                    Level {stats.level} · {stats.rankTitle}
                  </span>
                </div>
              </div>
              {isShieldActive && (
                <span className="flex items-center gap-1 text-[10px] text-cyan-300 font-bold bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/40">
                  <Shield className="h-3 w-3" /> Shield Up
                </span>
              )}
            </div>

            {/* Player HP Bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-400">Health</span>
                <span className={playerHp < 35 ? "text-rose-400" : "text-emerald-300"}>
                  {playerHp} / 100 HP
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-midnight-950 border border-midnight-700/60">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    playerHp < 35
                      ? "bg-gradient-to-r from-rose-600 to-red-500"
                      : "bg-gradient-to-r from-emerald-500 to-teal-400"
                  }`}
                  style={{ width: `${playerHp}%` }}
                />
              </div>
            </div>
          </div>

          {/* BOSS CARD */}
          <div
            className={`relative rounded-2xl border p-4 bg-midnight-800/60 backdrop-blur-md transition-all duration-200 ${
              bossFlinching
                ? "border-amber-400 bg-amber-500/20 scale-95"
                : "border-rose-500/30"
            }`}
          >
            {floatingText && floatingText.target === "boss" && (
              <div className="absolute top-2 left-4 animate-bounce text-sm font-bold z-10">
                <span className={floatingText.color}>{floatingText.text}</span>
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600/30 to-amber-600/20 border border-rose-500/40 text-2xl animate-pulse">
                  {boss.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-fantasy">{boss.name}</h4>
                  <span className="text-[10px] text-rose-300 truncate block max-w-[180px]">
                    {boss.title}
                  </span>
                </div>
              </div>
              <Badge color="rose">Boss</Badge>
            </div>

            {/* Boss HP Bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-400">Boss Vitality</span>
                <span className="text-rose-400">{bossHp} / 100 HP</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-midnight-950 border border-midnight-700/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${bossHp}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* COMBAT TIMER BAR */}
        {battleState === "fighting" && (
          <div className="mt-4 rounded-xl border border-midnight-700/40 bg-midnight-900/60 p-2.5">
            <div className="flex items-center justify-between text-xs mb-1 text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                Boss Incantation Ticking Down
              </span>
              <span className={timeLeft <= 5 ? "text-rose-400 font-bold animate-pulse" : "text-amber-300"}>
                {timeLeft}s remaining
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-midnight-950">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  timeLeft <= 5 ? "bg-rose-500" : "bg-gradient-to-r from-amber-400 to-orange-500"
                }`}
                style={{ width: `${(timeLeft / ROUND_TIME_SECONDS) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ACTION / SPELL DECK */}
        {battleState === "fighting" && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl border border-midnight-700/50 bg-midnight-800/40">
            <span className="text-xs font-semibold text-slate-400">Scholar Spells:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={fiftyFiftyUsed}
                onClick={useFiftyFifty}
                leftIcon={<Zap className="h-3.5 w-3.5 text-yellow-400" />}
                className="text-xs"
              >
                50/50 Rune {fiftyFiftyUsed && "✓"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={potionUsed || playerHp >= 100}
                onClick={usePotion}
                leftIcon={<Heart className="h-3.5 w-3.5 text-rose-400" />}
                className="text-xs"
              >
                Heal Potion {potionUsed && "✓"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={shieldUsed || isShieldActive}
                onClick={useShield}
                leftIcon={<Shield className="h-3.5 w-3.5 text-cyan-400" />}
                className="text-xs"
              >
                Aegis Shield {shieldUsed && "✓"}
              </Button>
            </div>
          </div>
        )}

        {/* ACTIVE QUESTION TRIAL OR VICTORY/DEFEAT */}
        {battleState === "fighting" ? (
          <div className="mt-5 rounded-2xl border border-midnight-700/60 bg-midnight-800/80 p-5 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                Trial Question {currentQIndex + 1} of {questions.length}
              </span>
              <span className="text-xs text-slate-500">
                Hit the correct rune to strike the boss!
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-white mb-5 leading-snug">
              {currentQuestion?.prompt}
            </h4>

            {/* Answer Runes / Options */}
            <div className="grid gap-3 sm:grid-cols-2">
              {currentQuestion?.options.map((option, idx) => {
                const isEliminated = eliminatedOptions.includes(idx);
                return (
                  <button
                    key={idx}
                    disabled={isEliminated}
                    onClick={() => handlePlayerAttack(idx)}
                    className={`group relative flex items-center justify-between p-4 rounded-xl border text-left text-sm font-medium transition-all ${
                      isEliminated
                        ? "border-midnight-800 bg-midnight-950/40 text-slate-600 opacity-40 line-through cursor-not-allowed"
                        : "border-midnight-700/70 bg-midnight-900/80 text-slate-200 hover:border-violet-500 hover:bg-violet-600/10 hover:shadow-glow active:scale-[0.98]"
                    }`}
                  >
                    <span className="flex-1 pr-2">{option}</span>
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-midnight-800 text-[10px] font-bold text-violet-400 border border-midnight-700 group-hover:border-violet-500">
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : battleState === "victory" ? (
          /* VICTORY SCREEN */
          <div className="mt-6 rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-midnight-800/80 to-midnight-900/90 p-8 text-center animate-slide-up">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-gold mb-3">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-fantasy tracking-wider">
              VICTORY ACHIEVED!
            </h3>
            <p className="mt-1 text-sm text-amber-200 font-medium">
              You defeated {boss.name} and liberated the knowledge within!
            </p>

            {/* Loot Drop Rewards */}
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 p-4 rounded-2xl border border-midnight-700/60 bg-midnight-950/60">
              <div className="flex items-center gap-2 text-violet-300 font-bold">
                <Sparkles className="h-5 w-5" />
                <span>+250 XP Gained</span>
              </div>
              <div className="h-4 w-px bg-midnight-700" />
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Coins className="h-5 w-5" />
                <span>+85 Gold Collected</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="gold"
                size="lg"
                onClick={handleClaimVictory}
                className="font-bold text-midnight-950"
              >
                Claim Loot & Return
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleRetryBattle}
                leftIcon={<RotateCcw className="h-4 w-4" />}
              >
                Battle Again
              </Button>
            </div>
          </div>
        ) : (
          /* DEFEAT SCREEN */
          <div className="mt-6 rounded-2xl border border-rose-500/40 bg-gradient-to-b from-rose-500/10 via-midnight-800/80 to-midnight-900/90 p-8 text-center animate-slide-up">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 mb-3 text-2xl">
              💀
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-fantasy">
              SCHOLAR FELLED
            </h3>
            <p className="mt-1 text-sm text-rose-300">
              The guardian proved too formidable this time. Review your document and strike again!
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="danger"
                size="lg"
                onClick={handleRetryBattle}
                leftIcon={<RotateCcw className="h-4 w-4" />}
              >
                Revive & Try Again
              </Button>
              <Button variant="secondary" size="lg" onClick={closeBattle}>
                Retreat to Study
              </Button>
            </div>
          </div>
        )}

        {/* COMBAT LOG */}
        <div className="mt-5 border-t border-midnight-700/50 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Combat Log
          </p>
          <div className="space-y-1 text-xs text-slate-400 min-h-[40px]">
            {combatLog.length === 0 ? (
              <p className="text-slate-600 italic">Select runes to strike the guardian.</p>
            ) : (
              combatLog.slice(0, 3).map((log, idx) => (
                <p key={idx} className="truncate">
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
