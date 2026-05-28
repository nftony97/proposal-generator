import { Play, RefreshCw as LoopIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AppHeaderProps {
  isPipelineRunning: boolean;
  customStyles: { primaryColor: string; headingClass: string };
  runPipeline: () => void;
}

export default function AppHeader({ isPipelineRunning, customStyles, runPipeline }: AppHeaderProps) {
  return (
    <header className="border-b border-border/60 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 bg-white/80 dark:bg-black/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480823141/MG7nnQ4ZEbeykRPB3piYeQ/evans_logo-Mz9STXvvEQpdrTFHqSQDuw.png"
            alt="Evans National Logo"
            className="h-10 w-auto object-contain"
          />
          <div className="h-6 w-[1px] bg-border/60" />
          <div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              LYT Practice Solutions
            </span>
            <h1
              className={`text-lg font-bold tracking-tight ${customStyles.headingClass}`}
              style={{ color: customStyles.primaryColor }}
            >
              LYT Proposal Generator
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="px-3 py-1 bg-white/50 border-emerald-500/30 text-emerald-700 flex items-center gap-1.5 font-medium"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Orchestrator Active
          </Badge>

          <Button
            size="sm"
            onClick={runPipeline}
            disabled={isPipelineRunning}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm transition-transform active:scale-[0.97]"
            style={{ backgroundColor: customStyles.primaryColor }}
          >
            {isPipelineRunning ? (
              <>
                <LoopIcon className="h-4 w-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2 fill-current" />
                Run Pipeline
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
