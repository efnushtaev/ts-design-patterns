import { test, expect } from 'vitest';
import { StrategyContext, IStrategy } from '../behavioral/strategy';

interface TestContext {
  value: number;
}

class MultiplyStrategy implements IStrategy<TestContext, number> {
  execute(context: TestContext): number {
    return context.value * 2;
  }
}

class AddStrategy implements IStrategy<TestContext, number> {
  execute(context: TestContext): number {
    return context.value + 2;
  }
}

test('Strategy: смена алгоритмов расчета', () => {
  const context = new StrategyContext<TestContext, number>(new MultiplyStrategy());
  const testData = { value: 5 };

  // Проверяем первую стратегию (умножение)
  expect(context.execute(testData)).toBe(10);

  // Меняем стратегию и проверяем новый результат
  context.setStrategy(new AddStrategy());
  expect(context.execute(testData)).toBe(7);
});