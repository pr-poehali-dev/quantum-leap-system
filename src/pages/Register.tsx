import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { MeshGradient } from "@/components/waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────
type VerifyMethod = "phone" | "email";

interface ProfileData {
  status: string;
  height: string;
  weight: string;
  gender: string;
  eyeColor: string;
  age: string;
  bodyType: string;
  hairColor: string;
  photos: string[];
  interests: string[];
  adultInterests: string[];
}

// ─── Constants ───────────────────────────────────────────────────────────────
const RELATIONSHIP_STATUSES = [
  { id: "single", label: "Одинок(а)", emoji: "💔" },
  { id: "couple", label: "В паре", emoji: "💑" },
  { id: "open", label: "Открытые отношения", emoji: "🔓" },
  { id: "married", label: "В браке", emoji: "💍" },
  { id: "complicated", label: "Всё сложно", emoji: "🌀" },
  { id: "polyamory", label: "Полиамория", emoji: "💞" },
  { id: "exploring", label: "Исследую себя", emoji: "🔍" },
];

const GENDERS = ["Мужской", "Женский", "Небинарный", "Гендерфлюид", "Другой"];
const EYE_COLORS = ["Карие", "Голубые", "Зелёные", "Серые", "Чёрные", "Янтарные"];
const BODY_TYPES = ["Стройный", "Атлетический", "Среднее", "Пышный", "Мускулистый"];
const HAIR_COLORS = ["Тёмные", "Светлые", "Рыжие", "Седые", "Крашеные", "Лысый/ая"];

const EVERYDAY_INTERESTS = [
  "🎬 Кино", "🎵 Музыка", "📚 Чтение", "🎮 Игры", "🏋️ Спорт",
  "🍕 Кулинария", "✈️ Путешествия", "🎨 Творчество", "🐾 Животные",
  "🌿 Природа", "💃 Танцы", "🧘 Йога", "🍷 Вино", "📸 Фото",
  "🚴 Велоспорт", "🎭 Театр", "🧩 Настолки", "💻 Технологии",
];

const ADULT_INTERESTS = [
  "🔥 Доминирование", "🙏 Подчинение", "🪢 Связывание", "🖤 БДСМ",
  "👁️ Вуайеризм", "🎭 Ролевые игры", "✨ Медленный секс", "🌙 Ночные приключения",
  "💬 Секстинг", "📸 Обмен фото", "🫦 Флирт без обязательств", "💫 Тантра",
];

const FEATURES = [
  {
    icon: "ShieldCheck",
    title: "Полная анонимность",
    desc: "Твои данные под защитой. Никаких утечек — ты сам решаешь, что о себе показывать. Дополнительно настрой приватность в разделе «Конфиденциальность».",
  },
  {
    icon: "Lock",
    title: "Приватные чаты",
    desc: "Переписка шифруется end-to-end. Сообщения не хранятся на серверах — только между вами двумя.",
  },
  {
    icon: "Sparkles",
    title: "ИИ-мэтчинг",
    desc: "Умный алгоритм на базе ИИ анализирует твои интересы, желания и поведение — и подбирает именно тех, кто действительно тебе подойдёт.",
  },
  {
    icon: "BadgeCheck",
    title: "Верифицированные профили",
    desc: "Значок подтверждения сразу видно в ленте. Верифицированные пользователи вызывают больше доверия и получают больше мэтчей.",
  },
  {
    icon: "Zap",
    title: "Быстрые знакомства",
    desc: "Ежедневные подборки, горящие мэтчи и режим «Сейчас» — найди кого-то прямо сегодня вечером.",
  },
  {
    icon: "Heart",
    title: "Без осуждения",
    desc: "Здесь нет табу. Любые предпочтения — это норма. Мы создали пространство, где каждый может быть собой.",
  },
];

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-full transition-all duration-300",
            i === current ? "w-5 h-2 bg-pink-500" : i < current ? "w-2 h-2 bg-pink-300" : "w-2 h-2 bg-slate-6"
          )}
        />
      ))}
    </div>
  );
}

// ─── Chip selector ───────────────────────────────────────────────────────────
function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm border transition-all duration-200 select-none",
        selected
          ? "bg-pink-500 border-pink-500 text-white font-medium"
          : "border-slate-6 text-slate-11 hover:border-pink-400 hover:text-pink-500"
      )}
    >
      {label}
    </button>
  );
}

