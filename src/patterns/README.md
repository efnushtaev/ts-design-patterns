# Паттерны (локально)

В этой папке находятся переиспользуемые реализации паттернов проектирования, используемые в проекте каталога товаров.

Реализованные паттерны:

### Структурные паттерны (structural)
- **Composite** (generic) — древовидная структура с хранением элементов в узлах (src/patterns/structural/composite.ts)
- **Proxy** — ленивый загрузчик изображений (src/patterns/structural/proxy.ts)
- **Flyweight** — фабрика для общих (intrinsic) данных товаров (src/patterns/structural/flyweight.ts)

### Поведенческие паттерны (behavioral)
- **Iterator** — итератор для массивов (src/patterns/behavioral/iterator.ts)
- **Visitor** — generic Visitor/Visitable и пример CountingVisitor (src/patterns/behavioral/visitor.ts)
- **Command** — паттерн для инкапсуляции действий и их отмены (src/patterns/behavioral/command.ts)
- **Memento** — сохранение и восстановление состояния объектов (src/patterns/behavioral/memento.ts)
- **Observer** — механизм подписки на события и уведомлений (src/patterns/behavioral/observer.ts)
- **State** — управление поведением объекта через состояния (src/patterns/behavioral/state.ts)
- **Strategy** — семейство взаимозаменяемых алгоритмов (src/patterns/behavioral/strategy.ts)

## Особенности реализации

Все паттерны:
- Написаны на TypeScript с полной типизацией
- Имеют минимальные внешние зависимости
- Спроектированы для повторного использования
- Содержат подробные JSDoc комментарии
- Покрыты unit-тестами

## Примеры использования

### Command и Memento (отмена/повтор действий)
```typescript
const history = new CommandHistory();
const command = new AddItemCommand(cart, item);
history.execute(command); // выполнить
history.undo();          // отменить
history.redo();          // повторить
```

### Observer (подписка на события)
```typescript
const observable = new Observable<CartEvent>();
observable.subscribe({
  update: (event) => console.log('Получено событие:', event)
});
observable.notify({ type: 'itemAdded', item });
```

### State (управление состояниями)
```typescript
const context = new StateContext(new EmptyCartState());
context.setState(new ActiveCartState()); // переход в новое состояние
```

### Strategy (разные алгоритмы)
```typescript
const context = new StrategyContext(new RegularPriceStrategy());
context.setStrategy(new DiscountPriceStrategy()); // смена алгоритма
const result = context.execute(data);
```
