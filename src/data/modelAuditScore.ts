export interface ModelAuditCriterion {
  id: string;
  title: string;
  rating: number;
  rationale: string;
}

/**
 * Internal, evidence-based audit of the currently implemented model.
 * Each criterion is rated 0–4 and has equal weight (20 points).
 * Ratings are explicit audit judgments; the total is calculated, not a
 * probability that a model output is correct.
 */
export const MODEL_AUDIT_CRITERIA: ModelAuditCriterion[] = [
  {
    id: 'data',
    title: 'Données et traçabilité',
    rating: 2,
    rationale: 'Plusieurs repères mondiaux sont sourcés, mais des entrées régionales et des séries historiques sont reconstruites ou simplifiées.'
  },
  {
    id: 'foundations',
    title: 'Fondements physiques et mathématiques',
    rating: 2,
    rationale: 'Le code reprend des méthodes publiées pour certains calculs, avec aussi des équations internes et des coefficients qui ne sont pas calibrés sur des observations.'
  },
  {
    id: 'fit',
    title: 'Adéquation des méthodes aux résultats affichés',
    rating: 1,
    rationale: 'Des moyennes mondiales et paramètres simplifiés sont transposés à des résultats régionaux ou sanitaires que ces méthodes ne valident pas.'
  },
  {
    id: 'validation',
    title: 'Validation indépendante',
    rating: 0,
    rationale: 'Aucune validation systématique sur des observations laissées de côté pendant le réglage n’est documentée; interpoler des valeurs historiques saisies ne constitue pas un test du modèle.'
  },
  {
    id: 'uncertainty',
    title: 'Incertitude et sensibilité',
    rating: 1,
    rationale: 'Des scénarios et quelques paramètres variables sont proposés, mais les sorties ne sont pas accompagnées d’ensembles probabilistes ou d’une propagation complète des incertitudes.'
  }
];

export const MODEL_AUDIT_MAX_RATING = 4;

export const MODEL_AUDIT_SCORE = Math.round(
  (MODEL_AUDIT_CRITERIA.reduce((sum, criterion) => sum + criterion.rating, 0) /
    (MODEL_AUDIT_CRITERIA.length * MODEL_AUDIT_MAX_RATING)) *
    100
);
