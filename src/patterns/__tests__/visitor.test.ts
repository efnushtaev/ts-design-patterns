import { test, expect } from 'vitest';
import { CountingVisitor } from '../behavioral/visitor';

test('CountingVisitor counts by id extractor', () => {
  const v = new CountingVisitor<{ id: string }>(x => x.id);
  v.visit({ id: 'a' });
  v.visit({ id: 'b' });
  v.visit({ id: 'a' });
  expect(v.getCount('a')).toBe(2);
  expect(v.getCount('b')).toBe(1);
});
