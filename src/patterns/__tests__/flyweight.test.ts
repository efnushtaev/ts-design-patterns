import { test, expect } from 'vitest';
import { ProductFlyweightFactory } from '../structural/flyweight';

test('Flyweight reuses identical intrinsic objects', () => {
  const f = new ProductFlyweightFactory();
  const a = { name: 'Phone', price: 100, imageUrl: 'u' };
  const b = { name: 'Phone', price: 100, imageUrl: 'u' };
  const wa = f.getFlyweight(a);
  const wb = f.getFlyweight(b);
  expect(wa).toBe(wb);
  expect(f.getPoolSize()).toBe(1);
});
