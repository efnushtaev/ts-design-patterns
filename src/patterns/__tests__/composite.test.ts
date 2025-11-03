import { test, expect } from 'vitest';
import { Composite, LeafCategory, IComposite } from '../structural/composite';

test('Composite: добавление иерархии и элементов', () => {
  // Создаём корневой узел
  const root = new Composite<string>('root');
  // Создаём подкатегории
  const cat1 = new Composite<string>('cat1');
  const cat2 = new LeafCategory<string>('cat2');
  // Добавляем подкатегории в корень
  root.addChild(cat1);
  root.addChild(cat2);
  // Добавляем элементы
  root.addItem('rootItem');
  cat1.addItem('item1');
  cat2.addItem('item2');

  // Проверяем структуру
  expect(root.getChildren().length).toBe(2);
  expect(root.getItems()).toEqual(['rootItem']);
  expect(cat1.getItems()).toEqual(['item1']);
  expect(cat2.getItems()).toEqual(['item2']);

  // Удаляем подкатегорию
  root.removeChild(cat2);
  expect(root.getChildren().length).toBe(1);

  // Удаляем элемент
  cat1.removeItem('item1');
  expect(cat1.getItems()).toEqual([]);
});
