"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "../chatbot/ChatWidget";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <>
      {!isLanding && <Header />}
      <main className={isLanding ? "" : "flex-1"}>{children}</main>
      {!isLanding && <Footer />}
      {!isLanding && <ChatWidget />}
    </>
  );
}
