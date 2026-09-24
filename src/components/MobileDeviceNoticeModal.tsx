import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Smartphone,
  X,
  Copy,
  Check,
  Share2,
  Sparkles,
  ExternalLink,
  Layers,
  Clock,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';

interface MobileDeviceNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTutorial?: () => void;
}

export const MobileDeviceNoticeModal: React.FC<MobileDeviceNoticeModalProps> = ({
  isOpen,
  onClose,
  onOpenTutorial
}) => {
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [canShare, setCanShare] = useState<boolean>(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      setCanShare(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleDismiss = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('climatopedy_mobile_notice_dismissed', 'true');
      } catch (e) {
        // Ignorer si localStorage est indisponible en mode privé
      }
    }
    onClose();
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CLIMATOPEDY · Comprendre le Climat & l\'Énergie',
          text: 'Découvre CLIMATOPEDY : l\'encyclopédie interactive du climat, de l\'énergie et de nos trajectoires 2026–2200.',
          url: window.location.href
        });
      } catch (err) {
        // Partage annulé par l'utilisateur
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-notice-title"
    >
      <div className="bg-[#0c1322] border border-cyan-800/60 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-slate-200 relative max-h-[92vh]">
        {/* Grille lumineuse discrète en arrière-plan */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,#0284c715,transparent_60%)]" />

        {/* Bouton fermer en haut à droite */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Fermer la recommandation"
        >
          <X className="w-4 h-4" />
        </button>

        {/* En-tête avec illustration grand écran vs mobile */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-800/90 bg-gradient-to-b from-[#101b30] to-[#0c1322]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-950/90 border border-cyan-700/60 text-cyan-400 shrink-0 shadow-lg shadow-cyan-950/50">
              <div className="flex items-center gap-1">
                <Monitor className="w-5 h-5 text-cyan-300" />
                <span className="text-[10px] text-cyan-500 font-mono font-bold">&gt;</span>
                <Smartphone className="w-4 h-4 text-slate-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase tracking-wider">
                  Recommandation d'Usage
                </span>
                <span className="text-[11px] text-amber-300 font-mono">
                  💻 Grand Écran Recommandé
                </span>
              </div>
              <h2 id="mobile-notice-title" className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
                Prendre le temps d'appréhender le sujet :)
              </h2>
            </div>
          </div>
        </div>

        {/* Corps explicatif */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Vous accédez à <strong>CLIMATOPEDY</strong> depuis un appareil mobile. L'application est consultable sur smartphone, mais sa conception visuelle et pédagogique intègre une <strong>grande richesse d'informations</strong>.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <span className="font-semibold text-white text-xs block font-mono uppercase tracking-wider text-cyan-400">
              Pourquoi privilégier un ordinateur ou une tablette large ?
            </span>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Planisphère &amp; Tableaux Comparatifs :</strong>
                  <span className="text-slate-400 block mt-0.5 text-[11px]">
                    L'analyse simultanée des calques de stress thermique ($Tw$), des courbes $CO_2$ et des 9 points de bascule planétaires demande un grand champ visuel.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Prendre le temps de la réflexion :</strong>
                  <span className="text-slate-400 block mt-0.5 text-[11px]">
                    Comprendre les boucles de rétroaction du climat, de l'EROI pétrolier et de la démographie humaine jusqu'en 2200 requiert du recul et de la curiosité.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Interactivité fine :</strong>
                  <span className="text-slate-400 block mt-0.5 text-[11px]">
                    Inspection granulaire des pays, curseurs de politiques énergétiques et consultation des équations différentielles.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action pour transférer vers son ordinateur */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-800/40 space-y-2">
            <span className="text-xs font-semibold text-cyan-300 block">
              Envie de l'explorer plus tard sur ordinateur ?
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-medium text-xs transition-colors cursor-pointer shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Lien copié dans le presse-papier !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-200" />
                    <span>Copier le lien pour mon ordinateur</span>
                  </>
                )}
              </button>

              {canShare && (
                <button
                  onClick={handleNativeShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-300" />
                  <span>Partager</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Pied de popup : boutons d'action et checkbox */}
        <div className="p-4 sm:p-5 border-t border-slate-800/90 bg-[#0a0f1b] flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>Ne plus afficher cette recommandation</span>
            </label>

            <button
              onClick={handleDismiss}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-950/60 transition-all cursor-pointer hover:scale-102"
            >
              <span>Continuer sur mobile</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
