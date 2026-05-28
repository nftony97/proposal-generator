import { Cloud, FileText, Database } from 'lucide-react';
import { Connection } from '../../const';

interface ConnectionBarProps {
  connections: Connection[];
  toggleConnection: (id: string) => void;
}

export default function ConnectionBar({ connections, toggleConnection }: ConnectionBarProps) {
  return (
    <section className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Database className="h-4 w-4 text-primary-foreground/70" />
          Active Module Connections:
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full md:w-auto">
          {connections.map((conn) => (
            <div
              key={conn.id}
              onClick={() => toggleConnection(conn.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all duration-150 active:scale-95 ${
                conn.status === 'connected'
                  ? 'bg-slate-800/80 border-slate-700 hover:border-emerald-500/50'
                  : conn.status === 'warning'
                  ? 'bg-slate-800/80 border-amber-500/30 hover:border-amber-500'
                  : 'bg-slate-800/80 border-rose-500/30 hover:border-rose-500'
              }`}
            >
              <div className="relative">
                {conn.iconType === 'salesforce' && <Cloud className="h-3.5 w-3.5 text-sky-400" />}
                {conn.iconType === 'onedrive'   && <Cloud className="h-3.5 w-3.5 text-blue-400" />}
                {conn.iconType === 'file'       && <FileText className="h-3.5 w-3.5 text-amber-400" />}
                <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-slate-900 ${
                  conn.status === 'connected' ? 'bg-emerald-500'
                  : conn.status === 'warning' ? 'bg-amber-500 animate-pulse'
                  : 'bg-rose-500'
                }`} />
              </div>
              <div className="text-left">
                <div className="font-bold text-[10px] text-slate-300 leading-none">{conn.name}</div>
                {conn.activeFile && (
                  <div className="text-[9px] text-slate-400 font-mono truncate max-w-[120px] md:max-w-[150px] mt-0.5">
                    {conn.activeFile}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
