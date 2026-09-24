import React, { useState } from 'react';
import { RotateCcw, FileText, Network, Globe, HelpCircle, ShieldAlert, FileDown, LayoutDashboard, Menu, X, BookOpen, Compass, Monitor } from 'lucide-react';

export type AppTabType = 'map' | 'comparative-dashboard' | 'tipping-points' | 'causal' | 'spec' | 'sources';

interface TopBarProps {
  currentTab: AppTabType;
  onSelectTab: (tab: AppTabType) => void;
  onReset: () => void;
  currentYear: number;
  onOpenPdfExport?: () => void;
  onOpenTutorial?: () => void;
  onOpenMobileNotice?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  onReset,
  currentYear,
  onOpenPdfExport,
  onOpenTutorial,
  onOpenMobileNotice
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDefaultTab = currentTab === 'map';

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
      <header id="tour-topbar-header" className="flex items-center justify-between px-3 sm:px-6 py-2.5 border-b border-slate-200 bg-white/95 backdrop-blur z-30 relative shrink-0 shadow-xs">
        {/* Zone 1: Wordmark / Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 mr-2 sm:mr-4">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse shrink-0 inline-block shadow-sm shadow-sky-500/40" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
              CLIMATOPEDY
            </span>
            <span className="hidden xl:inline text-xs font-normal text-slate-500 whitespace-nowrap">
              · Comprendre le Climat &amp; l'Énergie simplement
            </span>
            <span className="hidden sm:inline xl:hidden text-[10px] font-mono text-sky-700 px-1.5 py-0.5 rounded bg-sky-50 border border-sky-200 whitespace-nowrap">
              2026–2200
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Desktop (visible dès lg, sans AUCUNE barre de scroll native) */}
        <nav id="tour-topbar-nav" className="hidden lg:flex items-center gap-1.5 xl:gap-2 2xl:gap-3 text-xs font-medium text-slate-600 min-w-0 overflow-x-auto no-scrollbar py-1 flex-1 justify-center">
          <button
            onClick={() => handleTabClick('map')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === 'map'
                ? 'text-sky-800 bg-sky-50 border border-sky-200 font-semibold shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-sky-600" />
            <span>Planisphère</span>
            <span className="hidden xl:inline text-slate-500">&amp; Indicateurs</span>
          </button>

          <button
            onClick={() => handleTabClick('comparative-dashboard')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === 'comparative-dashboard'
                ? 'text-emerald-800 bg-emerald-50 border border-emerald-300 font-bold shadow-xs'
                : 'hover:text-emerald-700 hover:bg-slate-100'
            }`}
            title="Dashboard Comparatif Global : Cartes d'impact Scénario A vs B"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dashboard Comparatif</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
              A vs B
            </span>
          </button>

          <button
            onClick={() => handleTabClick('tipping-points')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === 'tipping-points'
                ? 'text-rose-800 bg-rose-50 border border-rose-200 font-semibold shadow-xs'
                : 'hover:text-rose-700 hover:bg-slate-100'
            }`}
            title="Consulter l'état des lieux scientifique des 9 points de bascule climatiques"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Points de Bascule</span>
          </button>

