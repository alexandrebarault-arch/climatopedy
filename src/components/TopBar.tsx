import React, { useState } from 'react';
import { RotateCcw, FileText, Network, Globe, HelpCircle, ShieldAlert, LayoutDashboard, Menu, X, BookOpen, Compass, Monitor } from 'lucide-react';
import { SITE_SECTION_BY_ID, SiteSectionId } from '../data/siteSections';

export type AppTabType = SiteSectionId;

interface TopBarProps {
  currentTab: AppTabType;
  onSelectTab: (tab: AppTabType) => void;
  onReset: () => void;
  currentYear: number;
  onOpenTutorial?: () => void;
  onOpenMobileNotice?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  onReset,
  currentYear,
  onOpenTutorial,
  onOpenMobileNotice
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDefaultTab = currentTab === SITE_SECTION_BY_ID.map.id;

  const handleTabClick = (tab: AppTabType) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const handleFaqClick = () => {
    onSelectTab(SITE_SECTION_BY_ID.map.id);
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  return (
    <>
      <header id="tour-topbar-header" className="flex items-center justify-between px-3 sm:px-6 py-2.5 border-b border-slate-200 bg-white/95 backdrop-blur z-30 relative shrink-0 shadow-xs">
        {/* Navigation Desktop (visible dès lg, sans AUCUNE barre de scroll native) */}
        <nav id="tour-topbar-nav" className="hidden lg:flex items-center gap-1.5 xl:gap-2 2xl:gap-3 text-xs font-medium text-slate-600 min-w-0 overflow-x-auto no-scrollbar py-1 flex-1">
          <button
            onClick={() => handleTabClick(SITE_SECTION_BY_ID.map.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === SITE_SECTION_BY_ID.map.id
                ? 'text-sky-800 bg-sky-50 border border-sky-200 font-semibold shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-sky-600" />
            <span>{SITE_SECTION_BY_ID.map.desktopLabel}</span>
            <span className="hidden xl:inline text-slate-500">{SITE_SECTION_BY_ID.map.desktopSuffix}</span>
          </button>

          <button
            onClick={() => handleTabClick(SITE_SECTION_BY_ID['comparative-dashboard'].id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === SITE_SECTION_BY_ID['comparative-dashboard'].id
                ? 'text-emerald-800 bg-emerald-50 border border-emerald-300 font-bold shadow-xs'
                : 'hover:text-emerald-700 hover:bg-slate-100'
            }`}
            title="Dashboard Comparatif Global : Cartes d'impact Scénario A vs B"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
            <span>{SITE_SECTION_BY_ID['comparative-dashboard'].desktopLabel}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
              A vs B
            </span>
          </button>

          <button
            onClick={() => handleTabClick(SITE_SECTION_BY_ID['tipping-points'].id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === SITE_SECTION_BY_ID['tipping-points'].id
                ? 'text-rose-800 bg-rose-50 border border-rose-200 font-semibold shadow-xs'
                : 'hover:text-rose-700 hover:bg-slate-100'
            }`}
            title="Consulter l'état des lieux scientifique des 9 points de bascule climatiques"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>{SITE_SECTION_BY_ID['tipping-points'].desktopLabel}</span>
          </button>

          <button
            onClick={() => handleTabClick(SITE_SECTION_BY_ID.causal.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === SITE_SECTION_BY_ID.causal.id
                ? 'text-amber-900 bg-amber-50 border border-amber-200 font-semibold shadow-xs'
                : 'hover:text-amber-800 hover:bg-slate-100'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-amber-600" />
            <span>{SITE_SECTION_BY_ID.causal.desktopLabel}</span>
            <span className="hidden xl:inline text-slate-500">{SITE_SECTION_BY_ID.causal.desktopSuffix}</span>
          </button>

          <button
            onClick={() => handleTabClick(SITE_SECTION_BY_ID.spec.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === SITE_SECTION_BY_ID.spec.id
                ? 'text-teal-800 bg-teal-50 border border-teal-200 font-semibold shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            <span>{SITE_SECTION_BY_ID.spec.desktopLabel}</span>
          </button>

          <button
            onClick={() => handleTabClick(SITE_SECTION_BY_ID.sources.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
              currentTab === SITE_SECTION_BY_ID.sources.id
                ? 'text-sky-800 bg-sky-50 border border-sky-200 font-semibold shadow-xs'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Consulter l'ensemble des sources, données et publications scientifiques vérifiées"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>{SITE_SECTION_BY_ID.sources.desktopLabel}</span>
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
            onClick={() => handleTabClick(SITE_SECTION_BY_ID.map.id)}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === SITE_SECTION_BY_ID.map.id
                ? 'bg-sky-50 text-sky-800 border border-sky-200 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <span className="block font-semibold text-slate-900">{SITE_SECTION_BY_ID.map.mobileLabel}</span>
                <span className="block text-[11px] text-slate-500 font-normal">Cartes biophysiques, stress thermique et courbes KPI</span>
              </div>
            </div>
            {currentTab === SITE_SECTION_BY_ID.map.id && <span className="w-2 h-2 rounded-full bg-sky-600" />}
          </button>

          <button
            onClick={() => handleTabClick(SITE_SECTION_BY_ID['comparative-dashboard'].id)}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === SITE_SECTION_BY_ID['comparative-dashboard'].id
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="block font-semibold text-slate-900">{SITE_SECTION_BY_ID['comparative-dashboard'].mobileLabel}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                    A vs B
                  </span>
                </div>
                <span className="block text-[11px] text-slate-500 font-normal">Cartes d'impact synthétisant les bénéfices de l'action</span>
              </div>
            </div>
            {currentTab === SITE_SECTION_BY_ID['comparative-dashboard'].id && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
          </button>

          <button
            onClick={() => handleTabClick(SITE_SECTION_BY_ID['tipping-points'].id)}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === SITE_SECTION_BY_ID['tipping-points'].id
                ? 'bg-rose-50 text-rose-800 border border-rose-200 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="block font-semibold text-slate-900">{SITE_SECTION_BY_ID['tipping-points'].mobileLabel}</span>
                <span className="block text-[11px] text-slate-500 font-normal">Diagnostic des 9 seuils critiques du système Terre</span>
              </div>
            </div>
            {currentTab === SITE_SECTION_BY_ID['tipping-points'].id && <span className="w-2 h-2 rounded-full bg-rose-600" />}
          </button>

          <button
            onClick={() => handleTabClick(SITE_SECTION_BY_ID.causal.id)}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === SITE_SECTION_BY_ID.causal.id
                ? 'bg-amber-50 text-amber-900 border border-amber-200 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Network className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="block font-semibold text-slate-900">{SITE_SECTION_BY_ID.causal.mobileLabel}</span>
                <span className="block text-[11px] text-slate-500 font-normal">Traçabilité physique de l'EROI et d'Haber-Bosch</span>
              </div>
            </div>
            {currentTab === SITE_SECTION_BY_ID.causal.id && <span className="w-2 h-2 rounded-full bg-amber-600" />}
          </button>

          <button
            onClick={() => handleTabClick(SITE_SECTION_BY_ID.spec.id)}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === SITE_SECTION_BY_ID.spec.id
                ? 'bg-teal-50 text-teal-800 border border-teal-200 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <span className="block font-semibold text-slate-900">{SITE_SECTION_BY_ID.spec.mobileLabel}</span>
                <span className="block text-[11px] text-slate-500 font-normal">Formules biophysiques détaillées et équations différentielles</span>
              </div>
            </div>
            {currentTab === SITE_SECTION_BY_ID.spec.id && <span className="w-2 h-2 rounded-full bg-teal-600" />}
          </button>

          <button
            onClick={() => handleTabClick(SITE_SECTION_BY_ID.sources.id)}
            className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
              currentTab === SITE_SECTION_BY_ID.sources.id
                ? 'bg-sky-50 text-sky-800 border border-sky-200 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <span className="block font-semibold text-slate-900">{SITE_SECTION_BY_ID.sources.mobileLabel}</span>
                <span className="block text-[11px] text-slate-500 font-normal">Publications à comité de lecture et bases de données vérifiées</span>
              </div>
            </div>
            {currentTab === SITE_SECTION_BY_ID.sources.id && <span className="w-2 h-2 rounded-full bg-sky-600" />}
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

