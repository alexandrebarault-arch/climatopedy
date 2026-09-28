import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

const INERTIA_STAGES = [
  {
    title: 'Équipements déjà en place',
    description: 'Routes, voitures, usines et centrales ont été construites pour servir pendant des années.'
  },
  {
    title: "Besoins réguliers d'énergie",
    description: "Il faut leur fournir de l'énergie, les entretenir et remplacer les pièces usées."
  },
  {
    title: 'Renouvellement progressif',
    description: 'Remplacer un réseau ou un parc entier demande du temps, des investissements et des solutions de rechange.'
  },
  {
    title: 'Le changement prend du temps',
    description: "Cette inertie peut ralentir la baisse de la consommation d'énergie, sans la rendre impossible."
  }
];

export const SocietalInertiaSchematic: React.FC = () => (
  <figure
    role="figure"
    aria-label="Pourquoi les infrastructures ralentissent le changement"
    className="h-full w-full p-4 sm:p-5 bg-slate-50 flex flex-col justify-center"
  >
    <figcaption className="text-sm font-semibold text-slate-800 mb-3">
      Comment les infrastructures rendent les changements progressifs
    </figcaption>
    <ol className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
      {INERTIA_STAGES.map((stage, index) => (
        <React.Fragment key={stage.title}>
          <li className="flex-1 min-w-0 p-3 rounded-lg bg-white border border-slate-200 shadow-2xs h-full">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 shrink-0 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-[11px] font-bold text-sky-800">
                {index + 1}
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-800 leading-snug">{stage.title}</h4>
                <p className="text-[11px] text-slate-600 leading-snug mt-1">{stage.description}</p>
              </div>
            </div>
          </li>
          {index < INERTIA_STAGES.length - 1 && (
            <span aria-hidden="true" className="self-center text-sky-600">
              <ArrowDown className="w-4 h-4 sm:hidden" />
              <ArrowRight className="w-4 h-4 hidden sm:block" />
            </span>
          )}
        </React.Fragment>
      ))}
    </ol>
  </figure>
);