          <button
            onClick={() => handleTabClick('causal')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === 'causal'
                ? 'text-amber-900 bg-amber-50 border border-amber-200 font-semibold shadow-xs'
                : 'hover:text-amber-800 hover:bg-slate-100'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-amber-600" />
            <span>Enquête Énergie</span>
            <span className="hidden xl:inline text-slate-500">&amp; Pétrole</span>
          </button>

          <button
            onClick={() => handleTabClick('spec')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === 'spec'
                ? 'text-teal-800 bg-teal-50 border border-teal-200 font-semibold shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            <span>Spécifications</span>
          </button>

          <button
            onClick={() => handleTabClick('sources')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === 'sources'
                ? 'text-sky-800 bg-sky-50 border border-sky-200 font-semibold shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Consulter l'ensemble des sources, données et publications scientifiques vérifiées"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>Sources &amp; Données</span>
          </button>

          <button
            onClick={handleFaqClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 text-slate-600 hover:text-sky-700 hover:bg-slate-100"
            title="Consulter la FAQ et le lexique scientifique"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>FAQ &amp; Lexique</span>
          </button>
        </nav>

        {/* Zone 3: Actions + Menu Mobile toggle */}
        <div id="tour-topbar-actions" className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          {/* Tutoriel / Guide de navigation (Actif uniquement sur la page par défaut) */}
          {onOpenTutorial && (
            <button
              onClick={isDefaultTab ? onOpenTutorial : undefined}
              disabled={!isDefaultTab}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                isDefaultTab
                  ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 hover:border-emerald-400 cursor-pointer shadow-xs'
                  : 'text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed opacity-60'
              }`}
              title={
                isDefaultTab
                  ? "Guide de navigation : comment explorer le simulateur ?"
                  : "Le tutoriel interactif est uniquement actif sur la page par défaut (Planisphère & Indicateurs)"
              }
              aria-disabled={!isDefaultTab}
            >
              <Compass className={`w-3.5 h-3.5 ${isDefaultTab ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="hidden md:inline">Tutoriel</span>
            </button>
          )}

          {/* Export PDF */}
          {onOpenPdfExport && (
            <button
              onClick={onOpenPdfExport}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-300 hover:border-sky-400 rounded-lg transition-all cursor-pointer shadow-xs shrink-0"
              title="Exporter le rapport PDF de simulation"
            >
              <FileDown className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden md:inline">Rapport PDF</span>
            </button>
          )}

          {/* Bouton Aujourd'hui (Reset) */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors border border-slate-200 shrink-0 cursor-pointer shadow-2xs"
            title="Réinitialiser l'état à l'année de départ (2026)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden md:inline">Aujourd'hui</span>
          </button>

          {/* Bouton Menu Burger sur petits écrans (< lg) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shrink-0 cursor-pointer shadow-2xs"
            title={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir la navigation'}
            aria-label="Menu de navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-sky-700" /> : <Menu className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* Menu Déroulant Mobile (< lg) quand l'utilisateur clique sur le burger */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 shadow-xl z-20 flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-150">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2 pb-1">
            Vues et modules du simulateur
          </span>

          <button
            onClick={() => handleTabClick('map')}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === 'map'
                ? 'bg-sky-50 text-sky-800 border border-sky-200 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <span className="block font-semibold text-slate-900">Planisphère &amp; Indicateurs</span>
                <span className="block text-[11px] text-slate-500 font-normal">Cartes biophysiques, stress thermique et courbes KPI</span>
              </div>
            </div>
            {currentTab === 'map' && <span className="w-2 h-2 rounded-full bg-sky-600" />}
          </button>

          <button
            onClick={() => handleTabClick('comparative-dashboard')}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === 'comparative-dashboard'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="block font-semibold text-slate-900">Dashboard Comparatif Global</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                    A vs B
                  </span>
                </div>
                <span className="block text-[11px] text-slate-500 font-normal">Cartes d'impact synthétisant les bénéfices de l'action</span>
              </div>
            </div>
            {currentTab === 'comparative-dashboard' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
          </button>

          <button
            onClick={() => handleTabClick('tipping-points')}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === 'tipping-points'
                ? 'bg-rose-50 text-rose-800 border border-rose-200 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="block font-semibold text-slate-900">Points de Bascule Climatiques</span>
                <span className="block text-[11px] text-slate-500 font-normal">Diagnostic des 9 seuils critiques du système Terre</span>
              </div>
            </div>
            {currentTab === 'tipping-points' && <span className="w-2 h-2 rounded-full bg-rose-600" />}
          </button>

          <button
            onClick={() => handleTabClick('causal')}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === 'causal'
                ? 'bg-amber-50 text-amber-900 border border-amber-200 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Network className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="block font-semibold text-slate-900">Enquête Chaîne Matérielle &amp; Pétrole</span>
                <span className="block text-[11px] text-slate-500 font-normal">Traçabilité physique de l'EROI et d'Haber-Bosch</span>
              </div>
            </div>
            {currentTab === 'causal' && <span className="w-2 h-2 rounded-full bg-amber-600" />}
          </button>

          <button
            onClick={() => handleTabClick('spec')}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === 'spec'
                ? 'bg-teal-50 text-teal-800 border border-teal-200 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <span className="block font-semibold text-slate-900">Spécification &amp; Algorithmes</span>
                <span className="block text-[11px] text-slate-500 font-normal">Formules biophysiques détaillées et équations différentielles</span>
              </div>
            </div>
            {currentTab === 'spec' && <span className="w-2 h-2 rounded-full bg-teal-600" />}
          </button>

          <button
            onClick={() => handleTabClick('sources')}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === 'sources'
                ? 'bg-sky-50 text-sky-800 border border-sky-200 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <span className="block font-semibold text-slate-900">Sources &amp; Données Scientifiques</span>
                <span className="block text-[11px] text-slate-500 font-normal">Publications à comité de lecture et bases de données vérifiées</span>
              </div>
            </div>
            {currentTab === 'sources' && <span className="w-2 h-2 rounded-full bg-sky-600" />}
          </button>

          <button
            onClick={handleFaqClick}
            className="flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <span className="block font-semibold text-slate-900">FAQ &amp; Lexique Scientifique</span>
                <span className="block text-[11px] text-slate-500 font-normal">Définitions vulgarisées et explications pédagogiques</span>
              </div>
            </div>
          </button>

          {/* Séparateur et options d'aide */}
          <div className="pt-2 mt-1 border-t border-slate-200 flex flex-col gap-1.5">
            {onOpenTutorial && (
              <button
                onClick={() => {
                  if (isDefaultTab) {
                    setMobileMenuOpen(false);
                    onOpenTutorial();
                  }
                }}
                disabled={!isDefaultTab}
                className={`flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                  isDefaultTab
                    ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 cursor-pointer'
                    : 'text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed opacity-60'
                }`}
                title={
                  isDefaultTab
                    ? "Comment naviguer et comprendre le simulateur"
                    : "Le tutoriel est uniquement actif sur la page d'accueil par défaut"
                }
              >
                <Compass className={`w-4 h-4 ${isDefaultTab ? 'text-emerald-600' : 'text-slate-400'} shrink-0`} />
                <div>
                  <span className="block font-bold">Guide de Visite &amp; Tutoriel</span>
                  <span className="block text-[10px] text-slate-500 font-normal">
                    {isDefaultTab
                      ? "Comment naviguer et comprendre le simulateur"
                      : "Actif uniquement sur la page par défaut (Planisphère)"}
                  </span>
                </div>
              </button>
            )}

            {onOpenMobileNotice && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMobileNotice();
                }}
                className="flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors text-left"
              >
                <Monitor className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="block font-semibold text-slate-900">Recommandation d'usage PC 💻</span>
                  <span className="block text-[10px] text-amber-800 font-normal">Prendre le temps d'appréhender le sujet sur grand écran</span>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

