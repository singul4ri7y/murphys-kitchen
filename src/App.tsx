import { useAtom } from "jotai";
import { useEffect } from "react";
import { screenAtom } from "./store/screens";
import { authAtom } from "./store/auth";
import { themeAtom } from "./store/theme";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Login } from "./screens/Login";
import {
  Outage,
  OutOfMinutes,
  Intro,
  Conversation,
  FinalScreen,
} from "./screens";

function App() {
  const [{ currentScreen }] = useAtom(screenAtom);
  const [auth] = useAtom(authAtom);
  const [theme] = useAtom(themeAtom);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Show login screen if not authenticated
  if (!auth.isAuthenticated) {
    return <Login />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "outage":
        return <Outage />;
      case "outOfMinutes":
        return <OutOfMinutes />;
      case "intro":
        return <Intro />;
      case "conversation":
        return <Conversation />;
      case "finalScreen":
        return <FinalScreen />;
      default:
        return <Intro />; // Default to intro instead of loading
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/3 via-background to-accent/3">
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-160px)] gap-4 sm:gap-6 p-3 sm:p-6">
        {renderScreen()}
      </main>
      <Footer />
    </div>
  );
}

export default App;