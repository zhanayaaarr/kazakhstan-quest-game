import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
// Реальные фотографии из Wikimedia Commons (свободные лицензии)
const heroBg = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Charyn_Canyon%2C_Kazakhstan_03.jpg/1280px-Charyn_Canyon%2C_Kazakhstan_03.jpg";
const kzFlag = "https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kazakhstan.svg";

// Astana
const astana1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Baiterek_August.jpg/1280px-Baiterek_August.jpg";
const astana2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Khan_Shatyr_shopping_center.jpg/1280px-Khan_Shatyr_shopping_center.jpg";
const astana3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Nur_Astana_Mosque_02.jpg/1280px-Nur_Astana_Mosque_02.jpg";
const astana4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Astana_Opera_02.jpg/1280px-Astana_Opera_02.jpg";
const astana5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Ak_Orda_palace_panorama.jpg/1280px-Ak_Orda_palace_panorama.jpg";
const baiterek = astana1;

// Almaty — все фото Кок-Тобе
const almaty1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Kok_Tobe%2C_Kazakhstan.jpg/1280px-Kok_Tobe%2C_Kazakhstan.jpg";
const almaty2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Almaty%2C_Kok-Tobe2.jpg/1280px-Almaty%2C_Kok-Tobe2.jpg";
const almaty3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Blooming_Sievers_apple_tree_%28M%C3%A1lus_siev%C3%A9rsii%29_in_the_Main_Botanical_Garden_of_Almaty.jpg/1280px-Blooming_Sievers_apple_tree_%28M%C3%A1lus_siev%C3%A9rsii%29_in_the_Main_Botanical_Garden_of_Almaty.jpg";
const almaty4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Big_Almaty_Lake%2C_Trans-Ili_Alatau%2C_Tian_Shan.jpg/1280px-Big_Almaty_Lake%2C_Trans-Ili_Alatau%2C_Tian_Shan.jpg";
const almaty5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Nurly_Tau_%28AP4M2448_1PS%29_%2828456673904%29.jpg/1280px-Nurly_Tau_%28AP4M2448_1PS%29_%2828456673904%29.jpg";
const koktobe = almaty1;

// Turkestan
const turk1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Mausoleum_of_Khoja_Ahmed_Yasavi_in_Turkestan%2C_Kazakhstan.jpg/1280px-Mausoleum_of_Khoja_Ahmed_Yasavi_in_Turkestan%2C_Kazakhstan.jpg";
const turk2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mausoleum_of_Khoja_Ahmed_Yasawi.jpg/1280px-Mausoleum_of_Khoja_Ahmed_Yasawi.jpg";
const turk3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Mausoleum_of_Khoja_Ahmed_Yasawi_in_Hazrat-e_Turkestan%2C_Kazakhstan.jpg/1280px-Mausoleum_of_Khoja_Ahmed_Yasawi_in_Hazrat-e_Turkestan%2C_Kazakhstan.jpg";
const turk4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Mausoleum_of_Khoja_Ahmed_Yasawi_in_Turkistan_2.jpg/1280px-Mausoleum_of_Khoja_Ahmed_Yasawi_in_Turkistan_2.jpg";
const turk5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Mausoleum_of_Khoja_Ahmed_Yasawi_in_Turkistan_5.jpg/1280px-Mausoleum_of_Khoja_Ahmed_Yasawi_in_Turkistan_5.jpg";
const turkestan = turk1;

// Shymkent
const shy1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Ordabasy_Plaza_%28Shymkent%29.jpg/1280px-Ordabasy_Plaza_%28Shymkent%29.jpg";
const shy2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Part_of_Shymkent%27s_Panorama.jpg/1280px-Part_of_Shymkent%27s_Panorama.jpg";
const shy3 = "https://upload.wikimedia.org/wikipedia/commons/e/e1/Shymkent_night_panorama.jpg";
const shy4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Mosque_in_Shymkent.jpg/1280px-Mosque_in_Shymkent.jpg";
const shy5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Mosque_in_Shymkent_2.jpg/1280px-Mosque_in_Shymkent_2.jpg";
const shymkent = shy1;

