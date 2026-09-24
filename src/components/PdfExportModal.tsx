import React, { useState } from 'react';
import {
  FileDown,
  FileText,
  Check,
  X,
  TrendingDown,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { GlobalBiophysicalState, SimulationScenarioConfig } from '../types/simulation';
import { downloadSimulationPdfReport } from '../utils/pdfReportGenerator';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarioA: SimulationScenarioConfig;
  scenarioB: SimulationScenarioConfig;
  isCompareMode: boolean;
  currentYear: number;
  trajectoryA: GlobalBiophysicalState[];
  trajectoryB: GlobalBiophysicalState[];
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  scenarioA,
  scenarioB,
  isCompareMode,
  currentYear,
  trajectoryA,
  trajectoryB
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      downloadSimulationPdfReport({
        scenarioA,
        scenarioB,
        isCompareMode,
        currentYear,
        trajectoryA,
        trajectoryB
      });
      setIsGenerating(false);
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Erreur lors de la génération du PDF :', err);
      setIsGenerating(false);
    }
  };

  const state2100A = trajectoryA.find(s => s.year === 2100) || trajectoryA[trajectoryA.length - 1];
  const state2100B = trajectoryB.find(s => s.year === 2100) || trajectoryB[trajectoryB.length - 1];
  const finalTemp = isCompareMode ? state2100B.surfaceTemperatureAnomaly : state2100A.surfaceTemperatureAnomaly;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col text-slate-700"
        role="dialog"
        aria-modal="true"
      >
        {/* En-tête du modal */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-600">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 tracking-tight">
                Exporter le Rapport de Simulation PDF
              </h3>
              <p className="text-xs text-slate-500">
                Document scientifique complet imprimable (A4 - 3 pages vectorielles)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fermer la fenêtre"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps du modal : Aperçu des sections incluses */}
        <div className="p-5 sm:p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {/* Sommaire du contenu du rapport */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="text-xs font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Contenu généré dans le document PDF :
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-[10px] font-bold text-sky-700 shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-slate-800">Page 1 : Synthèse Exécutive & Scénarios</strong>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Fiche d'identité des scénarios actifs ({scenarioA.shortName} {isCompareMode ? `vs ${scenarioB.shortName}` : ''}), 
                    tableau comparatif 2026 / 2050 / 2100 et indice de confiance biophysique de 88%.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-[10px] font-bold text-sky-700 shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-slate-800">Page 2 : 6 Graphiques Biophysiques Vectoriels (1900–2100)</strong>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Tracés haute précision : Température FaIR, Production pétrolière Mb/j, Rendements agricoles %, Démographie humaine, Niveau marin et Mortalité caniculaire Stull Tw.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-[10px] font-bold text-sky-700 shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-slate-800">Page 3 : Diagnostic des Points de Bascule & Conclusions 2100</strong>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Évaluation des 9 points de bascule (Science 2022) pour la température finale (+{finalTemp.toFixed(2)}°C), 
                    et message prospectif pour les générations futures.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rappel des données actives */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-slate-500 text-[11px] block">Année active simulée</span>
              <span className="text-base font-bold font-mono text-sky-700">
                Année {Math.floor(currentYear)}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <span className="text-slate-500 text-[11px] block">Mode de simulation</span>
              <span className="text-xs font-semibold text-emerald-700">
                {isCompareMode ? 'Comparaison 2 Scénarios (A vs B)' : 'Scénario unique'}
              </span>
            </div>
          </div>

          {/* Feedback de téléchargement */}
          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Document téléchargé avec succès !</strong> Le fichier PDF est prêt à être consulté ou imprimé.
              </span>
            </div>
          )}
        </div>

        {/* Pied du modal avec boutons d'action */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Fermer
          </button>

          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-sky-300 text-white text-xs font-bold shadow-md shadow-sky-600/20 cursor-pointer transition-all hover:scale-[1.02]"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Génération du PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Télécharger le Rapport PDF (A4)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
