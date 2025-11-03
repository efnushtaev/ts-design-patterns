import { test, expect } from 'vitest';
import { Memento, MementoCaretaker, IOriginator } from '../behavioral/memento';

class TestOriginator implements IOriginator<number> {
  constructor(private state: number) {}

  createMemento() {
    return new Memento(this.state);
  }

  restoreFromMemento(memento: IMemento<number>) {
    this.state = memento.getState();
  }

  getState() {
    return this.state;
  }

  setState(value: number) {
    this.state = value;
  }
}

test('Memento: сохранение и восстановление состояний', () => {
  const originator = new TestOriginator(0);
  const caretaker = new MementoCaretaker<number>();

  // Сохранение состояний
  originator.setState(1);
  caretaker.save(originator.createMemento());
  originator.setState(2);
  caretaker.save(originator.createMemento());

  // Восстановление состояний
  const prevMemento = caretaker.undo();
  if (prevMemento) {
    originator.restoreFromMemento(prevMemento);
    expect(originator.getState()).toBe(1);
  }

  // Повтор изменения
  const nextMemento = caretaker.redo();
  if (nextMemento) {
    originator.restoreFromMemento(nextMemento);
    expect(originator.getState()).toBe(2);
  }
});