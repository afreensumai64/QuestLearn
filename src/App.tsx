import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageTab } from "@/components/layout/Sidebar";
import { DashboardPage } from "@/pages/DashboardPage";
import { KingdomPage } from "@/pages/KingdomPage";
import { LearnPage } from "@/pages/LearnPage";
import { LibraryPage } from "@/pages/LibraryPage";
import { ProgressPage } from "@/pages/ProgressPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { LiveArenaBattle } from "@/components/game/LiveArenaBattle";

export function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>("dashboard");
  const [activeTopicId, setActiveTopicId] = useState<string | undefined>(undefined);

  const handleStartTopic = (topicId: string) => {
    setActiveTopicId(topicId);
    setCurrentTab("learn");
  };

  return (
    <>
      <AppLayout currentTab={currentTab} onSelectTab={setCurrentTab}>
        {currentTab === "dashboard" && <DashboardPage />}
        {currentTab === "kingdom" && <KingdomPage onStartTopic={handleStartTopic} />}
        {currentTab === "learn" && <LearnPage initialTopicId={activeTopicId} />}
        {currentTab === "library" && <LibraryPage />}
        {currentTab === "progress" && <ProgressPage />}
        {!["dashboard", "kingdom", "learn", "library", "progress"].includes(currentTab) && (
          <NotFoundPage onGoHome={() => setCurrentTab("dashboard")} />
        )}
      </AppLayout>
      <LiveArenaBattle />
    </>
  );
}

export default App;
