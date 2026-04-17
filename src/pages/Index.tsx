import { ThemeProvider } from "next-themes";
import {
  WaitlistForm,
  WaitlistWrapper,
  MeshGradient,
} from "@/components/waitlist";

const Index = () => {
  const handleSubmit = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call
    console.log("Submitting email:", email);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo: always succeed
    return { success: true };
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="antialiased max-w-screen min-h-svh bg-slate-1 text-slate-12">
        <MeshGradient
          colors={["#6b0033", "#c2004e", "#ff2d78", "#ff8c42"]}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <div className="max-w-screen-sm mx-auto w-full relative z-[1] flex flex-col min-h-screen items-center justify-center">
          <div className="px-5 gap-8 flex flex-col">
            <main className="flex justify-center">
              <WaitlistWrapper
                logo={{
                  src: "/logo.svg",
                  alt: "Desire",
                }}
                copyright="18+ только для взрослых"
                copyrightLink={{ text: "Присоединяйся", href: "#" }}
                showThemeSwitcher={true}
              >
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-widest text-pink-500 mb-1">
                    🔥 Скоро запуск
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-medium text-slate-12 whitespace-pre-wrap text-pretty">
                    Дэйтинг без границ.{"\n"}Только для взрослых.
                  </h1>
                  <p className="text-slate-10 tracking-tight text-pretty">
                    Первое приложение, где 18+ интересы — это норма. Найди людей
                    со схожими желаниями и без лишних условностей.
                  </p>
                </div>
                <div className="px-1 flex flex-col w-full self-stretch">
                  <WaitlistForm
                    onSubmit={handleSubmit}
                    placeholder="Введите ваш email"
                    buttonCopy={{
                      idle: "Получить доступ",
                      loading: "Отправка...",
                      success: "Вы в списке! 🔥",
                    }}
                  />
                  <p className="text-xs text-slate-10 text-center mt-3">
                    Только для лиц старше 18 лет. Без спама — только важное.
                  </p>
                </div>
              </WaitlistWrapper>
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;