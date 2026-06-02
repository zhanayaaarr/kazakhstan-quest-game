import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import baiterek from "@/assets/baiterek.jpg";
import koktobe from "@/assets/koktobe.jpg";
import turkestan from "@/assets/turkestan.jpg";
import shymkent from "@/assets/shymkent.jpg";
import baikonur from "@/assets/baikonur.jpg";
import { AuthGate } from "@/components/AuthGate";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kazakhstan Quest — City & Monument Adventure" },
      { name: "description", content: "A colorful educational quiz adventure across Kazakhstan: cities, monuments, and fun facts." },
      { property: "og:title", content: "Kazakhstan Quest" },
      { property: "og:description", content: "Travel across Kazakhstan and learn about its cities and monuments." },
    ],
  }),
  component: GameRoute,
});

function GameRoute() {
  return <AuthGate>{(session) => <Game session={session} />}</AuthGate>;
}

type Question = { q: string; answers: string[]; hint: string };
type Level = {
  city: string;
  monument: string;
  location: string;
  image: string;
  guide: string;
  fact: string;
  questions: Question[];
};

const LEVELS: Level[] = [
  {
    city: "Astana",
    monument: "Baiterek Tower",
    location: "Astana, capital of Kazakhstan",
    image: baiterek,
    guide: "Aisha",
    fact: "Baiterek is 97 meters tall — symbolizing 1997, the year Astana became the capital!",
    questions: [
      { q: "What city is shown in the image?", answers: ["astana", "nur-sultan", "nursultan"], hint: "It's the capital city of Kazakhstan." },
      { q: "What is this monument called?", answers: ["baiterek", "bayterek", "baiterek tower"], hint: "It means 'tall poplar tree' in Kazakh." },
      { q: "What is it famous for? (one word)", answers: ["capital", "symbol", "tower"], hint: "It is the symbol of the capital." },
    ],
  },
  {
    city: "Almaty",
    monument: "Kok-Tobe",
    location: "Almaty, southern Kazakhstan",
    image: koktobe,
    guide: "Daulet",
    fact: "Almaty was the old capital and means 'father of apples' — apples originated here!",
    questions: [
      { q: "What city is shown in the image?", answers: ["almaty", "alma-ata", "almata"], hint: "Means 'father of apples'." },
      { q: "What is this hill called?", answers: ["kok-tobe", "koktobe", "kok tobe"], hint: "Means 'green hill' in Kazakh." },
      { q: "What is Almaty famous for? (one word)", answers: ["apples", "mountains", "apple"], hint: "A fruit that grew here first." },
    ],
  },
  {
    city: "Turkestan",
    monument: "Khoja Ahmed Yasawi Mausoleum",
    location: "Turkestan, southern Kazakhstan",
    image: turkestan,
    guide: "Madina",
    fact: "This UNESCO World Heritage site was built by Timur in the 14th century!",
    questions: [
      { q: "What city is shown in the image?", answers: ["turkestan", "turkistan"], hint: "An ancient spiritual city." },
      { q: "Who is this mausoleum dedicated to?", answers: ["yasawi", "ahmed yasawi", "khoja ahmed yasawi", "yassawi"], hint: "A famous Sufi poet." },
      { q: "What organization protects it? (acronym)", answers: ["unesco"], hint: "World heritage organization." },
    ],
  },
  {
    city: "Shymkent",
    monument: "Independence Monument",
    location: "Shymkent, southern Kazakhstan",
    image: shymkent,
    guide: "Bolat",
    fact: "Shymkent is the third largest city of Kazakhstan and over 2,200 years old!",
    questions: [
      { q: "What city is shown in the image?", answers: ["shymkent", "chimkent"], hint: "Third largest city of Kazakhstan." },
      { q: "What does this monument celebrate?", answers: ["independence", "freedom"], hint: "Gained in 1991." },
      { q: "In which part of Kazakhstan is it? (north/south/east/west)", answers: ["south", "southern"], hint: "Warm climate region." },
    ],
  },
  {
    city: "Baikonur",
    monument: "Baikonur Cosmodrome",
    location: "Baikonur, Kyzylorda Region",
    image: baikonur,
    guide: "Saule",
    fact: "The first human in space, Yuri Gagarin, launched from Baikonur in 1961!",
    questions: [
      { q: "What place is shown in the image?", answers: ["baikonur", "baykonur"], hint: "Famous rocket launch site." },
      { q: "What is launched here?", answers: ["rockets", "rocket", "spacecraft", "spaceships"], hint: "They fly to space." },
      { q: "Who was the first human in space launched here?", answers: ["gagarin", "yuri gagarin", "yurigagarin"], hint: "Russian cosmonaut, 1961." },
    ],
  },
];

type Screen = "start" | "level" | "result" | "finish";

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9 -]/g, "");
}

function checkAnswer(input: string, answers: string[]): "correct" | "close" | "wrong" {
  const n = normalize(input);
  if (!n) return "wrong";
  if (answers.some((a) => normalize(a) === n)) return "correct";
  if (answers.some((a) => {
    const na = normalize(a);
    return na.includes(n) || n.includes(na) || levenshtein(n, na) <= 2;
  })) return "close";
  return "wrong";
}

