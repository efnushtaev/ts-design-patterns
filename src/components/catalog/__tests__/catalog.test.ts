import { test, expect } from 'vitest';
import { buildSampleCatalog, Catalog } from '../catalog';

test('buildSampleCatalog creates categories and products and flyweight pool', async () => {
  const { catalog, products } = buildSampleCatalog('ph');
  // count products via deepProducts generator
  const all: any[] = [];
  for (const p of catalog.deepProducts(catalog.root as any)) {
    all.push(p);
  }
  expect(all.length).toBe(3);
  // flyweight pool should be 3 (each intrinsic used once in sample)
  expect(catalog.flyweightPoolSize()).toBe(3);
  // load an image
  const img = await products.p1.loadImage();
  expect(img).toBe('https://img/phone-x');
});
