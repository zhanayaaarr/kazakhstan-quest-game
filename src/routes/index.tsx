import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import baiterek from "@/assets/baiterek.jpg";
import koktobe from "@/assets/koktobe.jpg";
import turkestan from "@/assets/turkestan.jpg";
import shymkent from "@/assets/shymkent.jpg";
import baikonur from "@/assets/baikonur.jpg";
import konzhyk from "@/assets/konzhyk.png";
import { AuthGate } from "@/components/AuthGate";
import { supabase } from "@/integrations/supabase/client";
import { sfx } from "@/lib/sounds";

function Konzhyk({ message, size = 80 }: { message: string; size?: number }) {
  return (
    <div className="flex items-end gap-3 animate-bounce-in">
      <img
        src={konzhyk}
        alt="Konzhyk the bear"
        width={size}
        height={size}
        loading="lazy"
        style={{ width: size, height: size }}
        className="drop-shadow-md shrink-0"
      />
      <div className="relative bg-card border-2 border-border rounded-2xl px-4 py-3 text-sm font-semibold max-w-xs"
        style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="absolute -left-2 bottom-4 w-4 h-4 bg-card border-l-2 border-b-2 border-border rotate-45" />
        {message}
      </div>
    </div>
  );
}

const KZ_FACTS = [
  "Kazakhstan is the largest landlocked country in the world 🌍",
  "Almaty's name comes from 'alma' — the apple. Wild apples originated here! 🍎",
  "Baikonur Cosmodrome launched Yuri Gagarin, the first human in space 🚀",
  "The Kazakh steppe stretches farther than the distance from Madrid to Moscow 🐎",
  "Astana (now Nur-Sultan/Astana) became the capital in 1997 🏙️",
  "Kazakhstan has 130+ ethnic groups living together 🤝",
  "Lake Balkhash is half fresh water, half salty — split down the middle! 💧",
  "The snow leopard is a national symbol of Kazakhstan 🐆",
  "Shymbulak near Almaty is one of Central Asia's top ski resorts ⛷️",
  "Beshbarmak ('five fingers') is the national dish — eaten by hand 🍖",
  "The dombra is the iconic two-stringed Kazakh instrument 🎶",
  "Charyn Canyon is often called the 'little brother' of the Grand Canyon 🏜️",
];

function KonzhykFacts() {
  const [i, setI] = useState(() => Math.floor(Math.random() * KZ_FACTS.length));
  const next = () => setI((p) => (p + 1) % KZ_FACTS.length);
  return (
    <div className="flex flex-col gap-3">
      <Konzhyk message={KZ_FACTS[i]} size={96} />
      <button
        onClick={next}
        className="self-start ml-[108px] text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border border-border"
      >
        🐻 Tell me another fact
      </button>
    </div>
  );
}

