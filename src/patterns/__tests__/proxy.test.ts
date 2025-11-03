import { test, expect } from 'vitest';
import { ImageProxy } from '../structural/proxy';

test('ImageProxy loads image URL', async () => {
  const url = 'https://img/test';
  const p = new ImageProxy(url, 'ph');
  const result = await p.load();
  expect(result).toBe(url);
});
