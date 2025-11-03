import { test, expect } from 'vitest';
import { ShoppingCart, CartStateType, RegularPriceStrategy, DiscountPriceStrategy } from '../cart';

test('ShoppingCart: основной функционал', () => {
  const cart = new ShoppingCart();
  const events: any[] = [];

  // Подписываемся на события
  cart.subscribe({
    update: (event) => events.push(event)
  });

  // Проверяем начальное состояние
  expect(cart.getCartState()).toBe(CartStateType.Empty);

  // Добавляем товар
  cart.addItem({
    id: '1',
    name: 'Test Product',
    price: 100,
    quantity: 1
  });

  // Проверяем состояние после добавления
  expect(cart.getCartState()).toBe(CartStateType.Active);
  expect(events[0]).toEqual({
    type: 'itemAdded',
    item: expect.objectContaining({ id: '1' })
  });

  // Меняем количество
  cart.updateQuantity('1', 2);
  expect(cart.getItem('1')?.quantity).toBe(2);

  // Отменяем изменение количества
  cart.undo();
  expect(cart.getItem('1')?.quantity).toBe(1);

  // Повторяем изменение
  cart.redo();
  expect(cart.getItem('1')?.quantity).toBe(2);

  // Проверяем разные стратегии расчета
  expect(cart.calculateTotal()).toBe(200); // 2 * 100

  cart.setPriceStrategy(new DiscountPriceStrategy());
  expect(cart.calculateTotal(0.1)).toBe(180); // (2 * 100) * 0.9

  // Проверяем смену состояний
  cart.proceedToCheckout();
  expect(cart.getCartState()).toBe(CartStateType.Checkout);

  cart.complete();
  expect(cart.getCartState()).toBe(CartStateType.Completed);
});