function MiniLeaderboard() {
  const [rows, setRows] = useState<{ id: string; display_name: string | null; score: number }[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("game_results")
        .select("id, display_name, score")
        .order("score", { ascending: false })
        .limit(5);
      setRows(data ?? []);
    })();
  }, []);
  return (
    <div className="rounded-xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Leaderboard · Top 5</div>
        <span className="text-lg">🏆</span>
      </div>
      {rows.length === 0 ? (
        <div className="text-sm text-muted-foreground py-4 text-center">Be the first explorer!</div>
      ) : (
        <ol className="divide-y divide-border">
          {rows.map((r, i) => (
            <li key={r.id} className="flex items-center justify-between py-2 text-sm">
              <span className="flex items-center gap-3">
                <span className="tabular-nums w-5 text-muted-foreground">{i + 1}</span>
                <span className="truncate max-w-[180px]">{r.display_name ?? "Anon"}</span>
              </span>
              <span className="font-semibold tabular-nums">{r.score} ⭐</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

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
      { q: "How tall is Baiterek in meters?", answers: ["97", "97m", "97 meters"], hint: "Same as the year Astana became capital." },
      { q: "In which year did Astana become the capital?", answers: ["1997"], hint: "Look at the tower's height." },
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
      { q: "What does the name 'Almaty' mean? (one word)", answers: ["apple", "apples"], hint: "A fruit that originated here." },
      { q: "Which mountain range borders Almaty?", answers: ["tian shan", "tianshan", "tien shan"], hint: "Means 'celestial mountains'." },
      { q: "Was Almaty the former capital? (yes/no)", answers: ["yes"], hint: "Until 1997." },
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
      { q: "Which ruler built the mausoleum?", answers: ["timur", "tamerlane", "amir timur"], hint: "14th century conqueror." },
      { q: "In which century was it built?", answers: ["14", "14th", "xiv"], hint: "1300s." },
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
      { q: "In what year did Kazakhstan gain independence?", answers: ["1991"], hint: "Fall of the Soviet Union." },
      { q: "Shymkent is the ___ largest city. (number)", answers: ["3", "third", "3rd"], hint: "After Almaty and Astana." },
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
      { q: "In what year did Gagarin fly to space?", answers: ["1961"], hint: "Early 1960s." },
      { q: "Which region hosts the cosmodrome?", answers: ["kyzylorda", "kyzyl-orda", "kyzylorda region"], hint: "Southern Kazakhstan region." },
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
  const [qResults, setQResults] = useState<Array<"correct" | "close" | "wrong" | null>>([]);
  const [feedback, setFeedback] = useState<{ type: "correct" | "close" | "wrong"; msg: string; points: number } | null>(null);
  const [showHint, setShowHint] = useState(false);

  const level = LEVELS[levelIdx];
  const question = level?.questions[qIdx];

  function startGame() {
    sfx.click();
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
    if (r === "correct") {
      setLevelCorrect((c) => c + 1);
      sfx.correct();
    } else if (r === "close") {
      sfx.close();
    } else {
      sfx.wrong();
    }
  }

  function next() {
    sfx.click();
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
    sfx.click();
    if (levelIdx + 1 < LEVELS.length) {
      setLevelIdx((i) => i + 1);
      setQIdx(0);
      setLevelScore(0);
      setLevelCorrect(0);
      setScreen("level");
    } else {
      sfx.finish();
      setScreen("finish");
    }
  }

  // ============ START SCREEN ============
  if (screen === "start") {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Top nav */}
        <nav className="h-16 px-6 md:px-10 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-xl">🇰🇿</span>
            <span>Kazakhstan Quest</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <span>Levels</span>
            <span>Cities</span>
            <span>Leaderboard</span>
            <span>About</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={startGame}
              className="hidden md:inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-[#0d1218] transition-colors"
            >
              Start playing
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Sign out"
            >
              🚪 Exit
            </button>
          </div>
        </nav>

        {/* Hero band */}
        <section className="px-6 md:px-10 py-16 md:py-24 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-medium tracking-wide text-muted-foreground mb-6 uppercase">
              Educational adventure · 5 levels
            </div>
            <h1 className="text-5xl md:text-6xl font-normal leading-[1.05] tracking-tight">
              Travel across Kazakhstan.<br />
              <span className="text-muted-foreground">Learn its cities, monuments and stories.</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground max-w-xl">
              A quiet, illustrated quest through Astana, Almaty, Turkestan, Shymkent and Baikonur — answer questions, collect facts, climb the leaderboard.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button
                onClick={startGame}
                className="px-6 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-[#0d1218] transition-colors"
              >
                Start the journey
              </button>
              <button
                onClick={startGame}
                className="px-6 py-4 rounded-lg bg-background text-foreground font-medium border border-border hover:bg-secondary transition-colors"
              >
                How it works
              </button>
            </div>
            <div className="mt-10">
              <KonzhykFacts />
            </div>

          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-xl overflow-hidden border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
              <img src={heroBg} alt="Kazakhstan panorama" className="w-full h-[320px] object-cover" />
            </div>
            <MiniLeaderboard />
          </div>
        </section>

        {/* Signature cards row with city previews */}
        <section className="px-6 md:px-10 pb-24 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl overflow-hidden text-white" style={{ backgroundColor: "var(--signature-coral)" }}>
            <img src={baiterek} alt="Baiterek" className="w-full h-40 object-cover" />
            <div className="p-6">
              <div className="text-xs uppercase tracking-wide opacity-80 mb-2">01 — Cities</div>
              <div className="text-xl leading-tight">Five iconic places, from the steppe capital to the cosmodrome.</div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden text-white" style={{ backgroundColor: "var(--signature-forest)" }}>
            <img src={turkestan} alt="Turkestan" className="w-full h-40 object-cover" />
            <div className="p-6">
              <div className="text-xs uppercase tracking-wide opacity-80 mb-2">02 — Questions</div>
              <div className="text-xl leading-tight">25 thoughtful prompts. Hints when you need them, points when you don't.</div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--signature-peach)", color: "#181d26" }}>
            <img src={koktobe} alt="Kok-Tobe" className="w-full h-40 object-cover" />
            <div className="p-6">
              <div className="text-xs uppercase tracking-wide opacity-70 mb-2">03 — Ranks</div>
              <div className="text-xl leading-tight">From Beginner Explorer to Kazakhstan Master — your journey, recorded.</div>
            </div>
          </div>
        </section>

        {/* Footer hairline */}
        <div className="mt-auto border-t border-border px-6 md:px-10 py-6 text-xs text-muted-foreground flex justify-between">
          <span>© Kazakhstan Quest</span>
          <span>5 levels · 25 questions · 1 epic journey</span>
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
        <div className="bg-card rounded-xl p-8 max-w-xl w-full animate-bounce-in border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="mb-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Level {levelIdx + 1} complete</div>
            <h2 className="text-3xl font-normal tracking-tight">{level.city}</h2>
            <p className="text-muted-foreground">{level.monument}</p>
          </div>

          <img src={level.image} alt={level.monument} className="w-full h-56 object-cover rounded-lg mb-4" width={1024} height={1024} />

          <div className="rounded-lg p-4 mb-3 border border-border">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Location</div>
            <div className="font-medium">{level.location}</div>
          </div>

          <div className="rounded-lg p-5 mb-4" style={{ backgroundColor: "var(--signature-cream)", color: "#181d26" }}>
            <div className="text-xs uppercase tracking-wide opacity-70 mb-1">Fun fact</div>
            <div className="text-lg leading-snug">{level.fact}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-lg p-3 border border-border text-center">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Correct</div>
              <div className="text-2xl font-medium">{levelCorrect}/{level.questions.length}</div>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "var(--signature-mint)", color: "#0a2e0e" }}>
              <div className="text-xs uppercase tracking-wide opacity-70">Level score</div>
              <div className="text-2xl font-medium">+{levelScore}</div>
            </div>
          </div>

          {perfect && (
            <div className="mb-4 p-3 rounded-lg text-center font-medium" style={{ backgroundColor: "var(--signature-forest)", color: "#fff" }}>
              Perfect round — +20 bonus points
            </div>
          )}

          <div className="mb-4">
            <Konzhyk
              message={
                perfect
                  ? `Жарайсың! Perfect run through ${level.city}! 🎉`
                  : levelCorrect >= 3
                  ? `Great job in ${level.city}! Keep going 🐾`
                  : `Don't give up — ${level.city} has more to teach you!`
              }
              size={72}
            />
          </div>

          <button
            onClick={nextLevel}
            className="w-full py-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-[#0d1218] transition-colors"
          >
            {levelIdx + 1 < LEVELS.length ? `Continue to level ${levelIdx + 2} →` : "Finish journey →"}
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
              <img src={konzhyk} alt="Konzhyk" width={56} height={56} loading="lazy" style={{ width: 56, height: 56 }} className="shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-bold text-muted-foreground">KONZHYK with {level.guide.toUpperCase()}</div>
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

type Result = { id: string; display_name: string | null; score: number; rank: string | null; created_at: string };

function FinishScreen({
  score,
  rank,
  session,
  onReplay,
}: {
  score: number;
  rank: { name: string; emoji: string };
  session: import("@supabase/supabase-js").Session;
  onReplay: () => void;
}) {
  const [results, setResults] = useState<Result[]>([]);
  const [saved, setSaved] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  // Animated count-up for the score
  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(score * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  useEffect(() => {
    (async () => {
      const userId = session.user.id;
      const { data: profile } = await supabase
        .from("profiles")
        .select("best_score, display_name")
        .eq("user_id", userId)
        .maybeSingle();

      const prev = profile?.best_score ?? 0;
      if (score > prev) {
        await supabase
          .from("profiles")
          .update({ best_score: score, rank: rank.name })
          .eq("user_id", userId);
      }

      await supabase.from("game_results").insert({
        user_id: userId,
        display_name: profile?.display_name ?? session.user.email,
        score,
        rank: rank.name,
        levels_completed: LEVELS.length,
      });

      const { data: top } = await supabase
        .from("game_results")
        .select("id, display_name, score, rank, created_at")
        .order("score", { ascending: false })
        .limit(10);

      setResults((top ?? []) as Result[]);
      setSaved(true);
    })();
  }, [score, rank.name, session.user.id, session.user.email]);

  return (
    <div className="h-screen bg-background flex items-center justify-center p-6 overflow-hidden">
      <div
        className="bg-card rounded-xl max-w-lg w-full border border-border animate-bounce-in flex flex-col max-h-[calc(100vh-3rem)]"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Sticky score header */}
        <div className="p-8 pb-4 shrink-0 border-b border-border bg-card rounded-t-xl">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3 animate-fade-in">Journey complete</div>
          <h2 className="text-3xl font-normal tracking-tight mb-2 animate-fade-in" style={{ animationDelay: "80ms", animationFillMode: "backwards" }}>You crossed Kazakhstan</h2>
          <p className="text-muted-foreground text-sm mb-4 animate-fade-in" style={{ animationDelay: "160ms", animationFillMode: "backwards" }}>Signed in as {session.user.email}</p>

          <div className="rounded-xl p-5 animate-scale-in" style={{ backgroundColor: "var(--signature-navy)", color: "#fff", animationDelay: "240ms", animationFillMode: "backwards" }}>
            <div className="text-xs uppercase tracking-wide opacity-70 mb-1">Total score</div>
            <div className="text-5xl font-normal tracking-tight tabular-nums">{displayScore}</div>
            <div className="mt-2 text-base">
              <span className="inline-block animate-[pop_0.6s_ease-out_1.2s_backwards]">{rank.emoji}</span> {rank.name}
            </div>
            <div className="mt-1 text-xs opacity-70 transition-opacity">
              {saved ? "✓ Result saved to leaderboard" : "Saving result…"}
            </div>
          </div>
        </div>

        {/* Scrollable leaderboard with smooth scroll */}
        <div className="flex-1 min-h-0 flex flex-col px-8 pt-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2 shrink-0">Top 10 explorers</div>
          <div
            className="flex-1 min-h-[180px] overflow-y-auto border border-border rounded-lg divide-y divide-border scroll-smooth [scrollbar-width:thin] [scrollbar-color:var(--signature-navy)_transparent]"
            style={{ scrollBehavior: "smooth" }}
          >
            {results.length === 0 ? (
              <div className="px-4 py-6 text-sm text-muted-foreground text-center">Loading…</div>
            ) : (
              results.map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-muted/50 hover:translate-x-1 transition-all duration-200 opacity-0 animate-[fade-in_0.4s_ease-out_forwards]"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="text-muted-foreground tabular-nums w-6">{i + 1}</span>
                  <span className="flex-1 truncate">{r.display_name ?? "Anon"}</span>
                  <span className="font-medium tabular-nums">{r.score}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="p-8 pt-4 shrink-0 border-t border-border mt-4">
          <button
            onClick={onReplay}
            className="w-full py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-[#0d1218] transition-colors mb-2"
          >
            Play again
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full py-2 rounded-lg font-medium text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}


