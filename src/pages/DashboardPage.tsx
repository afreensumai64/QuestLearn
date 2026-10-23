import { Castle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { XPProgress } from "@/components/dashboard/XPProgress";
import { ContinueLearning } from "@/components/dashboard/ContinueLearning";
import { UploadPanel } from "@/components/dashboard/UploadPanel";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { RecentMaterials } from "@/components/dashboard/RecentMaterials";
import { StreakDisplay } from "@/components/dashboard/StreakDisplay";
import { RecommendedLesson } from "@/components/dashboard/RecommendedLesson";
import {
  demoUserStats,
  demoSubjects,
  demoContinueLearning,
  demoStreakDays,
  demoRecommendedLesson,
} from "@/data/demoData";

export function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Your Quest Awaits"
        subtitle="Welcome back, Scholar. Continue your journey through the Knowledge Kingdom."
        icon={<Castle className="h-6 w-6" />}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard stats={demoUserStats} />
      </div>

      {/* XP Progress */}
      <div className="mt-6">
        <XPProgress stats={demoUserStats} />
      </div>

      {/* Continue Learning + Upload Panel */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ContinueLearning data={demoContinueLearning} />
        <UploadPanel />
      </div>

      {/* Subject Cards */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-200">Your Subjects</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {demoSubjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </div>

      {/* Recent Materials + Streak + Recommended */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentMaterials showRemove />
        </div>
        <div className="space-y-6">
          <StreakDisplay streak={demoUserStats.streak} days={demoStreakDays} />
          <RecommendedLesson data={demoRecommendedLesson} />
        </div>
      </div>
    </div>
  );
}
