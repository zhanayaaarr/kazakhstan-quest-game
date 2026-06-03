import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
// Реальные фотографии из Wikimedia Commons (свободные лицензии)
const heroBg = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/City_Gate%2C_Astana%2C_Skyline_of_Nur_Sultan.jpg/1280px-City_Gate%2C_Astana%2C_Skyline_of_Nur_Sultan.jpg";
const baiterek = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Baiterek_August.jpg/1280px-Baiterek_August.jpg";
const koktobe = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Sunset_over_the_Almaty_seen_from_Kok_Tobe_mountain%2C_pic_2.jpg/1280px-Sunset_over_the_Almaty_seen_from_Kok_Tobe_mountain%2C_pic_2.jpg";
const turkestan = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Mausoleum_of_Khoja_Ahmed_Yasavi_in_Turkestan%2C_Kazakhstan.jpg/1280px-Mausoleum_of_Khoja_Ahmed_Yasavi_in_Turkestan%2C_Kazakhstan.jpg";
const shymkent = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Ordabasy_Plaza_%28Shymkent%29.jpg/1280px-Ordabasy_Plaza_%28Shymkent%29.jpg";
const baikonur = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Soyuz_TMA-09M_spacecraft_at_the_Baikonur_Cosmodrome_launch_pad_%284%29.jpg/1280px-Soyuz_TMA-09M_spacecraft_at_the_Baikonur_Cosmodrome_launch_pad_%284%29.jpg";
const kzFlag = "https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kazakhstan.svg";
import konzhyk from "@/assets/konzhyk.png";
import { AuthGate } from "@/components/AuthGate";
import { supabase } from "@/integrations/supabase/client";
import { sfx } from "@/lib/sounds";

type Mood = "happy" | "celebrate" | "thinking" | "sad" | "neutral";
const MOOD_EMOJI: Record<Mood, string> = {
  happy: "😊",
  celebrate: "🎉",
  thinking: "🤔",
  sad: "🥺",
  neutral: "",
};
const MOOD_RING: Record<Mood, string> = {
  happy: "ring-4 ring-success/40",
  celebrate: "ring-4 ring-accent/50 animate-pop",
  thinking: "ring-4 ring-secondary/40",
  sad: "ring-4 ring-destructive/30",
  neutral: "",
};

function Konzhyk({ message, size = 80, mood = "neutral" }: { message: string; size?: number; mood?: Mood }) {
  return (
    <div className="flex items-end gap-3 animate-bounce-in">
      <div className="relative shrink-0">
        <img
          src={konzhyk}
          alt="Konzhyk the bear"
          width={size}
          height={size}
          loading="lazy"
          style={{ width: size, height: size }}
          className={`drop-shadow-md rounded-full ${MOOD_RING[mood]}`}
        />
        {MOOD_EMOJI[mood] && (
          <span className="absolute -top-2 -right-2 text-2xl drop-shadow-sm" aria-hidden>
            {MOOD_EMOJI[mood]}
          </span>
        )}
      </div>
      <div className="relative bg-card border-2 border-border rounded-2xl px-4 py-3 text-sm font-semibold max-w-xs"
        style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="absolute -left-2 bottom-4 w-4 h-4 bg-card border-l-2 border-b-2 border-border rotate-45" />
        {message}
      </div>
    </div>
  );
}

