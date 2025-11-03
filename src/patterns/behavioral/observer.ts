/**
 * Интерфейс наблюдателя.
 * Определяет метод, который будет вызван при изменении наблюдаемого объекта.
 * 
 * @template T Тип данных, передаваемых наблюдателю
 */
export interface IObserver<T> {
  /**
   * Обработать уведомление об изменении
   * @param data Данные, связанные с изменением
   */
  update(data: T): void;
}

/**
 * Интерфейс наблюдаемого объекта.
 * Определяет методы для управления подписчиками.
 * 
 * @template T Тип данных, передаваемых наблюдателям
 */
export interface IObservable<T> {
  /**
   * Подписать наблюдателя на уведомления
   * @param observer Наблюдатель для подписки
   */
  subscribe(observer: IObserver<T>): void;

  /**
   * Отписать наблюдателя от уведомлений
   * @param observer Наблюдатель для отписки
   */
  unsubscribe(observer: IObserver<T>): void;

  /**
   * Уведомить всех подписчиков об изменении
   * @param data Данные для передачи подписчикам
   */
  notify(data: T): void;
}

/**
 * Базовая реализация наблюдаемого объекта.
 * Хранит список подписчиков и уведомляет их при изменениях.
 * 
 * @template T Тип данных, передаваемых наблюдателям
 */
export class Observable<T> implements IObservable<T> {
  private observers: Set<IObserver<T>> = new Set();

  subscribe(observer: IObserver<T>): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: IObserver<T>): void {
    this.observers.delete(observer);
  }

  notify(data: T): void {
    this.observers.forEach(observer => observer.update(data));
  }
}