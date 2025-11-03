# Корзина покупок

Модуль реализует функциональность корзины покупок с использованием паттернов проектирования.

## Использованные паттерны

### Command и Memento
- Отмена/повтор действий с товарами (добавление, изменение количества)
- Сохранение состояний корзины для возможности отката
- Реализовано в классах `AddItemCommand`, `UpdateQuantityCommand`

### Observer
- Уведомления об изменениях в корзине (добавление/удаление товаров, изменение количества)
- Корзина наследует `Observable` и отправляет события `CartEvent`

### State
- Управление состояниями корзины: пустая, активная, оформление, завершена
- Реализовано через `StateContext` и классы состояний (`EmptyCartState`, `ActiveCartState` и т.д.)

### Strategy
- Различные стратегии расчета стоимости:
  - `RegularPriceStrategy` - обычный расчет
  - `DiscountPriceStrategy` - расчет со скидкой

## Примеры использования

```typescript
// Создание корзины
const cart = new ShoppingCart();

// Добавление товара (через Command)
cart.addItem({
  id: '1',
  name: 'Телефон',
  price: 1000,
  quantity: 1
});

// Подписка на изменения
cart.subscribe({
  update: (event: CartEvent) => {
    console.log('Корзина изменена:', event);
  }
});

// Отмена/повтор
cart.undo(); // отменить последнее действие
cart.redo(); // повторить отмененное действие

// Смена стратегии расчета
cart.setPriceStrategy(new DiscountPriceStrategy());
const total = cart.calculateTotal(0.1); // расчет со скидкой 10%

// Управление состоянием
cart.proceedToCheckout(); // переход к оформлению
cart.complete(); // завершение заказа
```

## Структура модуля

- `cart.ts` - основная реализация корзины
- `patterns/` - базовые реализации паттернов
  - `command.ts` - паттерн Command
  - `memento.ts` - паттерн Memento
  - `observer.ts` - паттерн Observer
  - `state.ts` - паттерн State
  - `strategy.ts` - паттерн Strategy