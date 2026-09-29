import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { test } from 'node:test';
import { SocietalInertiaSchematic } from '../src/components/SocietalInertiaSchematic.tsx';

test('the social inertia schematic renders an accessible causal sequence', () => {
  const markup = renderToStaticMarkup(createElement(SocietalInertiaSchematic));

  assert.match(markup, /role="figure"/);
  assert.match(markup, /aria-label="Pourquoi les infrastructures ralentissent le changement"/);
  assert.match(markup, /Équipements déjà en place/);
  assert.match(markup, /Besoins réguliers d/);
  assert.match(markup, /Renouvellement progressif/);
  assert.match(markup, /Le changement prend du temps/);
});

