import { test, expect } from 'vitest';
import { ArrayIterator } from '../behavioral/iterator';

test('ArrayIterator iterates and resets', () => {
  const arr = [1, 2, 3];
  const it = new ArrayIterator(arr);
  const out: number[] = [];
  while (it.hasNext()) {
    const v = it.next();
    if (v !== null) out.push(v);
  }
  expect(out).toEqual([1,2,3]);
  it.reset();
  expect(it.next()).toBe(1);
});
