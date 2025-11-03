/**
 * Интерфейс посетителя в паттерне Visitor.
 * Определяет операцию, которая может быть выполнена над элементом.
 * 
 * @template T Тип посещаемого элемента
 */
export interface Visitor<T> {
  /**
   * Выполняет операцию над элементом.
   * @param element Элемент, который нужно посетить
   */
  visit(element: T): void;
}

/**
 * Интерфейс посещаемого элемента.
 * Объекты, реализующие этот интерфейс, могут быть обработаны посетителем.
 * 
 * @template T Тип самого элемента (this)
 */
export interface Visitable<T> {
  /**
   * Принимает посетителя и позволяет ему выполнить операцию над элементом.
   * @param visitor Посетитель, который будет обрабатывать элемент
   */
  accept(visitor: Visitor<T>): void;
}

/**
 * Реализация посетителя для подсчёта посещений элементов.
 * Использует функцию извлечения ID для идентификации элементов.
 * 
 * @template T Тип посещаемого элемента
 */
export class CountingVisitor<T> implements Visitor<T> {
  /** Карта для хранения количества посещений по ID */
  private counts: Map<string, number> = new Map();

  /**
   * @param idFn Функция для извлечения строкового ID из элемента
   */
  constructor(private idFn: (t: T) => string) {}

  /**
   * Посещает элемент и увеличивает счётчик для его ID.
   * @param element Посещаемый элемент
   */
  visit(element: T): void {
    const id = this.idFn(element);
    this.counts.set(id, (this.counts.get(id) ?? 0) + 1);
  }

  /**
   * Возвращает количество посещений для конкретного ID.
   * @param id ID элемента
   * @returns Количество посещений или 0, если элемент не посещался
   */
  getCount(id: string): number {
    return this.counts.get(id) ?? 0;
  }

  /**
   * Возвращает копию карты всех посещений.
   * @returns Карта ID -> количество посещений
   */
  getAll(): Map<string, number> {
    return new Map(this.counts);
  }
}
