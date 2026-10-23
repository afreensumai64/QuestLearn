import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NotFoundPage({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-midnight-800 text-violet-400 border border-midnight-700 mb-4">
        <Compass className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold text-white font-fantasy">Uncharted Realm</h2>
      <p className="mt-2 text-sm text-slate-400 max-w-sm">
        The coordinates you seek lie beyond the mapped kingdom territories.
      </p>
      <Button variant="primary" size="md" onClick={onGoHome} className="mt-6">
        Return to Quest Hall
      </Button>
    </div>
  );
}