// Baikonur
const bai1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Soyuz_TMA-09M_spacecraft_at_the_Baikonur_Cosmodrome_launch_pad_%284%29.jpg/1280px-Soyuz_TMA-09M_spacecraft_at_the_Baikonur_Cosmodrome_launch_pad_%284%29.jpg";
const bai2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Soyuz_TMA-13_Edit.jpg/1280px-Soyuz_TMA-13_Edit.jpg";
const bai3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Soyuz_TMA-5_launch.jpg/1280px-Soyuz_TMA-5_launch.jpg";
const bai4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Soyuz_MS-12_backup_crew_goes_to_the_statue_of_Yuri_Gagarin_in_Baikonur.jpg/1280px-Soyuz_MS-12_backup_crew_goes_to_the_statue_of_Yuri_Gagarin_in_Baikonur.jpg";
const bai5 = "https://upload.wikimedia.org/wikipedia/commons/2/2a/Proton_rocket_launch.jpg";
const baikonur = bai1;
import konzhyk from "@/assets/konzhyk.png";
import { AuthGate } from "@/components/AuthGate";
import { supabase } from "@/integrations/supabase/client";
import { getAiHint, getAiJourney, getKazHistoryQuestion, getStudyMaterials } from "@/lib/api/gemini.functions";
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
    <div className="flex items-end gap-3 animate-bounce-in min-w-0">
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
      <div className="relative bg-card border-2 border-border rounded-2xl px-4 py-3 text-sm font-semibold max-w-xs min-w-0"
        style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="absolute -left-2 bottom-4 w-4 h-4 bg-card border-l-2 border-b-2 border-border rotate-45" />
        <span className="break-words">{message}</span>
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
        className="self-start sm:ml-[108px] text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border border-border"
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
                <span className="truncate max-w-[140px] sm:max-w-[180px]">{r.display_name ?? "Anon"}</span>
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
  images: string[];
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
    images: [astana2, astana1, astana3, astana4, astana5],
    guide: "Aisha",
    fact: "Baiterek is 97 meters tall — symbolizing 1997, the year Astana became the capital!",
    questions: [
      { q: "What city is shown in the image? / Какой это город?", answers: ["astana", "nur-sultan", "nursultan", "астана", "нур-султан", "нурсултан"], hint: "It's the capital city of Kazakhstan. / Столица Казахстана." },
      { q: "What is this monument called? / Как называется этот памятник?", answers: ["baiterek", "bayterek", "baiterek tower", "байтерек", "бәйтерек"], hint: "It means 'tall poplar tree' in Kazakh. / Означает 'высокий тополь'." },
      { q: "What is Baiterek a symbol of? / Символом чего является Байтерек?", answers: ["capital", "astana", "kazakhstan capital", "столица", "астана", "столица казахстана"], hint: "It is the symbol of Astana, Kazakhstan's capital." },
      { q: "How tall is Baiterek in meters? / Какова высота Байтерека в метрах?", answers: ["97", "97m", "97 meters", "97 метров"], hint: "Same as the year Astana became capital." },
      { q: "In which year did Astana become the capital? / В каком году Астана стала столицей?", answers: ["1997"], hint: "Look at the tower's height." },
    ],
  },
  {
    city: "Almaty",
    monument: "Kok-Tobe",
    location: "Almaty, southern Kazakhstan",
    image: koktobe,
    images: [almaty1, almaty2, almaty3, almaty4, almaty5],
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
    images: [turk1, turk2, turk3, turk4, turk5],
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
    images: [shy1, shy2, shy3, shy4, shy5],
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
    images: [bai1, bai2, bai3, bai4, bai5],
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
type AiHistoryQuestion = {
  question: string;
  options: string[];
  answer: string;
  hint: string;
  explanation: string;
};
type Lang = "en" | "kk" | "ru";

const LANGUAGE_LABELS: Record<Lang, string> = {
  en: "English",
  kk: "Қазақша",
  ru: "Русский",
};

const I18N: Record<Lang, Record<string, string>> = {
  en: {
    levels: "Levels",
    cities: "Cities",
    leaderboard: "Leaderboard",
    about: "About",
    signedInAs: "Signed in as",
    startPlaying: "Start playing",
    exit: "Exit",
    language: "Language",
    educational: "Educational adventure · 5 levels",
    heroTitleA: "Travel across Kazakhstan.",
    heroTitleB: "Learn its cities, monuments and stories.",
    heroCopy: "A quiet, illustrated quest through Astana, Almaty, Turkestan, Shymkent and Baikonur — answer questions, collect facts, climb the leaderboard.",
    startJourney: "Start the journey",
    howItWorks: "How it works",
    aiTest: "AI test",
    question: "Question",
    questions: "Questions",
    score: "Score",
    level: "Level",
    hint: "Hint",
    aiCoach: "AI coach",
    submitAnswer: "Submit Answer",
    nextQuestion: "Next Question",
    finishLevel: "Finish Level",
    gameOver: "Game Over",
    backToMenu: "Back to menu",
    close: "Close",
    generating: "Generating a new question...",
    correct: "Correct",
    closeAnswer: "Close",
    notQuite: "Not quite",
    correctAnswer: "Correct answer",
    nextAiQuestion: "Next question",
    resetHistory: "Reset history",
    aiHistoryTitle: "AI history test",
    kazHistory: "Kazakhstan history",
    answerPlaceholder: "Answer in English, қазақша немесе русском...",
    resultSaved: "Result saved to leaderboard",
    savingResult: "Saving result...",
    journeyComplete: "Journey complete",
    topExplorers: "Top 10 explorers",
    loading: "Loading...",
  },
  kk: {
    levels: "Деңгейлер",
    cities: "Қалалар",
    leaderboard: "Көшбасшылар",
    about: "Туралы",
    signedInAs: "Кірген аккаунт",
    startPlaying: "Ойынды бастау",
    exit: "Шығу",
    language: "Тіл",
    educational: "Оқу саяхаты · 5 деңгей",
    heroTitleA: "Қазақстанды арала.",
    heroTitleB: "Қалаларын, ескерткіштерін және тарихын үйрен.",
    heroCopy: "Астана, Алматы, Түркістан, Шымкент және Байқоңыр бойынша тыныш оқу квесті — сұрақтарға жауап бер, деректер жина, көшбасшыларға көтеріл.",
    startJourney: "Саяхатты бастау",
    howItWorks: "Қалай ойнау",
    aiTest: "AI тест",
    question: "Сұрақ",
    questions: "Сұрақтар",
    score: "Ұпай",
    level: "Деңгей",
    hint: "Көмек",
    aiCoach: "AI көмекші",
    submitAnswer: "Жауап беру",
    nextQuestion: "Келесі сұрақ",
    finishLevel: "Деңгейді аяқтау",
    gameOver: "Ойын аяқталды",
    backToMenu: "Мәзірге қайту",
    close: "Жабу",
    generating: "Жаңа сұрақ жасалып жатыр...",
    correct: "Дұрыс",
    closeAnswer: "Жақын",
    notQuite: "Дұрыс емес",
    correctAnswer: "Дұрыс жауап",
    nextAiQuestion: "Келесі сұрақ",
    resetHistory: "Тарихты тазалау",
    aiHistoryTitle: "AI тарих тесті",
    kazHistory: "Қазақстан тарихы",
    answerPlaceholder: "Жауапты қазақша, English немесе русском жазыңыз...",
    resultSaved: "Нәтиже көшбасшылар тізіміне сақталды",
    savingResult: "Нәтиже сақталуда...",
    journeyComplete: "Саяхат аяқталды",
    topExplorers: "Үздік 10 ойыншы",
    loading: "Жүктелуде...",
  },
  ru: {
    levels: "Уровни",
    cities: "Города",
    leaderboard: "Лидеры",
    about: "О проекте",
    signedInAs: "Вход выполнен",
    startPlaying: "Начать игру",
    exit: "Выйти",
    language: "Язык",
    educational: "Обучающее приключение · 5 уровней",
    heroTitleA: "Путешествуй по Казахстану.",
    heroTitleB: "Изучай города, памятники и истории.",
    heroCopy: "Спокойный иллюстрированный квест по Астане, Алматы, Туркестану, Шымкенту и Байконуру — отвечай на вопросы, собирай факты, поднимайся в таблице лидеров.",
    startJourney: "Начать путешествие",
    howItWorks: "Как играть",
    aiTest: "AI тест",
    question: "Вопрос",
    questions: "Вопросы",
    score: "Счет",
    level: "Уровень",
    hint: "Подсказка",
    aiCoach: "AI помощник",
    submitAnswer: "Ответить",
    nextQuestion: "Следующий вопрос",
    finishLevel: "Завершить уровень",
    gameOver: "Игра окончена",
    backToMenu: "Назад в меню",
    close: "Закрыть",
    generating: "Генерирую новый вопрос...",
    correct: "Верно",
    closeAnswer: "Почти",
    notQuite: "Не совсем",
    correctAnswer: "Правильный ответ",
    nextAiQuestion: "Следующий вопрос",
    resetHistory: "Сбросить историю",
    aiHistoryTitle: "AI тест по истории",
    kazHistory: "История Казахстана",
    answerPlaceholder: "Ответ на русском, қазақша немесе English...",
    resultSaved: "Результат сохранен в таблицу лидеров",
    savingResult: "Сохраняю результат...",
    journeyComplete: "Путешествие завершено",
    topExplorers: "Топ-10 игроков",
    loading: "Загрузка...",
  },
};

function splitQuestionText(text: string, lang: Lang) {
  const [en, other] = text.split(" / ");
  if (lang === "en") return en;
  return other || en;
}

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

type CityStat = {
  city: string;
  attempts: number;
  correct: number;
  questions: number;
  bestPoints: number;
  totalPoints: number;
  lastPlayed: string;
};

type ProfileRow = {
  best_score: number;
  display_name: string | null;
  email: string | null;
  rank: string | null;
};

type UserResult = {
  id: string;
  score: number;
  rank: string | null;
  created_at: string;
  levels_completed: number;
};

const PROFILE_COPY: Record<Lang, Record<string, string>> = {
  en: {
    account: "My account",
    playerProfile: "Player profile",
    progress: "Progress",
    gamesPlayed: "Games played",
    bestScore: "Best score",
    completedLevels: "Completed levels",
    strongCities: "Best cities",
    weakCities: "Needs practice",
    noRuns: "Play one full level to collect city stats.",
    aiMaterials: "AI materials",
    loadingMaterials: "Preparing materials...",
    close: "Close",
    recentRuns: "Recent runs",
    cityProgress: "City progress",
  },
  kk: {
    account: "Менің аккаунтым",
    playerProfile: "Ойыншы профилі",
    progress: "Прогресс",
    gamesPlayed: "Ойын саны",
    bestScore: "Ең жақсы ұпай",
    completedLevels: "Өткен деңгейлер",
    strongCities: "Жақсы қалалар",
    weakCities: "Қайталау керек",
    noRuns: "Қала статистикасын жинау үшін бір деңгейді ойнап шық.",
    aiMaterials: "AI материалдар",
    loadingMaterials: "Материал дайындалуда...",
    close: "Жабу",
    recentRuns: "Соңғы ойындар",
    cityProgress: "Қала прогресі",
  },
  ru: {
    account: "Мой аккаунт",
    playerProfile: "Профиль игрока",
    progress: "Прогресс",
    gamesPlayed: "Игр сыграно",
    bestScore: "Лучший счет",
    completedLevels: "Пройдено уровней",
    strongCities: "Лучшие города",
    weakCities: "Надо подтянуть",
    noRuns: "Пройди хотя бы один уровень, чтобы собрать статистику по городам.",
    aiMaterials: "AI материалы",
    loadingMaterials: "Готовлю материалы...",
    close: "Закрыть",
    recentRuns: "Последние игры",
    cityProgress: "Прогресс по городам",
  },
};

function cityStatsKey(userId: string) {
  return `kq_city_stats_${userId}`;
}

function loadCityStats(userId: string): CityStat[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(cityStatsKey(userId)) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCityStats(userId: string, stats: CityStat[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(cityStatsKey(userId), JSON.stringify(stats));
}

function recordCityStats(userId: string, level: Level, correct: number, points: number) {
  const stats = loadCityStats(userId);
  const current = stats.find((item) => item.city === level.city);
  const next: CityStat = {
    city: level.city,
    attempts: (current?.attempts ?? 0) + 1,
    correct: (current?.correct ?? 0) + correct,
    questions: (current?.questions ?? 0) + level.questions.length,
    bestPoints: Math.max(current?.bestPoints ?? 0, points),
    totalPoints: (current?.totalPoints ?? 0) + points,
    lastPlayed: new Date().toISOString(),
  };
  saveCityStats(userId, [next, ...stats.filter((item) => item.city !== level.city)]);
}

function accuracy(stat: CityStat) {
  return stat.questions > 0 ? Math.round((stat.correct / stat.questions) * 100) : 0;
}

const QUESTION_IMAGES_KEY = "kq_last_question_images";

function getQuestionImagePool(level: Level, questionIndex: number) {
  if (level.city === "Astana") {
    if (questionIndex === 0) return level.images;
    if (questionIndex === 1 || questionIndex === 2 || questionIndex === 3 || questionIndex === 4) return [astana1];
  }

  if (level.city === "Almaty") {
    if (questionIndex === 1) return [almaty1, almaty2];
    if (questionIndex === 2) return [almaty3];
    if (questionIndex === 3) return [almaty4];
    return level.images;
  }

  return level.images.length > 0 ? level.images : [level.image];
}

function pickImage(pool: string[], previous?: string) {
  const unique = [...new Set(pool.filter(Boolean))];
  const choices = previous && unique.length > 1 ? unique.filter((image) => image !== previous) : unique;
  return choices[Math.floor(Math.random() * choices.length)] ?? unique[0] ?? "";
}

function createQuestionImages(levels: Level[]) {
  let previous: string[][] = [];
  if (typeof window !== "undefined") {
    try {
      previous = JSON.parse(localStorage.getItem(QUESTION_IMAGES_KEY) ?? "[]");
    } catch {
      previous = [];
    }
  }

  const next = levels.map((level, levelIndex) =>
    level.questions.map((_, questionIndex) =>
      pickImage(getQuestionImagePool(level, questionIndex), previous[levelIndex]?.[questionIndex]),
    ),
  );

  if (typeof window !== "undefined") {
    localStorage.setItem(QUESTION_IMAGES_KEY, JSON.stringify(next));
  }

  return next;
}

function Game({ session }: { session: import("@supabase/supabase-js").Session }) {
  const userEmail = session.user.email ?? "Signed-in user";
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem("kq_language");
    return saved === "kk" || saved === "ru" || saved === "en" ? saved : "en";
  });
  const [screen, setScreen] = useState<Screen>("start");
  const [journeyLevels, setJourneyLevels] = useState<Level[]>(LEVELS);
  const [journeyBusy, setJourneyBusy] = useState(false);
  const [journeyError, setJourneyError] = useState<string | null>(null);
  const [questionImages, setQuestionImages] = useState<string[][]>(() =>
    LEVELS.map((level) => level.questions.map((_, questionIndex) => level.images[questionIndex] ?? level.image)),
  );
  const [levelIdx, setLevelIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [levelCorrect, setLevelCorrect] = useState(0);
  const [qResults, setQResults] = useState<Array<"correct" | "close" | "wrong" | null>>([]);
  const [feedback, setFeedback] = useState<{ type: "correct" | "close" | "wrong"; msg: string; points: number; motivation: string; bonus: number } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [historyTestOpen, setHistoryTestOpen] = useState(false);
  const [historyQuestion, setHistoryQuestion] = useState<AiHistoryQuestion | null>(null);
  const [historySeen, setHistorySeen] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("kq_ai_history_seen") ?? "[]");
    } catch {
      return [];
    }
  });
  const [historySelected, setHistorySelected] = useState<string | null>(null);
  const [historyAnswered, setHistoryAnswered] = useState(false);
  const [historyShowHint, setHistoryShowHint] = useState(false);
  const [historyBusy, setHistoryBusy] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState<number>(() => loadStreak());
  const [timeLeft, setTimeLeft] = useState(25);
  const QUESTION_TIME = 25;

  const level = journeyLevels[levelIdx] ?? LEVELS[0];
  const question = level?.questions[qIdx];
  const t = I18N[lang];

  function changeLanguage(nextLang: Lang) {
    setLang(nextLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("kq_language", nextLang);
    }
    setHistoryQuestion(null);
    setHistorySelected(null);
    setHistoryAnswered(false);
    setHistoryShowHint(false);
  }

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

  function rememberJourneyCities(levels: Level[]) {
    if (typeof window === "undefined") return;
    try {
      const previous = JSON.parse(localStorage.getItem("kq_ai_journey_cities") ?? "[]");
      const current = Array.isArray(previous) ? previous : [];
      const next = [...levels.map((item) => item.city), ...current].filter(Boolean).slice(0, 20);
      localStorage.setItem("kq_ai_journey_cities", JSON.stringify([...new Set(next)]));
    } catch {
      localStorage.setItem("kq_ai_journey_cities", JSON.stringify(levels.map((item) => item.city)));
    }
  }

  function loadJourneyCityHistory() {
    if (typeof window === "undefined") return [];
    try {
      const previous = JSON.parse(localStorage.getItem("kq_ai_journey_cities") ?? "[]");
      return Array.isArray(previous) ? previous.filter((item) => typeof item === "string") : [];
    } catch {
      return [];
    }
  }

  async function startGame() {
    if (journeyBusy) return;
    sfx.click();
    setJourneyBusy(true);
    setJourneyError(null);
    let nextLevels = LEVELS;
    try {
      const result = await getAiJourney({
        data: {
          language: lang,
          excludeCities: loadJourneyCityHistory(),
        },
      });
      nextLevels = result.levels as Level[];
      setJourneyLevels(nextLevels);
      rememberJourneyCities(nextLevels);
    } catch (err: any) {
      setJourneyError(err.message ?? "AI journey is unavailable right now. Starting the classic journey.");
      setJourneyLevels(LEVELS);
      nextLevels = LEVELS;
    } finally {
      setJourneyBusy(false);
    }

    const s = bumpStreak();
    setQuestionImages(createQuestionImages(nextLevels));
    setStreak(s);
    setScreen("level");
    setLevelIdx(0);
    setQIdx(0);
    setScore(0);
    setLevelScore(0);
    setLevelCorrect(0);
    setHearts(5);
    setQResults(Array(nextLevels[0].questions.length).fill(null));
    setInput("");
    setFeedback(null);
    setShowHint(false);
    setAiHint(null);
    setAiError(null);
    setAiBusy(false);
  }

  async function askAiCoach() {
    if (!question || aiBusy) return;
    setAiError(null);
    setAiBusy(true);
    try {
      const result = await getAiHint({
        data: {
          city: level.city,
          monument: level.monument,
          question: question.q,
          currentHint: question.hint,
        },
      });
      setAiHint(result.hint);
    } catch (err: any) {
      setAiError(err.message ?? "AI hint is unavailable right now.");
    } finally {
      setAiBusy(false);
    }
  }

  function rememberHistoryQuestion(questionText: string) {
    setHistorySeen((current) => {
      const next = [questionText, ...current.filter((item) => item !== questionText)].slice(0, 30);
      if (typeof window !== "undefined") {
        localStorage.setItem("kq_ai_history_seen", JSON.stringify(next));
      }
      return next;
    });
  }

  async function loadHistoryQuestion(excludeOverride?: string[]) {
    setHistoryBusy(true);
    setHistoryError(null);
    setHistorySelected(null);
    setHistoryAnswered(false);
    setHistoryShowHint(false);
    try {
      const result = await getKazHistoryQuestion({
        data: {
          excludeQuestions: excludeOverride ?? historySeen,
          language: lang,
        },
      });
      setHistoryQuestion(result);
      rememberHistoryQuestion(result.question);
    } catch (err: any) {
      setHistoryError(err.message ?? "AI test is unavailable right now.");
    } finally {
      setHistoryBusy(false);
    }
  }

  function openHistoryTest() {
    sfx.click();
    setHistoryTestOpen(true);
    if (!historyQuestion) {
      void loadHistoryQuestion();
    }
  }

  function closeHistoryTest() {
    sfx.click();
    setHistoryTestOpen(false);
  }

  function answerHistoryQuestion(option: string) {
    if (historyAnswered) return;
    setHistorySelected(option);
    setHistoryAnswered(true);
    if (option === historyQuestion?.answer) {
      sfx.correct();
    } else {
      sfx.wrong();
    }
  }

  function resetHistoryQuestions() {
    const next: string[] = [];
    setHistorySeen(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("kq_ai_history_seen", JSON.stringify(next));
    }
    void loadHistoryQuestion(next);
  }

  function backToMenu() {
    sfx.click();
    setFeedback(null);
    setInput("");
    setShowHint(false);
    setAiHint(null);
    setAiError(null);
    setAiBusy(false);
    setScreen("start");
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
        ? `${t.correct}! ${level.guide}: "${question.answers[0].toUpperCase()}"`
        : r === "close"
        ? `${t.closeAnswer}! ${t.correctAnswer}: "${question.answers[0]}".`
        : `${t.notQuite}. ${t.correctAnswer}: "${question.answers[0]}".`;
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
    setAiHint(null);
    setAiError(null);
    setAiBusy(false);
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
      const perfectBonus = levelCorrect === level.questions.length ? 20 : 0;
      recordCityStats(session.user.id, level, levelCorrect, levelScore + perfectBonus);
      if (levelCorrect === level.questions.length) {
        setScore((s) => s + 20);
        setLevelScore((s) => s + 20);
      }
      setScreen("result");
    }
  }

  function nextLevel() {
    sfx.click();
    if (levelIdx + 1 < journeyLevels.length) {
      setLevelIdx((i) => i + 1);
      setQIdx(0);
      setLevelScore(0);
      setLevelCorrect(0);
      setQResults(Array(journeyLevels[levelIdx + 1].questions.length).fill(null));
      setAiHint(null);
      setAiError(null);
      setAiBusy(false);
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
        <nav className="min-h-16 px-4 py-3 md:px-10 flex flex-wrap items-center justify-between gap-3 border-b border-border">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-xl">🇰🇿</span>
            <span>Kazakhstan Quest</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <span>{t.levels}</span>
            <span>{t.cities}</span>
            <span>{t.leaderboard}</span>
            <span>{t.about}</span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <select
              value={lang}
              onChange={(event) => changeLanguage(event.target.value as Lang)}
              className="rounded-lg border border-border bg-background px-2 py-2 text-sm font-medium"
              aria-label={t.language}
            >
              {(Object.keys(LANGUAGE_LABELS) as Lang[]).map((code) => (
                <option key={code} value={code}>
                  {LANGUAGE_LABELS[code]}
                </option>
              ))}
            </select>
            <div className="hidden sm:block max-w-[220px] truncate text-xs text-muted-foreground" title={userEmail}>
              {t.signedInAs} {userEmail}
            </div>
            <button
              onClick={startGame}
              disabled={journeyBusy}
              className="hidden md:inline-flex items-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-[#0d1218] transition-colors disabled:opacity-60"
            >
              {journeyBusy ? t.generating : t.startPlaying}
            </button>
            <button
              onClick={() => setProfileOpen(true)}
              className="inline-flex items-center px-4 py-2.5 rounded-lg bg-background text-foreground text-sm font-medium border border-border hover:bg-secondary transition-colors"
            >
              {PROFILE_COPY[lang].account}
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Sign out"
            >
              🚪 {t.exit}
            </button>
          </div>
        </nav>

        {/* Hero band */}
        <section className="px-4 sm:px-6 md:px-10 py-10 sm:py-14 md:py-24 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <img
              src={kzFlag}
              alt="Flag of Kazakhstan"
              className="w-32 md:w-40 rounded-lg shadow-lg mb-6 border border-border object-cover"
              loading="eager"
            />
            <div className="text-xs font-medium tracking-wide text-muted-foreground mb-6 uppercase">
              {t.educational}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.08] tracking-tight">
              {t.heroTitleA}<br />
              <span className="text-muted-foreground">{t.heroTitleB}</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground max-w-xl">
              {t.heroCopy}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button
                onClick={startGame}
                disabled={journeyBusy}
                className="w-full sm:w-auto px-6 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-[#0d1218] transition-colors disabled:opacity-60"
              >
                {journeyBusy ? t.generating : t.startJourney}
              </button>
            </div>
            {journeyError && (
              <div className="mt-4 max-w-xl rounded-lg bg-destructive/15 p-3 text-sm font-semibold text-destructive">
                {journeyError}
              </div>
            )}
            <div className="mt-4">
              <button
                onClick={openHistoryTest}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:opacity-90 transition-colors"
              >
                {t.aiTest}
              </button>
            </div>
            <div className="mt-10">
              <KonzhykFacts />
            </div>

          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-xl overflow-hidden border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
              <img src={heroBg} alt="Kazakhstan panorama" className="w-full h-56 sm:h-[320px] object-cover" />
            </div>
            <MiniLeaderboard />
          </div>
        </section>

        {/* Signature cards row with city previews */}
        <section className="px-4 sm:px-6 md:px-10 pb-16 sm:pb-24 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {historyTestOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 sm:p-4">
            <div className="max-h-[calc(100vh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-4 sm:p-6 shadow-2xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{t.aiHistoryTitle}</div>
                  <h2 className="text-2xl font-medium tracking-tight">{t.kazHistory}</h2>
                </div>
                <button
                  onClick={closeHistoryTest}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={t.close}
                >
                  {t.close}
                </button>
              </div>

              {historyBusy && (
                <div className="rounded-lg border border-border bg-muted p-5 text-sm font-medium">
                  {t.generating}
                </div>
              )}

              {historyError && (
                <div className="rounded-lg bg-destructive/15 p-4 text-sm font-semibold text-destructive">
                  {historyError}
                </div>
              )}

              {!historyBusy && historyQuestion && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-background p-4">
                    <div className="text-sm font-semibold leading-relaxed">{historyQuestion.question}</div>
                  </div>

                  <div className="grid gap-2">
                    {historyQuestion.options.map((option) => {
                      const isCorrect = historyAnswered && option === historyQuestion.answer;
                      const isWrong = historyAnswered && option === historySelected && option !== historyQuestion.answer;
                      return (
                        <button
                          key={option}
                          onClick={() => answerHistoryQuestion(option)}
                          disabled={historyAnswered}
                          className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition ${
                            isCorrect
                              ? "border-success bg-success text-success-foreground"
                              : isWrong
                              ? "border-destructive bg-destructive text-destructive-foreground"
                              : "border-border bg-background hover:bg-secondary"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {historyShowHint && (
                    <div className="rounded-lg bg-secondary/30 p-3 text-sm font-semibold">
                      {t.hint}: {historyQuestion.hint}
                    </div>
                  )}

                  {historyAnswered && (
                    <div className="rounded-lg border border-border p-3 text-sm">
                      <div className="font-semibold">
                        {historySelected === historyQuestion.answer ? `${t.correct}.` : `${t.correctAnswer}: ${historyQuestion.answer}`}
                      </div>
                      <div className="mt-1 text-muted-foreground">{historyQuestion.explanation}</div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => setHistoryShowHint(true)}
                      disabled={historyShowHint || historyAnswered}
                      className="rounded-lg bg-muted px-4 py-2 text-sm font-semibold hover:bg-secondary disabled:opacity-50"
                    >
                      {t.hint}
                    </button>
                    <button
                      onClick={() => loadHistoryQuestion()}
                      disabled={historyBusy}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                    >
                      {t.nextAiQuestion}
                    </button>
                    <button
                      onClick={resetHistoryQuestions}
                      disabled={historyBusy}
                      className="rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                    >
                      {t.resetHistory}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {profileOpen && (
          <PlayerProfileModal
            session={session}
            lang={lang}
            onClose={() => setProfileOpen(false)}
          />
        )}

        {/* Footer hairline */}
        <div className="mt-auto border-t border-border px-4 sm:px-6 md:px-10 py-6 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 sm:justify-between">
          <span>© Kazakhstan Quest</span>
          <span>5 levels · 25 questions · 1 epic journey</span>
        </div>

      </div>
    );
  }


  // ============ FINISH ============
  if (screen === "finish") {
    const rank = getRank(score);
    return <FinishScreen score={score} rank={rank} session={session} lang={lang} levelsCompleted={journeyLevels.length} onReplay={() => setScreen("start")} />;
  }

  // ============ LEVEL RESULT ============
  if (screen === "result") {
    const perfect = levelCorrect === level.questions.length;
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background">
        <div className="bg-card rounded-xl p-5 sm:p-8 max-w-xl w-full animate-bounce-in border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="mb-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">{t.level} {levelIdx + 1}</div>
            <h2 className="text-3xl font-normal tracking-tight">{level.city}</h2>
            <p className="text-muted-foreground">{level.monument}</p>
          </div>

          <img src={questionImages[levelIdx]?.[0] ?? level.image} alt={level.monument} className="w-full h-44 sm:h-56 object-cover rounded-lg mb-4" width={1024} height={1024} />

          <div className="rounded-lg p-4 mb-3 border border-border">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Location</div>
            <div className="font-medium">{level.location}</div>
          </div>

          <div className="rounded-lg p-5 mb-4" style={{ backgroundColor: "var(--signature-cream)", color: "#181d26" }}>
            <div className="text-xs uppercase tracking-wide opacity-70 mb-1">Fun fact</div>
            <div className="text-lg leading-snug">{level.fact}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="rounded-lg p-3 border border-border text-center">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Correct</div>
              <div className="text-2xl font-medium">{levelCorrect}/{level.questions.length}</div>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "var(--signature-mint)", color: "#0a2e0e" }}>
              <div className="text-xs uppercase tracking-wide opacity-70">{t.score}</div>
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
            {levelIdx + 1 < journeyLevels.length ? `${t.nextQuestion} ${levelIdx + 2} →` : `${t.finishLevel} →`}
          </button>
          <button
            onClick={backToMenu}
            className="w-full mt-2 py-3 rounded-lg font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {t.backToMenu}
          </button>
        </div>
      </div>
    );
  }


  // ============ LEVEL ============
  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <button
        onClick={backToMenu}
        className="z-40 mb-3 inline-flex items-center rounded-lg bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm border border-border hover:bg-secondary transition-colors md:fixed md:left-4 md:top-24 md:mb-0 md:px-4"
      >
        {t.backToMenu}
      </button>
      <div className="max-w-3xl mx-auto">
        {/* HUD */}
        <div className="flex items-start sm:items-center justify-between mb-4 bg-card rounded-2xl p-3 sm:px-5 gap-3 flex-wrap" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl">🇰🇿</span>
            <div>
              <div className="text-xs font-bold text-muted-foreground">{t.level.toUpperCase()} {levelIdx + 1} / {journeyLevels.length}</div>
              <div className="font-black">{level.city}</div>
              <div className="max-w-[180px] truncate text-[11px] text-muted-foreground" title={userEmail}>
                {userEmail}
              </div>
            </div>
          </div>
          <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2 sm:gap-4 flex-wrap">
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
              <div className="text-xs font-bold text-muted-foreground">{t.score.toUpperCase()}</div>
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
        <div className="flex gap-2 mb-4 justify-start sm:justify-center overflow-x-auto pb-1">
          {journeyLevels.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i === levelIdx ? "w-10 bg-primary" : i < levelIdx ? "w-6 bg-success" : "w-6 bg-muted"}`}
            />
          ))}
        </div>

        {/* Question progress dots */}
        <div className="flex items-center justify-start sm:justify-center gap-2 mb-3 overflow-x-auto pb-1">
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
        <div className="bg-card rounded-xl sm:rounded-3xl overflow-hidden mb-4" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="relative">
            <img key={`${levelIdx}-${qIdx}-${questionImages[levelIdx]?.[qIdx] ?? ""}`} src={questionImages[levelIdx]?.[qIdx] ?? level.images[qIdx] ?? level.image} alt="Mystery location" className="w-full h-56 sm:h-72 md:h-96 object-contain bg-muted" width={1024} height={1024} loading="eager" />
            <div className="absolute top-3 left-3 bg-card/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold">
              📷 {t.question} {qIdx + 1} / {level.questions.length}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {/* NPC guide */}
            <div className="flex items-start gap-3 mb-4 p-3 rounded-2xl bg-muted">
              <div className="relative shrink-0">
                <img src={konzhyk} alt="Konzhyk" width={56} height={56} loading="lazy" style={{ width: 56, height: 56 }} className="rounded-full ring-2 ring-secondary/40" />
                <span className="absolute -top-1 -right-1 text-lg" aria-hidden>🤔</span>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-muted-foreground">KONZHYK with {level.guide.toUpperCase()}</div>
                <div className="font-bold">{splitQuestionText(question.q, lang)}</div>
              </div>
            </div>

            {!feedback ? (
              <>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder={t.answerPlaceholder}
                  autoFocus
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl bg-input border-2 border-border focus:border-primary focus:outline-none text-base sm:text-lg font-semibold"
                />
                {showHint && (
                  <div className="mt-3 p-3 rounded-xl bg-secondary/30 text-sm font-semibold animate-bounce-in">
                    💡 {t.hint}: {question.hint}
                  </div>
                )}
                {aiHint && (
                  <div className="mt-3 p-3 rounded-xl border border-border bg-card text-sm font-semibold animate-bounce-in">
                    {t.aiCoach}: {aiHint}
                  </div>
                )}
                {aiError && (
                  <div className="mt-3 p-3 rounded-xl bg-destructive/15 text-destructive text-sm font-semibold">
                    {aiError}
                  </div>
                )}
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => setShowHint(true)}
                    disabled={showHint}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold bg-muted hover:bg-secondary/40 transition disabled:opacity-50"
                  >
                    💡 {t.hint}
                  </button>
                  <button
                    onClick={askAiCoach}
                    disabled={aiBusy}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold bg-secondary text-secondary-foreground hover:opacity-90 transition disabled:opacity-50"
                  >
                    {aiBusy ? "AI..." : t.aiCoach}
                  </button>
                  <button
                    onClick={submit}
                    disabled={!input.trim()}
                    className="w-full sm:flex-1 sm:min-w-[180px] py-3 rounded-xl font-black text-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40"
                  >
                    {t.submitAnswer}
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
                    {feedback.type === "correct" ? `✅ ${t.correct}!` : feedback.type === "close" ? `🤏 ${t.closeAnswer}!` : `❌ ${t.notQuite}`}
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
                    ? `💔 ${t.gameOver} →`
                    : qIdx + 1 < level.questions.length
                    ? `${t.nextQuestion} →`
                    : `${t.finishLevel} →`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerProfileModal({
  session,
  lang,
  onClose,
}: {
  session: import("@supabase/supabase-js").Session;
  lang: Lang;
  onClose: () => void;
}) {
  const copy = PROFILE_COPY[lang];
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [results, setResults] = useState<UserResult[]>([]);
  const [cityStats, setCityStats] = useState<CityStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<string | null>(null);
  const [materialsCity, setMaterialsCity] = useState<string | null>(null);
  const [materialsBusy, setMaterialsBusy] = useState(false);
  const [materialsError, setMaterialsError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const userId = session.user.id;
      const [{ data: profileData }, { data: resultData }] = await Promise.all([
        supabase
          .from("profiles")
          .select("best_score, display_name, email, rank")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("game_results")
          .select("id, score, rank, created_at, levels_completed")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

      if (!alive) return;
      setProfile((profileData ?? null) as ProfileRow | null);
      setResults((resultData ?? []) as UserResult[]);
      setCityStats(loadCityStats(userId));
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [session.user.id]);

  const cityRows = LEVELS.map((level) => {
    const stat = cityStats.find((item) => item.city === level.city);
    return {
      city: level.city,
      monument: level.monument,
      location: level.location,
      attempts: stat?.attempts ?? 0,
      correct: stat?.correct ?? 0,
      questions: stat?.questions ?? 0,
      bestPoints: stat?.bestPoints ?? 0,
      percent: stat ? accuracy(stat) : 0,
    };
  });

  const practicedCities = cityRows.filter((item) => item.attempts > 0);
  const strongCities = [...practicedCities].sort((a, b) => b.percent - a.percent || b.bestPoints - a.bestPoints).slice(0, 2);
  const weakCities = [...cityRows].sort((a, b) => a.percent - b.percent || a.attempts - b.attempts).slice(0, 2);
  const targetCity = weakCities[0] ?? cityRows[0];
  const bestScore = profile?.best_score ?? Math.max(0, ...results.map((item) => item.score));
  const completedLevels = results.reduce((sum, item) => sum + (item.levels_completed ?? 0), 0);

  async function loadMaterials(city: string) {
    const level = LEVELS.find((item) => item.city === city) ?? LEVELS[0];
    setMaterialsBusy(true);
    setMaterialsError(null);
    setMaterials(null);
    setMaterialsCity(city);
    try {
      const result = await getStudyMaterials({
        data: {
          city,
          language: lang,
          weakAreas: [level.monument, level.location],
          bestScore,
        },
      });
      setMaterials(result.materials);
    } catch (err: any) {
      setMaterialsError(err.message ?? "AI materials are unavailable right now.");
    } finally {
      setMaterialsBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 sm:p-4">
      <div className="max-h-[calc(100vh-1.5rem)] w-full max-w-4xl overflow-y-auto rounded-xl border border-border bg-card p-4 sm:p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{copy.account}</div>
            <h2 className="text-2xl font-medium tracking-tight">{copy.playerProfile}</h2>
            <p className="mt-1 truncate text-sm text-muted-foreground">{profile?.email ?? session.user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={copy.close}
          >
            {copy.close}
          </button>
        </div>

        {loading ? (
          <div className="rounded-lg border border-border bg-muted p-5 text-sm font-medium">{I18N[lang].loading}</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-4">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{copy.gamesPlayed}</div>
                  <div className="mt-2 text-3xl font-semibold tabular-nums">{results.length}</div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{copy.bestScore}</div>
                  <div className="mt-2 text-3xl font-semibold tabular-nums">{bestScore}</div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{copy.completedLevels}</div>
                  <div className="mt-2 text-3xl font-semibold tabular-nums">{completedLevels}</div>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Rank</div>
                  <div className="mt-2 text-base font-semibold">{profile?.rank ?? getRank(bestScore).name}</div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4">
                <div className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">{copy.strongCities}</div>
                {strongCities.length === 0 ? (
                  <div className="text-sm text-muted-foreground">{copy.noRuns}</div>
                ) : (
                  <div className="space-y-2">
                    {strongCities.map((item) => (
                      <div key={item.city} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
                        <span className="font-semibold">{item.city}</span>
                        <span className="tabular-nums">{item.percent}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-border p-4">
                <div className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">{copy.weakCities}</div>
                <div className="space-y-2">
                  {weakCities.map((item) => (
                    <button
                      key={item.city}
                      onClick={() => loadMaterials(item.city)}
                      className="flex w-full items-center justify-between rounded-lg bg-background px-3 py-2 text-left text-sm hover:bg-secondary"
                    >
                      <span>
                        <span className="block font-semibold">{item.city}</span>
                        <span className="block text-xs text-muted-foreground">{item.monument}</span>
                      </span>
                      <span className="tabular-nums">{item.percent}%</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{copy.cityProgress}</div>
                  <button
                    onClick={() => loadMaterials(targetCity.city)}
                    disabled={materialsBusy}
                    className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    {materialsBusy ? copy.loadingMaterials : copy.aiMaterials}
                  </button>
                </div>
                <div className="space-y-3">
                  {cityRows.map((item) => (
                    <div key={item.city}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-semibold">{item.city}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {item.correct}/{item.questions || LEVELS.find((level) => level.city === item.city)?.questions.length || 5}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${item.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border p-4">
                <div className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
                  {copy.aiMaterials}{materialsCity ? ` · ${materialsCity}` : ""}
                </div>
                {materialsError && <div className="rounded-lg bg-destructive/15 p-3 text-sm font-semibold text-destructive">{materialsError}</div>}
                {materialsBusy && <div className="rounded-lg bg-muted p-3 text-sm font-medium">{copy.loadingMaterials}</div>}
                {!materialsBusy && !materials && !materialsError && (
                  <div className="text-sm text-muted-foreground">{copy.noRuns}</div>
                )}
                {materials && <div className="whitespace-pre-line text-sm leading-relaxed">{materials}</div>}
              </div>

              <div className="rounded-lg border border-border p-4">
                <div className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">{copy.recentRuns}</div>
                {results.length === 0 ? (
                  <div className="text-sm text-muted-foreground">{copy.noRuns}</div>
                ) : (
                  <div className="divide-y divide-border">
                    {results.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 text-sm">
                        <span className="text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                        <span className="font-semibold tabular-nums">{item.score}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type Result = { id: string; display_name: string | null; score: number; rank: string | null; created_at: string };

function FinishScreen({
  score,
  rank,
  session,
  lang,
  levelsCompleted,
  onReplay,
}: {
  score: number;
  rank: { name: string; emoji: string };
  session: import("@supabase/supabase-js").Session;
  lang: Lang;
  levelsCompleted: number;
  onReplay: () => void;
}) {
  const t = I18N[lang];
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
        levels_completed: levelsCompleted,
      });

      const { data: top } = await supabase
        .from("game_results")
        .select("id, display_name, score, rank, created_at")
        .order("score", { ascending: false })
        .limit(10);

      setResults((top ?? []) as Result[]);
      setSaved(true);
    })();
  }, [score, rank.name, session.user.id, session.user.email, levelsCompleted]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div
        className="bg-card rounded-xl max-w-lg w-full border border-border animate-bounce-in flex flex-col max-h-none sm:max-h-[calc(100vh-3rem)]"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Sticky score header */}
        <div className="p-5 sm:p-8 pb-4 shrink-0 border-b border-border bg-card rounded-t-xl">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3 animate-fade-in">{t.journeyComplete}</div>
          <h2 className="text-3xl font-normal tracking-tight mb-2 animate-fade-in" style={{ animationDelay: "80ms", animationFillMode: "backwards" }}>You crossed Kazakhstan</h2>
          <p className="text-muted-foreground text-sm mb-4 animate-fade-in" style={{ animationDelay: "160ms", animationFillMode: "backwards" }}>{t.signedInAs} {session.user.email}</p>

          <div className="rounded-xl p-5 animate-scale-in" style={{ backgroundColor: "var(--signature-navy)", color: "#fff", animationDelay: "240ms", animationFillMode: "backwards" }}>
            <div className="text-xs uppercase tracking-wide opacity-70 mb-1">{t.score}</div>
            <div className="text-4xl sm:text-5xl font-normal tracking-tight tabular-nums">{displayScore}</div>
            <div className="mt-2 text-base">
              <span className="inline-block animate-[pop_0.6s_ease-out_1.2s_backwards]">{rank.emoji}</span> {rank.name}
            </div>
            <div className="mt-1 text-xs opacity-70 transition-opacity">
              {saved ? "✓ Result saved to leaderboard" : "Saving result…"}
            </div>
          </div>
        </div>

        {/* Scrollable leaderboard with smooth scroll */}
        <div className="flex-1 min-h-0 flex flex-col px-5 sm:px-8 pt-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2 shrink-0">{t.topExplorers}</div>
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
        <div className="p-5 sm:p-8 pt-4 shrink-0 border-t border-border mt-4">
          <button
            onClick={onReplay}
            className="w-full py-3 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-[#0d1218] transition-colors mb-2"
          >
            {t.backToMenu}
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full py-2 rounded-lg font-medium text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.exit}
          </button>
        </div>
      </div>
    </div>
  );
}


