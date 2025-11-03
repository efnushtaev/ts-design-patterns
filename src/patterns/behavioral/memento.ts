/**
 * Интерфейс для объекта, чье состояние нужно сохранять.
 */
export interface IOriginator<T> {
  /** 
   * Создать снимок текущего состояния
   * @returns Объект Memento с сохраненным состоянием
   */
  createMemento(): IMemento<T>;

  /** 
   * Восстановить состояние из снимка
   * @param memento Снимок состояния для восстановления
   */
  restoreFromMemento(memento: IMemento<T>): void;
}

/**
 * Интерфейс снимка состояния.
 * Хранит состояние объекта IOriginator.
 * 
 * @template T Тип сохраняемого состояния
 */
export interface IMemento<T> {
  /** Получить сохраненное состояние */
  getState(): T;
}

/**
 * Базовая реализация снимка состояния.
 */
export class Memento<T> implements IMemento<T> {
  constructor(private state: T) {}

  getState(): T {
    return this.state;
  }
}

/**
 * Хранитель снимков состояния.
 * Позволяет сохранять историю состояний и восстанавливать их.
 * 
 * @template T Тип сохраняемого состояния
 */
export class MementoCaretaker<T> {
  private mementos: IMemento<T>[] = [];
  private current = -1;

  /**
   * Сохранить новое состояние
   * @param memento Снимок состояния для сохранения
   */
  save(memento: IMemento<T>): void {
    // При сохранении нового состояния удаляем все последующие
    this.mementos.splice(this.current + 1);
    this.mementos.push(memento);
    this.current++;
  }

  /**
   * Получить предыдущее сохраненное состояние
   * @returns Снимок состояния или null, если истории нет
   */
  undo(): IMemento<T> | null {
    if (this.current <= 0) return null;
    this.current--;
    return this.mementos[this.current];
  }

  /**
   * Получить следующее сохраненное состояние
   * @returns Снимок состояния или null, если нет следующего состояния
   */
  redo(): IMemento<T> | null {
    if (this.current >= this.mementos.length - 1) return null;
    this.current++;
    return this.mementos[this.current];
  }
}