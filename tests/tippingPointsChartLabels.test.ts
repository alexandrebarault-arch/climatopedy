import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { test } from 'node:test';
import { TippingPointsChart } from '../src/components/TippingPointsChart.tsx';

test('the tipping-points chart shows the complete name across wrapped SVG lines', () => {
  const name = 'Calotte glaciaire du Groenland';
  const markup = renderToStaticMarkup(createElement(TippingPointsChart, {
    elements: [{
      id: 'greenland',
      name,
      category: 'cryosphere',
      categoryLabel: 'Glaces & Pôles',
      thresholdMin: 0.8,
      thresholdEst: 1.5,
      thresholdMax: 3,
      estimatedYearTendency: 'Aucune date établie'
    } as never],
    currentTemp: 1.3,
    onTempChange: () => {},
    selectedElementId: 'greenland',
    onSelectElement: () => {}
  }));

  assert.ok(markup.includes('Calotte glaciaire'));
  assert.ok(markup.includes('du Groenland'));
  assert.ok(!markup.includes('Calotte glaciaire du Gro...'));
});
