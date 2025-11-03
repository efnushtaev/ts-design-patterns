import { test, expect } from 'vitest';
import { Observable } from '../behavioral/observer';

test('Observer: подписка и получение уведомлений', () => {
  const observable = new Observable<string>();
  const received: string[] = [];

  // Создаем наблюдателя
  const observer = {
    update: (data: string) => received.push(data)
  };

  // Подписываемся
  observable.subscribe(observer);

  // Отправляем уведомление
  observable.notify('test1');
  expect(received).toEqual(['test1']);

  // Отправляем еще одно уведомление
  observable.notify('test2');
  expect(received).toEqual(['test1', 'test2']);

  // Отписываемся
  observable.unsubscribe(observer);
  observable.notify('test3');
  expect(received).toEqual(['test1', 'test2']); // test3 не должен быть получен
});