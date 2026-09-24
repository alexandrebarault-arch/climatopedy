import React, { useState } from 'react';
import { RotateCcw, FileText, Network, Globe, HelpCircle, ShieldAlert, FileDown, LayoutDashboard, Menu, X } from 'lucide-react';

export type AppTabType = 'map' | 'comparative-dashboard' | 'tipping-points' | 'causal' | 'spec';

interface TopBarProps {
  currentTab: AppTabType;
  onSelectTab: (tab: AppTabType) => void;
  onReset: () => void;
  currentYear: number;
  onOpenPdfExport?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  onReset,
  currentYear,
  onOpenPdfExport
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: AppTabType) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const handleFaqClick = () => {
    onSelectTab('map');
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  return (
    <>
      <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 border-b border-slate-800 bg-[#0e1422]/98 backdrop-blur z-30 relative shrink-0">
        {/* Zone 1: Wordmark / Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 mr-2 sm:mr-4">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0 inline-block shadow-sm shadow-cyan-400/50" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap">
              GAIA-Sim
            </span>
            <span className="hidden xl:inline text-xs font-normal text-slate-400 whitespace-nowrap">
              · Biosphère &amp; Démographie 2026–2200
            </span>
            <span className="hidden sm:inline xl:hidden text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/50 whitespace-nowrap">
              2026–2200
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Desktop (visible dès lg, sans AUCUNE barre de scroll native) */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-3 2xl:gap-5 text-xs font-medium text-slate-400 min-w-0 overflow-x-auto no-scrollbar py-1 flex-1 justify-center">
          <button
            onClick={() => handleTabClick('map')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === 'map'
                ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-700/50 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Planisphère</span>
            <span className="hidden xl:inline text-slate-400">&amp; Indicateurs</span>
          </button>

          <button
            onClick={() => handleTabClick('comparative-dashboard')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === 'comparative-dashboard'
                ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-600/60 font-bold'
                : 'hover:text-emerald-300 hover:bg-slate-800/50'
            }`}
            title="Dashboard Comparatif Global : Cartes d'impact Scénario A vs B"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dashboard Comparatif</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-emerald-900/80 text-emerald-300 border border-emerald-600/50 font-semibold">
              A vs B
            </span>
          </button>

          <button
            onClick={() => handleTabClick('tipping-points')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === 'tipping-points'
                ? 'text-rose-300 bg-rose-950/60 border border-rose-700/50 font-semibold'
                : 'hover:text-rose-300 hover:bg-slate-800/50'
            }`}
            title="Consulter l'état des lieux scientifique des 9 points de bascule climatiques"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Points de Bascule</span>
          </button>

          <button
            onClick={() => handleTabClick('causal')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === 'causal'
                ? 'text-amber-300 bg-amber-950/60 border border-amber-700/50 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-amber-400" />
            <span>Enquête Énergie</span>
            <span className="hidden xl:inline text-slate-400">&amp; Pétrole</span>
          </button>

          <button
            onClick={() => handleTabClick('spec')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === 'spec'
                ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-700/50 font-semibold'
                : 'hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Spécifications</span>
          </button>

          <button
            onClick={handleFaqClick}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50"
            title="Consulter la FAQ et le lexique scientifique"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>FAQ &amp; Lexique</span>
          </button>
        </nav>

        {/* Zone 3: Actions + Menu Mobile toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          {/* Badge année */}
          <span className="text-xs font-mono text-cyan-300 tabular-nums px-2 sm:px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800/40 whitespace-nowrap shrink-0">
            <span className="hidden sm:inline text-slate-400">Année </span>
            {Math.floor(currentYear)}
          </span>

          {/* Export PDF */}
          {onOpenPdfExport && (
            <button
              onClick={onOpenPdfExport}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-cyan-200 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600/70 hover:border-cyan-400 rounded-lg transition-all cursor-pointer shadow-sm hover:shadow-cyan-950/50 shrink-0"
              title="Exporter le rapport PDF de simulation"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Rapport PDF</span>
            </button>
          )}

          {/* Bouton Aujourd'hui (Reset) */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-cyan-300 rounded-lg transition-colors border border-slate-700/60 shrink-0 cursor-pointer"
            title="Réinitialiser l'état à l'année de départ (2026)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Aujourd'hui</span>
          </button>

          {/* Bouton Menu Burger sur petits écrans (< lg) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shrink-0 cursor-pointer"
            title={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir la navigation'}
            aria-label="Menu de navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-cyan-300" /> : <Menu className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </header>

      {/* Menu Déroulant Mobile (< lg) quand l'utilisateur clique sur le burger */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c121e] border-b border-slate-700 px-4 py-3 shadow-2xl z-20 flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-150">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 pb-1">
            Vues et modules du simulateur
          </span>

          <button
            onClick={() => handleTabClick('map')}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === 'map'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="block font-semibold">Planisphère &amp; Indicateurs</span>
                <span className="block text-[11px] text-slate-400 font-normal">Cartes biophysiques, stress thermique et courbes KPI</span>
              </div>
            </div>
            {currentTab === 'map' && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
          </button>

          <button
            onClick={() => handleTabClick('comparative-dashboard')}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === 'comparative-dashboard'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-bold'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="block font-semibold">Dashboard Comparatif Global</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-emerald-900 text-emerald-300 border border-emerald-700">
                    A vs B
                  </span>
                </div>
                <span className="block text-[11px] text-slate-400 font-normal">Cartes d'impact synthétisant les bénéfices de l'action</span>
              </div>
            </div>
            {currentTab === 'comparative-dashboard' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>

          <button
            onClick={() => handleTabClick('tipping-points')}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === 'tipping-points'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <span className="block font-semibold">Points de Bascule Climatiques</span>
                <span className="block text-[11px] text-slate-400 font-normal">Diagnostic des 9 seuils critiques du système Terre</span>
              </div>
            </div>
            {currentTab === 'tipping-points' && <span className="w-2 h-2 rounded-full bg-rose-400" />}
          </button>

          <button
            onClick={() => handleTabClick('causal')}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === 'causal'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Network className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="block font-semibold">Enquête Chaîne Matérielle &amp; Pétrole</span>
                <span className="block text-[11px] text-slate-400 font-normal">Traçabilité physique de l'EROI et d'Haber-Bosch</span>
              </div>
            </div>
            {currentTab === 'causal' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
          </button>

          <button
            onClick={() => handleTabClick('spec')}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === 'spec'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="block font-semibold">Spécification &amp; Algorithmes</span>
                <span className="block text-[11px] text-slate-400 font-normal">Formules biophysiques détaillées et équations différentielles</span>
              </div>
            </div>
            {currentTab === 'spec' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>

          <button
            onClick={handleFaqClick}
            className="flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left text-slate-300 hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="block font-semibold">FAQ &amp; Lexique Scientifique</span>
                <span className="block text-[11px] text-slate-400 font-normal">Définitions vulgarisées et explications pédagogiques</span>
              </div>
            </div>
          </button>
        </div>
      )}
    </>
  );
};