// ─── Main Register page ───────────────────────────────────────────────────────
const TOTAL_STEPS = 7; // 0=verify, 1–6=profile

export default function Register() {
  const [step, setStep] = useState(0);
  const [verifyMethod, setVerifyMethod] = useState<VerifyMethod>("phone");
  const [verifyValue, setVerifyValue] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    status: "",
    height: "",
    weight: "",
    gender: "",
    eyeColor: "",
    age: "",
    bodyType: "",
    hairColor: "",
    photos: [],
    interests: [],
    adultInterests: [],
  });

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const toggleList = (key: "interests" | "adultInterests", val: string) => {
    setProfile((p) => {
      const arr = p[key];
      return {
        ...p,
        [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      };
    });
  };

  // ── Step 0: Verification ──────────────────────────────────────────────────
  const renderVerify = () => (
    <div className="flex flex-col gap-5">
      <div className="space-y-1 text-center">
        <div className="text-3xl mb-2">🔐</div>
        <h2 className="text-xl font-semibold text-slate-12">Подтвердите вашу личность</h2>
        <p className="text-sm text-slate-10">Выберите способ верификации</p>
      </div>

      <div className="flex gap-2 bg-slate-3 p-1 rounded-xl">
        {(["phone", "email"] as VerifyMethod[]).map((m) => (
          <button
            key={m}
            onClick={() => { setVerifyMethod(m); setCodeSent(false); setVerifyValue(""); setCode(""); }}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
              verifyMethod === m ? "bg-white dark:bg-slate-4 text-slate-12 shadow-sm" : "text-slate-10"
            )}
          >
            {m === "phone" ? "📱 Телефон" : "📧 Email"}
          </button>
        ))}
      </div>

      {!codeSent ? (
        <div className="flex flex-col gap-3">
          <Input
            type={verifyMethod === "phone" ? "tel" : "email"}
            placeholder={verifyMethod === "phone" ? "+7 (___) ___-__-__" : "your@email.com"}
            value={verifyValue}
            onChange={(e) => setVerifyValue(e.target.value)}
            className="rounded-xl"
          />
          <Button
            className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-medium"
            onClick={() => verifyValue && setCodeSent(true)}
          >
            Отправить код
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-10 text-center">
            Код отправлен на <span className="font-medium text-slate-12">{verifyValue}</span>
          </p>
          <Input
            type="text"
            placeholder="Введите код из SMS / письма"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="rounded-xl text-center tracking-widest text-lg"
            maxLength={6}
          />
          <Button
            className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-medium"
            onClick={() => code.length >= 4 && next()}
          >
            Подтвердить
          </Button>
          <button
            className="text-xs text-slate-10 text-center underline"
            onClick={() => setCodeSent(false)}
          >
            Изменить {verifyMethod === "phone" ? "номер" : "email"}
          </button>
        </div>
      )}
    </div>
  );

  // ── Step 1: Relationship status ───────────────────────────────────────────
  const renderStep1 = () => (
    <div className="flex flex-col gap-5">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-semibold text-slate-12">Ваш статус</h2>
        <p className="text-sm text-slate-10">Расскажите другим, как вы сейчас</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {RELATIONSHIP_STATUSES.map((s) => (
          <button
            key={s.id}
            onClick={() => setProfile((p) => ({ ...p, status: s.id }))}
            className={cn(
              "flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm transition-all",
              profile.status === s.id
                ? "border-pink-500 bg-pink-50 dark:bg-pink-950/30 text-pink-600 font-medium"
                : "border-slate-6 text-slate-11 hover:border-pink-300"
            )}
          >
            <span className="text-2xl">{s.emoji}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ── Step 2: Personal info ─────────────────────────────────────────────────
  const renderStep2 = () => (
    <div className="flex flex-col gap-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-semibold text-slate-12">О вас</h2>
        <p className="text-sm text-slate-10">Базовая информация для профиля</p>
      </div>

      {/* Age — highlighted */}
      <div className="rounded-xl border-2 border-pink-400 bg-pink-50 dark:bg-pink-950/20 p-3">
        <label className="text-xs font-semibold text-pink-600 uppercase tracking-wide mb-1.5 block">
          🔞 Возраст (обязательно, мин. 18 лет)
        </label>
        <Input
          type="number"
          placeholder="Ваш возраст"
          min={18}
          max={99}
          value={profile.age}
          onChange={(e) => setProfile((p) => ({ ...p, age: e.target.value }))}
          className="rounded-lg border-pink-300 focus:border-pink-500"
        />
        {profile.age && Number(profile.age) < 18 && (
          <p className="text-xs text-red-500 mt-1">Приложение только для лиц 18+</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Gender */}
        <div>
          <label className="text-xs text-slate-10 mb-1 block">Пол</label>
          <select
            value={profile.gender}
            onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value }))}
            className="w-full rounded-xl border border-slate-6 bg-transparent px-3 py-2 text-sm text-slate-12"
          >
            <option value="">Выбрать</option>
            {GENDERS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
        {/* Eye color */}
        <div>
          <label className="text-xs text-slate-10 mb-1 block">Цвет глаз</label>
          <select
            value={profile.eyeColor}
            onChange={(e) => setProfile((p) => ({ ...p, eyeColor: e.target.value }))}
            className="w-full rounded-xl border border-slate-6 bg-transparent px-3 py-2 text-sm text-slate-12"
          >
            <option value="">Выбрать</option>
            {EYE_COLORS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        {/* Height */}
        <div>
          <label className="text-xs text-slate-10 mb-1 block">Рост (см)</label>
          <Input
            type="number"
            placeholder="175"
            value={profile.height}
            onChange={(e) => setProfile((p) => ({ ...p, height: e.target.value }))}
            className="rounded-xl"
          />
        </div>
        {/* Weight */}
        <div>
          <label className="text-xs text-slate-10 mb-1 block">Вес (кг)</label>
          <Input
            type="number"
            placeholder="70"
            value={profile.weight}
            onChange={(e) => setProfile((p) => ({ ...p, weight: e.target.value }))}
            className="rounded-xl"
          />
        </div>
        {/* Body type */}
        <div>
          <label className="text-xs text-slate-10 mb-1 block">Телосложение</label>
          <select
            value={profile.bodyType}
            onChange={(e) => setProfile((p) => ({ ...p, bodyType: e.target.value }))}
            className="w-full rounded-xl border border-slate-6 bg-transparent px-3 py-2 text-sm text-slate-12"
          >
            <option value="">Выбрать</option>
            {BODY_TYPES.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        {/* Hair color */}
        <div>
          <label className="text-xs text-slate-10 mb-1 block">Цвет волос</label>
          <select
            value={profile.hairColor}
            onChange={(e) => setProfile((p) => ({ ...p, hairColor: e.target.value }))}
            className="w-full rounded-xl border border-slate-6 bg-transparent px-3 py-2 text-sm text-slate-12"
          >
            <option value="">Выбрать</option>
            {HAIR_COLORS.map((h) => <option key={h}>{h}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  // ── Step 3: Photos ────────────────────────────────────────────────────────
  const renderStep3 = () => (
    <div className="flex flex-col gap-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-semibold text-slate-12">Фотографии профиля</h2>
        <p className="text-sm text-slate-10">Добавьте от 2 до 6 фото</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all",
              profile.photos[i]
                ? "border-pink-400 bg-pink-50 dark:bg-pink-950/20"
                : "border-slate-6 hover:border-pink-300"
            )}
            onClick={() => {
              const updated = [...profile.photos];
              if (!updated[i]) {
                updated[i] = `photo_${i}`;
                setProfile((p) => ({ ...p, photos: updated }));
              } else {
                updated.splice(i, 1);
                setProfile((p) => ({ ...p, photos: updated.filter(Boolean) }));
              }
            }}
          >
            {profile.photos[i] ? (
              <Icon name="CheckCircle" size={24} className="text-pink-500" />
            ) : (
              <>
                <Icon name="Plus" size={20} className="text-slate-8" />
                <span className="text-xs text-slate-8 mt-1">Фото {i + 1}</span>
              </>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-9 text-center mt-1 leading-relaxed">
        Для получения значка верификации профиля — пройдите фото-верификацию личности в настройках. Верифицированные профили видны другим пользователям.
      </p>
    </div>
  );

  // ── Step 4: Everyday interests ────────────────────────────────────────────
  const renderStep4 = () => (
    <div className="flex flex-col gap-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-semibold text-slate-12">Ваши увлечения</h2>
        <p className="text-sm text-slate-10">Что вам нравится в жизни? Выберите несколько</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {EVERYDAY_INTERESTS.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={profile.interests.includes(item)}
            onClick={() => toggleList("interests", item)}
          />
        ))}
      </div>
      <p className="text-xs text-slate-10 text-center">
        Выбрано: {profile.interests.length}
      </p>
    </div>
  );

  // ── Step 5: Adult interests ───────────────────────────────────────────────
  const renderStep5 = () => (
    <div className="flex flex-col gap-4">
      <div className="text-center space-y-1">
        <div className="text-2xl">🔥</div>
        <h2 className="text-xl font-semibold text-slate-12">Взрослые интересы</h2>
        <p className="text-sm text-slate-10">Что вам ближе? Это видно только совместимым партнёрам</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {ADULT_INTERESTS.map((item) => (
          <Chip
            key={item}
            label={item}
            selected={profile.adultInterests.includes(item)}
            onClick={() => toggleList("adultInterests", item)}
          />
        ))}
      </div>
      <p className="text-xs text-slate-10 text-center">
        Выбрано: {profile.adultInterests.length}
      </p>
    </div>
  );

  // ── Step 6: Features showcase ─────────────────────────────────────────────
  const renderStep6 = () => (
    <div className="flex flex-col gap-4">
      <div className="text-center space-y-1">
        <div className="text-2xl">✨</div>
        <h2 className="text-xl font-semibold text-slate-12">Добро пожаловать!</h2>
        <p className="text-sm text-slate-10">Вот что вас ждёт внутри</p>
      </div>
      <div className="flex flex-col gap-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex gap-3 items-start p-3 rounded-xl bg-slate-2 border border-slate-4"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shrink-0">
              <Icon name={f.icon} size={18} className="text-white" fallback="Star" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-12">{f.title}</p>
              <p className="text-xs text-slate-10 leading-relaxed mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const stepContent = [
    renderVerify,
    renderStep1,
    renderStep2,
    renderStep3,
    renderStep4,
    renderStep5,
    renderStep6,
  ];

  const stepLabels = [
    "Верификация",
    "Статус",
    "О вас",
    "Фото",
    "Увлечения",
    "Желания",
    "Добро пожаловать",
  ];

  const isLastStep = step === TOTAL_STEPS - 1;
  const canProceed = step === 0 ? true : true; // basic flow, can be extended

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="antialiased max-w-screen min-h-svh bg-slate-1 text-slate-12">
        <MeshGradient
          colors={["#6b0033", "#c2004e", "#ff2d78", "#ff8c42"]}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 0, width: "100%", height: "100%" }}
        />
        <div className="relative z-[1] flex flex-col min-h-screen items-center justify-center py-8 px-4">
          <div className="w-full max-w-sm">
            <div className="bg-gray-1/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-10">{stepLabels[step]}</span>
                  <span className="text-xs text-slate-10">
                    {step + 1} / {TOTAL_STEPS}
                  </span>
                </div>
                <StepDots total={TOTAL_STEPS} current={step} />
              </div>

              {/* Content */}
              <div className="px-6 py-5 max-h-[65vh] overflow-y-auto no-scrollbar">
                {stepContent[step]()}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 pt-3 border-t border-slate-4 flex gap-2">
                {step > 0 && (
                  <Button
                    variant="outline"
                    onClick={back}
                    className="flex-1 rounded-xl"
                  >
                    <Icon name="ArrowLeft" size={16} />
                    Назад
                  </Button>
                )}
                <Button
                  className="flex-1 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-medium"
                  onClick={isLastStep ? () => window.location.href = "/" : next}
                >
                  {isLastStep ? "Начать знакомства 🔥" : "Далее"}
                  {!isLastStep && <Icon name="ArrowRight" size={16} />}
                </Button>
              </div>
            </div>

            <p className="text-xs text-white/60 text-center mt-4">
              18+ · Только для совершеннолетних
            </p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}