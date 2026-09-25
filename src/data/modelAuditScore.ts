export interface ModelAuditCriterion {
  id: string;
  title: string;
  rating: number;
  weight: number;
  rationale: string;
}

/**
 * Global-scale evidence audit of CLIMATOPEDY's climate-biophysical backbone.
 * This is a weighted rubric, not a probability or a validation certificate.
 * Regional, health, demographic and food-access indicators are assessed
 * separately in ModelConfidenceGuide and are not averaged into this score.
 */
export const MODEL_AUDIT_CRITERIA: ModelAuditCriterion[] = [
  {
    id: 'global-anchors',
    title: 'Ancrage sur les observations mondiales',
    rating: 4,
    weight: 25,
    rationale: 'Les repères mondiaux de CO₂ et de température utilisés au départ sont rattachés à des séries publiées, datées et définies. Cela valide l’ancrage, pas les calculs futurs.'
  },
  {
    id: 'global-physics',
    title: 'Fondements biophysiques globaux',
    rating: 2,
    weight: 25,
    rationale: 'Le moteur représente des mécanismes planétaires pertinents (carbone, réponse thermique et niveau marin), mais plusieurs équations et paramètres sont propres au site et ne reproduisent pas un modèle évalué de bout en bout.'
  },
  {
    id: 'global-benchmarks',
    title: 'Ordres de grandeur mondiaux',
    rating: 2,
    weight: 25,
    rationale: 'La température, le CO₂ et le niveau marin mondiaux recoupent des enveloppes ou ordres de grandeur publiés. Mais les scénarios ne sont pas équivalents, certaines enveloppes sont très larges et les références temporelles diffèrent : contrôle de plausibilité, pas validation.'
  },
  {
    id: 'scenario-scope',
    title: 'Scénarios et portée des résultats',
    rating: 3,
    weight: 15,
    rationale: 'Les trajectoires sont maintenant décrites comme conditionnelles et internes à CLIMATOPEDY. Les résultats à long terme restent sensibles aux hypothèses d’émissions et de ressources choisies.'
  },
  {
    id: 'global-uncertainty',
    title: 'Incertitudes et sensibilité',
    rating: 1,
    weight: 10,
    rationale: 'Le site permet de comparer des scénarios, mais ne calcule pas encore un ensemble de simulations avec propagation complète des incertitudes et plages probabilistes.'
  }
];

export const MODEL_AUDIT_MAX_RATING = 4;
export const MODEL_AUDIT_WEIGHT_TOTAL = MODEL_AUDIT_CRITERIA.reduce(
  (sum, criterion) => sum + criterion.weight,
  0
);

export const MODEL_AUDIT_SCORE = Math.round(
  (MODEL_AUDIT_CRITERIA.reduce(
    (sum, criterion) => sum + criterion.weight * criterion.rating,
    0
  ) /
    (MODEL_AUDIT_WEIGHT_TOTAL * MODEL_AUDIT_MAX_RATING)) *
    100
);
