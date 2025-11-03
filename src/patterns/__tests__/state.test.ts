import { test, expect } from 'vitest';
import { StateContext, IState } from '../behavioral/state';

enum TestState {
  A = 'A',
  B = 'B',
  C = 'C'
}

class TestStateA implements IState<TestState> {
  getType(): TestState {
    return TestState.A;
  }
  canTransitTo(to: TestState): boolean {
    return to === TestState.B;
  }
}

class TestStateB implements IState<TestState> {
  getType(): TestState {
    return TestState.B;
  }
  canTransitTo(to: TestState): boolean {
    return to === TestState.C;
  }
}

test('State: переходы между состояниями', () => {
  const context = new StateContext<TestState>(new TestStateA());
  
  // Проверяем начальное состояние
  expect(context.getState().getType()).toBe(TestState.A);

  // Проверяем допустимый переход
  const stateB = new TestStateB();
  context.setState(stateB);
  expect(context.getState().getType()).toBe(TestState.B);

  // Проверяем недопустимый переход
  const stateA = new TestStateA();
  expect(() => context.setState(stateA)).toThrow();
});