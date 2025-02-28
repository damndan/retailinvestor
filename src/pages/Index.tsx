
import { Header } from "@/components/header";
import { Dashboard } from "@/components/dashboard";
import { ThemeProvider } from "@/hooks/use-theme";

const Index = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Dashboard />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