// ===== Streak (days in a row) — stored in localStorage =====
function loadStreak(): number {
  if (typeof window === "undefined") return 0;
  try {
    const last = localStorage.getItem("kq_lastPlay");
    const streak = parseInt(localStorage.getItem("kq_streak") ?? "0", 10) || 0;
    if (!last) return 0;
    const today = new Date().toDateString();
    const lastDate = new Date(last).toDateString();
    if (today === lastDate) return streak;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastDate === yesterday) return streak;
    return 0; // broken
  } catch {
    return 0;
  }
}
function bumpStreak(): number {
  if (typeof window === "undefined") return 0;
  try {
    const last = localStorage.getItem("kq_lastPlay");
    let streak = parseInt(localStorage.getItem("kq_streak") ?? "0", 10) || 0;
    const today = new Date().toDateString();
    const lastDate = last ? new Date(last).toDateString() : null;
    if (lastDate === today) {
      // already counted today
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      streak = lastDate === yesterday ? streak + 1 : 1;
      localStorage.setItem("kq_streak", String(streak));
      localStorage.setItem("kq_lastPlay", new Date().toISOString());
    }
    return streak;
  } catch {
    return 0;
  }
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
      { q: "What city is shown in the image? / Какой это город?", answers: ["astana", "nur-sultan", "nursultan", "астана", "нур-султан", "нурсултан"], hint: "It's the capital city of Kazakhstan. / Столица Казахстана." },
      { q: "What is this monument called? / Как называется этот памятник?", answers: ["baiterek", "bayterek", "baiterek tower", "байтерек", "бәйтерек"], hint: "It means 'tall poplar tree' in Kazakh. / Означает 'высокий тополь'." },
      { q: "What is it famous for? (one word) / Чем он знаменит? (одно слово)", answers: ["capital", "symbol", "tower", "столица", "символ", "башня", "астана"], hint: "It is the symbol of the capital." },
      { q: "How tall is Baiterek in meters? / Какова высота Байтерека в метрах?", answers: ["97", "97m", "97 meters", "97 метров"], hint: "Same as the year Astana became capital." },
      { q: "In which year did Astana become the capital? / В каком году Астана стала столицей?", answers: ["1997"], hint: "Look at the tower's height." },
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
      { q: "What city is shown in the image? / Какой это город?", answers: ["almaty", "alma-ata", "almata", "алматы", "алма-ата", "алмата"], hint: "Means 'father of apples'. / 'Отец яблок'." },
      { q: "What is this hill called? / Как называется этот холм?", answers: ["kok-tobe", "koktobe", "kok tobe", "көктөбе", "кок-тобе", "коктобе"], hint: "Means 'green hill' in Kazakh. / 'Зелёный холм'." },
      { q: "What does the name 'Almaty' mean? (one word) / Что значит 'Алматы'? (одно слово)", answers: ["apple", "apples", "яблоко", "яблоки", "алма"], hint: "A fruit that originated here." },
      { q: "Which mountain range borders Almaty? / Какие горы рядом с Алматы?", answers: ["tian shan", "tianshan", "tien shan", "тянь-шань", "тянь шань", "тяньшань"], hint: "Means 'celestial mountains'." },
      { q: "Was Almaty the former capital? (yes/no) / Алматы была столицей? (да/нет)", answers: ["yes", "да", "иә"], hint: "Until 1997." },
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
      { q: "What city is shown in the image? / Какой это город?", answers: ["turkestan", "turkistan", "туркестан", "түркістан", "туркистан"], hint: "An ancient spiritual city." },
      { q: "Who is this mausoleum dedicated to? / Кому посвящён этот мавзолей?", answers: ["yasawi", "ahmed yasawi", "khoja ahmed yasawi", "yassawi", "ясави", "ахмед ясави", "ходжа ахмед ясави", "яссауи"], hint: "A famous Sufi poet." },
      { q: "What organization protects it? (acronym) / Какая организация его охраняет? (аббревиатура)", answers: ["unesco", "юнеско"], hint: "World heritage organization." },
      { q: "Which ruler built the mausoleum? / Какой правитель построил мавзолей?", answers: ["timur", "tamerlane", "amir timur", "тимур", "тамерлан", "әмір темір", "амир тимур"], hint: "14th century conqueror." },
      { q: "In which century was it built? / В каком веке его построили?", answers: ["14", "14th", "xiv", "14 век", "xiv век", "14-й"], hint: "1300s." },
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
      { q: "What city is shown in the image? / Какой это город?", answers: ["shymkent", "chimkent", "шымкент", "чимкент"], hint: "Third largest city of Kazakhstan." },
      { q: "What does this monument celebrate? / Что отмечает этот памятник?", answers: ["independence", "freedom", "независимость", "свобода", "тәуелсіздік"], hint: "Gained in 1991." },
      { q: "In which part of Kazakhstan is it? (north/south/east/west) / В какой части Казахстана? (север/юг/восток/запад)", answers: ["south", "southern", "юг", "южная", "оңтүстік"], hint: "Warm climate region." },
      { q: "In what year did Kazakhstan gain independence? / В каком году Казахстан получил независимость?", answers: ["1991"], hint: "Fall of the Soviet Union." },
      { q: "Shymkent is the ___ largest city. (number) / Шымкент — ___ по величине город. (число)", answers: ["3", "third", "3rd", "третий", "3-й", "үшінші"], hint: "After Almaty and Astana." },
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
      { q: "What place is shown in the image? / Какое это место?", answers: ["baikonur", "baykonur", "байконур", "байқоңыр"], hint: "Famous rocket launch site." },
      { q: "What is launched here? / Что отсюда запускают?", answers: ["rockets", "rocket", "spacecraft", "spaceships", "ракеты", "ракета", "космические корабли", "зымыран"], hint: "They fly to space." },
      { q: "Who was the first human in space launched here? / Кто был первым человеком в космосе?", answers: ["gagarin", "yuri gagarin", "yurigagarin", "гагарин", "юрий гагарин"], hint: "Russian cosmonaut, 1961." },
      { q: "In what year did Gagarin fly to space? / В каком году Гагарин полетел в космос?", answers: ["1961"], hint: "Early 1960s." },
      { q: "Which region hosts the cosmodrome? / В какой области находится космодром?", answers: ["kyzylorda", "kyzyl-orda", "kyzylorda region", "кызылорда", "кызылординская", "қызылорда"], hint: "Southern Kazakhstan region." },
    ],
  },
];

