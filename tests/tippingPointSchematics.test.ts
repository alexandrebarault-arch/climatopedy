import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { test } from 'node:test';
import { TippingPointSchematic } from '../src/components/TippingPointSchematic.tsx';

const schematicCases = [
  ['greenland', 'Fonte de surface'],
  ['wais', 'Eau océanique plus chaude'],
  ['corals', 'Blanchissement'],
  ['amazon', 'Humidité recyclée'],
  ['permafrost', 'Sol gelé en profondeur'],
  ['barents_ice', 'Eau libre : plus de chaleur absorbée'],
  ['amoc', 'Retour en profondeur vers le sud'],
  ['boreal_forest', 'Sécheresse et incendie'],
  ['wilkes_basin', 'Bassin rocheux sous le niveau marin']
] as const;

test('each major tipping point has an accessible, distinct explanatory schematic', () => {
  for (const [elementId, explanation] of schematicCases) {
    const markup = renderToStaticMarkup(createElement(TippingPointSchematic, { elementId }));

    assert.match(markup, /role="img"/);
    assert.match(markup, /<title>/);
    assert.ok(markup.includes(explanation), `${elementId} should explain its own mechanism`);
  }
});
