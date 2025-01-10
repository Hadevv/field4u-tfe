import { Footer } from "@/features/layout/Footer";
import { Header } from "@/features/layout/Header";


export default function HomePage() {
  return (
    <div className="relative flex h-fit flex-col bg-background text-foreground">
      <Header />
      <div className="mt-16 min-h-screen"></div>
      


      <Footer />
    </div>
  );
}
