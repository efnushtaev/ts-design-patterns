# Каталог товаров

Модуль реализует функциональность каталога товаров с использованием паттернов проектирования.

## Использованные паттерны

### Composite
- Иерархия категорий и товаров (`CatalogCategory`)

### Iterator
- Перебор товаров в категориях (`ArrayIterator`, `productsIterator`, `deepProducts`)

### Proxy
- Ленивая загрузка изображений товаров (`ImageProxy`)

### Flyweight
- Разделение intrinsic-данных товаров (`ProductFlyweightFactory`, `ProductIntrinsic`)

### Visitor
- Сбор статистики и обход товаров (`ViewStatsVisitor`, `applyVisitor`)

## Примеры использования

```typescript
// Создание каталога и фабрики загрузчиков
const imageFactory = (url?: string) => new ImageProxy(url ?? '', 'placeholder');
const catalog = new Catalog(imageFactory);

// Создание категорий
const phones = new CatalogCategory('Phones');
const laptops = new CatalogCategory('Laptops');
catalog.root.addChild(phones);
catalog.root.addChild(laptops);

// Создание товаров
const p1 = catalog.createProduct('p1', { name: 'Phone X', price: 799, imageUrl: 'https://img/phone-x' }, 10);
const p2 = catalog.createProduct('p2', { name: 'Phone Y', price: 599, imageUrl: 'https://img/phone-y' }, 5);
const l1 = catalog.createProduct('l1', { name: 'Laptop Pro', price: 1299, imageUrl: 'https://img/laptop-pro' }, 3);

phones.addItem(p1);
phones.addItem(p2);
laptops.addItem(l1);

// Итерация по товарам
for (const product of catalog.deepProducts(catalog.root)) {
  console.log(product.name);
}

// Сбор статистики через visitor
const visitor = new ViewStatsVisitor();
catalog.applyVisitor(catalog.root, visitor);
```

## Структура модуля

- `catalog.ts` — основная реализация каталога
- `patterns/` — базовые реализации паттернов
  - `composite.ts` — паттерн Composite
  - `iterator.ts` — паттерн Iterator
  - `proxy.ts` — паттерн Proxy
  - `flyweight.ts` — паттерн Flyweight
  - `visitor.ts` — паттерн Visitor
