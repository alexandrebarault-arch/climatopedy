import React from 'react';
import { RotateCcw, FileText, Network, Globe, HelpCircle, GitCompare } from 'lucide-react';

interface TopBarProps {
  currentTab: 'map' | 'causal' | 'spec';
  onSelectTab: (tab: 'map' | 'causal' | 'spec') => void;
  onReset: () => void;
  currentYear: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  onReset,
  currentYear
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-[#0e1422]/95 backdrop-blur z-30">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <span className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
          GAIA-Sim · Biosphère & Démographie 2026–2100
        </span>
      </div>

      {/* Zone 2: Clean text navigation links */}
      <nav className="flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('map')}
          className={`flex items-center gap-1.5 transition-colors pb-0.5 border-b-2 whitespace-nowrap ${
            currentTab === 'map'
              ? 'text-cyan-400 border-cyan-400 font-semibold'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          Planisphère & Indicateurs
        </button>

        <button
          onClick={() => {
            onSelectTab('map');
            setTimeout(() => {
              document.getElementById('comparison-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 60);
          }}
          className="flex items-center gap-1.5 transition-colors pb-0.5 border-b-2 border-transparent text-slate-400 hover:text-emerald-300 whitespace-nowrap cursor-pointer"
          title="Comparer deux trajectoires biophysiques (Actuel vs Sobriété)"
        >
          <GitCompare className="w-3.5 h-3.5 text-emerald-400" />
          Mode Comparatif
        </button>

        <button
          onClick={() => onSelectTab('causal')}
          className={`flex items-center gap-1.5 transition-colors pb-0.5 border-b-2 whitespace-nowrap ${
            currentTab === 'causal'
              ? 'text-amber-400 border-amber-400 font-semibold'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          Enquête Chaîne Matérielle & Pétrole
        </button>

        <button
          onClick={() => onSelectTab('spec')}
          className={`flex items-center gap-1.5 transition-colors pb-0.5 border-b-2 whitespace-nowrap ${
            currentTab === 'spec'
              ? 'text-emerald-400 border-emerald-400 font-semibold'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Spécification &amp; Algorithmes
        </button>

        <button
          onClick={() => {
            onSelectTab('map');
            setTimeout(() => {
              document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 60);
          }}
          className="flex items-center gap-1.5 transition-colors pb-0.5 border-b-2 border-transparent text-slate-400 hover:text-cyan-300 whitespace-nowrap cursor-pointer"
          title="Consulter la FAQ et le lexique des termes techniques (EROI, FaIR, Stull Tw, Haber-Bosch)"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          FAQ &amp; Lexique
        </button>
      </nav>

      {/* Zone 3: Primary actions */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-cyan-300 tabular-nums px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800/40">
          Année {Math.floor(currentYear)}
        </span>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-cyan-300 rounded-lg transition-colors border border-slate-700/60"
          title="Réinitialiser l'état de la carte à aujourd'hui (2026)"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Aujourd'hui (2026)</span>
        </button>
      </div>
    </header>
  );
};