function levenshtein(a: string, b: string): number {
  const m: number[][] = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) m[i][0] = i;
  for (let j = 0; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      m[i][j] = a[i - 1] === b[j - 1] ? m[i - 1][j - 1] : 1 + Math.min(m[i - 1][j], m[i][j - 1], m[i - 1][j - 1]);
  return m[a.length][b.length];
}

function getRank(score: number): { name: string; emoji: string } {
  if (score >= 140) return { name: "Kazakhstan Master", emoji: "🏆" };
  if (score >= 100) return { name: "Kazakhstan Navigator", emoji: "🌍" };
  if (score >= 60) return { name: "City Traveler", emoji: "🧭" };
  return { name: "Beginner Explorer", emoji: "🌱" };
}

function Game({ session }: { session: import("@supabase/supabase-js").Session }) {
  const [screen, setScreen] = useState<Screen>("start");
  const [levelIdx, setLevelIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [levelCorrect, setLevelCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ type: "correct" | "close" | "wrong"; msg: string; points: number } | null>(null);
  const [showHint, setShowHint] = useState(false);

  const level = LEVELS[levelIdx];
  const question = level?.questions[qIdx];

  function startGame() {
    setScreen("level");
    setLevelIdx(0);
    setQIdx(0);
    setScore(0);
    setLevelScore(0);
    setLevelCorrect(0);
    setInput("");
    setFeedback(null);
    setShowHint(false);
  }

  function submit() {
    if (!question || feedback) return;
    const r = checkAnswer(input, question.answers);
    const points = r === "correct" ? 10 : r === "close" ? 5 : 0;
    const msg =
      r === "correct"
        ? `Correct! ${level.guide} says: "${question.answers[0].toUpperCase()} — well done!"`
        : r === "close"
        ? `So close! The answer was "${question.answers[0]}".`
        : `Not quite. The answer was "${question.answers[0]}".`;
    setFeedback({ type: r, msg, points });
    setScore((s) => s + points);
    setLevelScore((s) => s + points);
    if (r === "correct") setLevelCorrect((c) => c + 1);
  }

  function next() {
    setFeedback(null);
    setInput("");
    setShowHint(false);
    if (qIdx + 1 < level.questions.length) {
      setQIdx((i) => i + 1);
    } else {
      // level complete
      if (levelCorrect === level.questions.length) {
        setScore((s) => s + 20);
        setLevelScore((s) => s + 20);
      }
      setScreen("result");
    }
  }

  function nextLevel() {
    if (levelIdx + 1 < LEVELS.length) {
      setLevelIdx((i) => i + 1);
      setQIdx(0);
      setLevelScore(0);
      setLevelCorrect(0);
      setScreen("level");
    } else {
      setScreen("finish");
    }
  }

  // ============ START SCREEN ============
  if (screen === "start") {
    return (
      <div
        className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center p-6"
        style={{
          backgroundImage: `linear-gradient(180deg, oklch(0.4 0.15 220 / 0.55), oklch(0.3 0.1 240 / 0.7)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-6 left-6 text-5xl animate-float">🇰🇿</div>
        <div className="absolute top-12 right-10 text-5xl animate-float" style={{ animationDelay: "0.5s" }}>🏛️</div>
        <div className="absolute bottom-12 left-10 text-5xl animate-float" style={{ animationDelay: "1s" }}>🦅</div>
        <div className="absolute bottom-8 right-8 text-5xl animate-float" style={{ animationDelay: "1.5s" }}>🚀</div>

        <div className="relative text-center max-w-2xl animate-bounce-in">
          <div className="inline-block px-4 py-1 rounded-full bg-secondary text-secondary-foreground font-bold mb-4 text-sm tracking-widest">
            🇰🇿 EDUCATIONAL ADVENTURE
          </div>
          <h1
            className="text-6xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl leading-none"
            style={{ textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}
          >
            KAZAKHSTAN
            <br />
            <span style={{ background: "var(--gradient-gold)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              QUEST
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-10 font-medium">
            City & Monument Adventure — travel, learn, and explore!
          </p>
          <button
            onClick={startGame}
            className="group relative px-12 py-5 text-2xl font-black text-secondary-foreground rounded-2xl transition-transform hover:scale-110 active:scale-95"
            style={{
              background: "var(--gradient-gold)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            PLAY ▶️
          </button>
          <div className="mt-8 flex justify-center gap-6 text-white/80 text-sm font-semibold">
            <span>5 LEVELS</span>
            <span>•</span>
            <span>15 QUESTIONS</span>
            <span>•</span>
            <span>1 EPIC JOURNEY</span>
          </div>
        </div>
      </div>
    );
  }

  // ============ FINISH ============
  if (screen === "finish") {
    const rank = getRank(score);
    return <FinishScreen score={score} rank={rank} session={session} onReplay={() => setScreen("start")} />;
  }

  // ============ LEVEL RESULT ============
  if (screen === "result") {
    const perfect = levelCorrect === level.questions.length;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="bg-card rounded-3xl p-8 max-w-xl w-full animate-bounce-in" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">{perfect ? "🏆" : "✨"}</div>
            <h2 className="text-3xl font-black">Level {levelIdx + 1} Complete!</h2>
            <p className="text-muted-foreground">{level.city} — {level.monument}</p>
          </div>

          <img src={level.image} alt={level.monument} className="w-full h-56 object-cover rounded-2xl mb-4" width={1024} height={1024} />

          <div className="rounded-2xl p-4 mb-4 bg-muted">
            <div className="font-bold text-sm text-muted-foreground mb-1">📍 LOCATION</div>
            <div className="font-bold">{level.location}</div>
          </div>

          <div className="rounded-2xl p-4 mb-4" style={{ background: "var(--gradient-gold)" }}>
            <div className="font-bold text-sm text-secondary-foreground/70 mb-1">💡 FUN FACT</div>
            <div className="font-bold text-secondary-foreground">{level.fact}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl p-3 bg-muted text-center">
              <div className="text-xs font-bold text-muted-foreground">CORRECT</div>
              <div className="text-2xl font-black">{levelCorrect}/{level.questions.length}</div>
            </div>
            <div className="rounded-xl p-3 bg-success/20 text-center">
              <div className="text-xs font-bold text-muted-foreground">LEVEL SCORE</div>
              <div className="text-2xl font-black">+{levelScore} ⭐</div>
            </div>
          </div>

          {perfect && (
            <div className="mb-4 p-3 rounded-xl bg-success text-success-foreground text-center font-bold">
              🎉 PERFECT! +20 bonus points!
            </div>
          )}

          <button
            onClick={nextLevel}
            className="w-full py-4 rounded-xl font-black text-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            {levelIdx + 1 < LEVELS.length ? `Travel to Level ${levelIdx + 2} →` : "Finish Journey 🏁"}
          </button>
        </div>
      </div>
    );
  }

  // ============ LEVEL ============
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* HUD */}
        <div className="flex items-center justify-between mb-4 bg-card rounded-2xl p-3 px-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇰🇿</span>
            <div>
              <div className="text-xs font-bold text-muted-foreground">LEVEL {levelIdx + 1} / {LEVELS.length}</div>
              <div className="font-black">{level.city}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-muted-foreground">SCORE</div>
            <div className="font-black text-xl text-accent">{score} ⭐</div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mb-4 justify-center">
          {LEVELS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i === levelIdx ? "w-10 bg-primary" : i < levelIdx ? "w-6 bg-success" : "w-6 bg-muted"}`}
            />
          ))}
        </div>

        {/* Image card */}
        <div className="bg-card rounded-3xl overflow-hidden mb-4" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="relative">
            <img src={level.image} alt="Mystery location" className="w-full h-72 md:h-96 object-cover" width={1024} height={1024} />
            <div className="absolute top-3 left-3 bg-card/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold">
              📷 Question {qIdx + 1} / {level.questions.length}
            </div>
          </div>

          <div className="p-5">
            {/* NPC guide */}
            <div className="flex items-start gap-3 mb-4 p-3 rounded-2xl bg-muted">
              <div className="text-3xl">🧑‍🏫</div>
              <div className="flex-1">
                <div className="text-xs font-bold text-muted-foreground">GUIDE {level.guide.toUpperCase()}</div>
                <div className="font-bold">{question.q}</div>
              </div>
            </div>

            {!feedback ? (
              <>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Type your answer..."
                  autoFocus
                  className="w-full px-5 py-4 rounded-2xl bg-input border-2 border-border focus:border-primary focus:outline-none text-lg font-semibold"
                />
                {showHint && (
                  <div className="mt-3 p-3 rounded-xl bg-secondary/30 text-sm font-semibold animate-bounce-in">
                    💡 Hint: {question.hint}
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setShowHint(true)}
                    disabled={showHint}
                    className="px-5 py-3 rounded-xl font-bold bg-muted hover:bg-secondary/40 transition disabled:opacity-50"
                  >
                    💡 Hint
                  </button>
                  <button
                    onClick={submit}
                    disabled={!input.trim()}
                    className="flex-1 py-3 rounded-xl font-black text-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
                  >
                    Submit Answer
                  </button>
                </div>
              </>
            ) : (
              <div className="animate-bounce-in">
                <div
                  className={`p-4 rounded-2xl mb-3 font-bold ${
                    feedback.type === "correct"
                      ? "bg-success text-success-foreground"
                      : feedback.type === "close"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-destructive text-destructive-foreground"
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {feedback.type === "correct" ? "✅ Correct!" : feedback.type === "close" ? "🤏 Close!" : "❌ Not quite"}
                  </div>
                  <div className="text-sm font-semibold opacity-95">{feedback.msg}</div>
                  {feedback.points > 0 && (
                    <div className="mt-2 text-lg font-black animate-pop">You earned +{feedback.points} points ⭐</div>
                  )}
                </div>
                <button
                  onClick={next}
                  className="w-full py-4 rounded-xl font-black text-lg bg-primary text-primary-foreground hover:opacity-90 transition"
                >
                  {qIdx + 1 < level.questions.length ? "Next Question →" : "Finish Level →"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
