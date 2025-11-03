/**
 * Интерфейс компонента в паттерне Composite.
 * Определяет общее поведение для контейнеров (узлов) и листьев в древовидной структуре.
 * 
 * @template T Тип элементов, хранимых в структуре
 */
export interface IComposite<T> {
  /** Получить имя компонента */
  getName(): string;
  /** Добавить дочерний компонент в текущий узел */
  addChild(child: IComposite<T>): void;
  /** Удалить дочерний компонент из текущего узла */
  removeChild(child: IComposite<T>): void;
  /** Получить список всех дочерних компонентов */
  getChildren(): IComposite<T>[];
  /** Добавить элемент в текущий узел */
  addItem(item: T): void;
  /** Удалить элемент из текущего узла */
  removeItem(item: T): void;
  /** Получить список всех элементов в текущем узле */
  getItems(): T[];
}

/**
 * Реализация узла в древовидной структуре по паттерну Composite.
 * Может содержать как другие узлы (подкатегории), так и конечные элементы.
 * 
 * @template T Тип элементов, хранимых в структуре
 */
export class Composite<T> implements IComposite<T> {
  /** Массив дочерних компонентов */
  private children: IComposite<T>[] = [];
  /** Массив элементов текущего узла */
  private items: T[] = [];

  constructor(private name: string) {}

  /** @inheritdoc */
  getName(): string {
    return this.name;
  }

  /** 
   * Добавляет дочерний компонент в текущий узел.
   * Используется для построения иерархии.
   */
  addChild(child: IComposite<T>): void {
    this.children.push(child);
  }

  /**
   * Удаляет указанный дочерний компонент из текущего узла.
   * Если компонент не найден, ничего не происходит.
   */
  removeChild(child: IComposite<T>): void {
    this.children = this.children.filter(c => c !== child);
  }

  /**
   * Возвращает копию массива дочерних компонентов.
   * Копия нужна для предотвращения внешней модификации массива.
   */
  getChildren(): IComposite<T>[] {
    return [...this.children];
  }

  /**
   * Добавляет элемент в текущий узел.
   * Элементы хранятся отдельно от дочерних компонентов.
   */
  addItem(item: T): void {
    this.items.push(item);
  }

  /**
   * Удаляет указанный элемент из текущего узла.
   * Если элемент не найден, ничего не происходит.
   */
  removeItem(item: T): void {
    this.items = this.items.filter(i => i !== item);
  }

  /**
   * Возвращает копию массива элементов текущего узла.
   * Копия нужна для предотвращения внешней модификации массива.
   */
  getItems(): T[] {
    return [...this.items];
  }
}

// Алиас листа для удобства, когда категория не содержит подкатегорий
/**
 * Специализированный класс для листьев дерева (узлов без подкатегорий).
 * Наследует всю функциональность Composite, но семантически означает конечный узел.
 * 
 * @template T Тип элементов, хранимых в структуре
 */
export class LeafCategory<T> extends Composite<T> {
  constructor(name: string) {
    super(name);
  }
}