type Screen = "start" | "level" | "result" | "finish";

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/ё/g, "е").replace(/[^a-z0-9а-яәіңғүұқөһ -]/gi, "");
}

const MOTIVATIONS = {
  correct: [
    "Молодец! Қонжық гордится тобой! 🐻",
    "Жарайсың! Ты настоящий знаток!",
    "Ого! Қонжық хлопает лапами! 🎉",
    "Так держать! Тебе покорится вся степь!",
  ],
  close: [
    "Почти! Қонжық верит — в следующий раз получится!",
    "Совсем рядом! Не сдавайся, дружок!",
    "Ты на верном пути! Қонжық подсказывает: попробуй ещё!",
  ],
  wrong: [
    "Не беда! Қонжық тоже когда-то учился. Идём дальше!",
    "Ошибки — часть пути. Қонжық с тобой! 🐻",
    "Не расстраивайся! Қазақстан большой — всего не запомнить сразу.",
    "Қонжық обнимает тебя 🫂 — двигаемся к следующему!",
  ],
};

function pickMotivation(type: "correct" | "close" | "wrong") {
  const arr = MOTIVATIONS[type];
  return arr[Math.floor(Math.random() * arr.length)];
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
  const [feedback, setFeedback] = useState<{ type: "correct" | "close" | "wrong"; msg: string; points: number; motivation: string; bonus: number } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState<number>(() => loadStreak());
  const [timeLeft, setTimeLeft] = useState(15);
  const QUESTION_TIME = 15;

  const level = LEVELS[levelIdx];
  const question = level?.questions[qIdx];

  // Per-question timer
  useEffect(() => {
    if (screen !== "level" || feedback) return;
    setTimeLeft(QUESTION_TIME);
    const started = Date.now();
    const id = setInterval(() => {
      const left = Math.max(0, QUESTION_TIME - Math.floor((Date.now() - started) / 1000));
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(id);
        // Auto-submit as wrong (timeout)
        setFeedback({
          type: "wrong",
          msg: `⏰ Time's up! The answer was "${question?.answers[0] ?? ""}".`,
          points: 0,
          motivation: pickMotivation("wrong"),
          bonus: 0,
        });
        setHearts((h) => Math.max(0, h - 1));
        setQResults((arr) => {
          const next = [...arr];
          next[qIdx] = "wrong";
          return next;
        });
        sfx.wrong();
      }
    }, 200);
    return () => clearInterval(id);
  }, [screen, qIdx, levelIdx, feedback, question]);

  function startGame() {
    sfx.click();
    const s = bumpStreak();
    setStreak(s);
    setScreen("level");
    setLevelIdx(0);
    setQIdx(0);
    setScore(0);
    setLevelScore(0);
    setLevelCorrect(0);
    setHearts(3);
    setQResults(Array(LEVELS[0].questions.length).fill(null));
    setInput("");
    setFeedback(null);
    setShowHint(false);
  }

  function submit() {
    if (!question || feedback) return;
    const r = checkAnswer(input, question.answers);
    const base = r === "correct" ? 10 : r === "close" ? 5 : 0;
    // Speed bonus: up to +5 for correct, +2 for close
    const bonus =
      r === "correct" ? Math.round((timeLeft / QUESTION_TIME) * 5)
      : r === "close" ? Math.round((timeLeft / QUESTION_TIME) * 2)
      : 0;
    const points = base + bonus;
    const msg =
      r === "correct"
        ? `Correct! ${level.guide} says: "${question.answers[0].toUpperCase()} — well done!"`
        : r === "close"
        ? `So close! The answer was "${question.answers[0]}".`
        : `Not quite. The answer was "${question.answers[0]}".`;
    setFeedback({ type: r, msg, points, motivation: pickMotivation(r), bonus });
    setScore((s) => s + points);
    setLevelScore((s) => s + points);
    setQResults((arr) => {
      const next = [...arr];
      next[qIdx] = r;
      return next;
    });
    if (r === "correct") {
      setLevelCorrect((c) => c + 1);
      sfx.correct();
    } else if (r === "close") {
      sfx.close();
    } else {
      setHearts((h) => Math.max(0, h - 1));
      sfx.wrong();
    }
  }

  function next() {
    sfx.click();
    setFeedback(null);
    setInput("");
    setShowHint(false);
    // Out of hearts → game over (jump straight to finish)
    if (hearts <= 0) {
      sfx.finish();
      setScreen("finish");
      return;
    }
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
      setQResults(Array(LEVELS[levelIdx + 1].questions.length).fill(null));
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
            <img
              src={kzFlag}
              alt="Flag of Kazakhstan"
              className="w-32 md:w-40 rounded-lg shadow-lg mb-6 border border-border object-cover"
              loading="eager"
            />
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
        <div className="flex items-center justify-between mb-4 bg-card rounded-2xl p-3 px-5 gap-3 flex-wrap" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇰🇿</span>
            <div>
              <div className="text-xs font-bold text-muted-foreground">LEVEL {levelIdx + 1} / {LEVELS.length}</div>
              <div className="font-black">{level.city}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Hearts */}
            <div className="flex items-center gap-0.5" title={`${hearts} lives left`} aria-label={`${hearts} hearts`}>
              {[0, 1, 2].map((i) => (
                <span key={i} className={`text-xl transition-all ${i < hearts ? "" : "grayscale opacity-30"}`}>
                  {i < hearts ? "❤️" : "🖤"}
                </span>
              ))}
            </div>
            {/* Streak */}
            {streak > 0 && (
              <div className="flex flex-col items-center" title={`${streak}-day streak`}>
                <div className="text-xl leading-none">🔥</div>
                <div className="text-[10px] font-black text-muted-foreground tabular-nums">{streak}d</div>
              </div>
            )}
            {/* Timer */}
            <div
              className={`flex flex-col items-center min-w-[44px] ${
                feedback ? "opacity-40" : timeLeft <= 5 ? "text-destructive animate-pulse" : ""
              }`}
              title="Time left"
            >
              <div className="text-lg leading-none">⏱</div>
              <div className="text-sm font-black tabular-nums">{timeLeft}s</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-muted-foreground">SCORE</div>
              <div className="font-black text-xl text-accent">{score} ⭐</div>
            </div>
          </div>
        </div>

        {/* Timer bar */}
        <div className="h-1.5 mb-4 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-200 ${timeLeft <= 5 ? "bg-destructive" : "bg-primary"}`}
            style={{ width: `${(timeLeft / QUESTION_TIME) * 100}%` }}
          />
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

        {/* Question progress dots */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {level.questions.map((_, i) => {
            const r = qResults[i];
            const isCurrent = i === qIdx;
            const bg =
              r === "correct"
                ? "bg-[hsl(142_70%_45%)] text-white border-transparent"
                : r === "close"
                ? "bg-[hsl(45_90%_55%)] text-black border-transparent"
                : r === "wrong"
                ? "bg-[hsl(0_75%_55%)] text-white border-transparent"
                : isCurrent
                ? "bg-card border-foreground"
                : "bg-card border-border text-muted-foreground";
            const symbol = r === "correct" ? "✓" : r === "wrong" || r === "close" ? "✗" : i + 1;
            return (
              <div
                key={i}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${bg} ${isCurrent ? "scale-110 ring-2 ring-foreground/20" : ""}`}
                aria-label={`Question ${i + 1} ${r ?? "pending"}`}
              >
                {symbol}
              </div>
            );
          })}
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
              <div className="relative shrink-0">
                <img src={konzhyk} alt="Konzhyk" width={56} height={56} loading="lazy" style={{ width: 56, height: 56 }} className="rounded-full ring-2 ring-secondary/40" />
                <span className="absolute -top-1 -right-1 text-lg" aria-hidden>🤔</span>
              </div>
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
                  placeholder="Ответ на русском, қазақша немесе English..."
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
                    <div className="mt-2 text-lg font-black animate-pop">
                      +{feedback.points} ⭐
                      {feedback.bonus > 0 && (
                        <span className="ml-2 text-sm font-bold opacity-90">(⚡ speed bonus +{feedback.bonus})</span>
                      )}
                    </div>
                  )}
                  {feedback.type === "wrong" && (
                    <div className="mt-2 text-sm font-bold opacity-90">💔 −1 heart · {hearts} left</div>
                  )}
                </div>
                <div className="mb-3">
                  <Konzhyk
                    message={feedback.motivation}
                    size={56}
                    mood={
                      feedback.type === "correct"
                        ? (feedback.bonus >= 4 ? "celebrate" : "happy")
                        : feedback.type === "close"
                        ? "thinking"
                        : "sad"
                    }
                  />
                </div>
                <button
                  onClick={next}
                  className="w-full py-4 rounded-xl font-black text-lg bg-primary text-primary-foreground hover:opacity-90 transition"
                >
                  {hearts <= 0
                    ? "💔 Game Over →"
                    : qIdx + 1 < level.questions.length
                    ? "Next Question →"
                    : "Finish Level →"}
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


