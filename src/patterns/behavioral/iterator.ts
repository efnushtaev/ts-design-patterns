/**
 * Интерфейс итератора.
 * Определяет методы для последовательного доступа к элементам коллекции.
 * 
 * @template T Тип элементов в коллекции
 */
export interface IIterator<T> {
  /** 
   * Возвращает следующий элемент и сдвигает указатель вперед.
   * @returns Следующий элемент или null, если элементы закончились
   */
  next(): T | null;

  /**
   * Проверяет, есть ли следующий элемент.
   * @returns true если есть следующий элемент, false если достигнут конец
   */
  hasNext(): boolean;

  /**
   * Сбрасывает итератор в начальное положение.
   * После вызова начнет обход с первого элемента.
   */
  reset(): void;
}

/**
 * Реализация итератора для массива.
 * Предоставляет последовательный доступ к элементам массива
 * с возможностью сброса позиции.
 * 
 * @template T Тип элементов массива
 */
export class ArrayIterator<T> implements IIterator<T> {
  /** Текущая позиция в массиве */
  private index = 0;

  /**
   * @param collection Массив для итерации
   */
  constructor(private collection: T[]) {}

  /** @inheritdoc */
  next(): T | null {
    if (this.hasNext()) {
      return this.collection[this.index++];
    }
    return null;
  }

  /** @inheritdoc */
  hasNext(): boolean {
    return this.index < this.collection.length;
  }

  /** @inheritdoc */
  reset(): void {
    this.index = 0;
  }
}
