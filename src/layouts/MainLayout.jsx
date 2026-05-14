import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { SocialFloatingBar } from "../components/layout/SocialFloatingBar";
import { useScrollTop } from "../hooks/useScrollTop";
import { ScrollToTop } from "../utils/ScroolTo";
import { Chatbot } from "../components/Chatbot/Chatbot";
export function MainLayout({ children }) {
  useScrollTop();

  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <SocialFloatingBar />
        <Chatbot />
      </div>
    </>
  );
}
