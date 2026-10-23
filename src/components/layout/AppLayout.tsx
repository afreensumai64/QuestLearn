import { useState } from "react";
import { Sidebar, PageTab } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppLayoutProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  children: React.ReactNode;
}

export function AppLayout({ currentTab, onSelectTab, children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-midnight-950 text-slate-100">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onQuickUpload={() => onSelectTab("library")}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
