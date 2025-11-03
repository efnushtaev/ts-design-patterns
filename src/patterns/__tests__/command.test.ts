import { test, expect } from 'vitest';
import { CommandHistory, ICommand } from '../behavioral/command';

class TestCommand implements ICommand {
  constructor(
    private value: number,
    private target: { value: number }
  ) {}

  execute(): void {
    this.target.value = this.value;
  }

  undo(): void {
    this.target.value = this.value - 1;
  }
}

test('Command: выполнение и отмена команд', () => {
  const history = new CommandHistory();
  const target = { value: 0 };

  // Выполнение команды
  const cmd1 = new TestCommand(1, target);
  history.execute(cmd1);
  expect(target.value).toBe(1);

  // Отмена команды
  history.undo();
  expect(target.value).toBe(0);

  // Повтор команды
  history.redo();
  expect(target.value).toBe(1);
});