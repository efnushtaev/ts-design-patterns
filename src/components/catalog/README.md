# Каталог товаров

Этот модуль показывает пример использования паттернов в блоке "Каталог товаров": Composite, Iterator, Proxy, Flyweight, Visitor.

Коротко:
- `CatalogCategory` — категория каталога (Composite)
- `Product` — товар, использует Flyweight для общих данных (название, описание, цена) и Proxy для ленивой загрузки изображения
- `ArrayIterator` — итератор для простого перебора
- `ViewStatsVisitor` — пример Visitor для подсчёта просмотров

Пример использования (в коде):

1. Создайте фабрику загрузчиков изображений и экземпляр `Catalog`.
2. Создайте категории и товары через `catalog.createProduct(...)`.
3. Добавьте товары в категории (`category.addItem(product)`).
4. Итерация: `catalog.productsIterator(category)` или глубокая итерация `for (const p of catalog.deepProducts(category))`.
5. Собирайте статистику: `catalog.applyVisitor(category, visitor)`.

Модули ориентированы на повторное использование и легко тестируются потому, что фабрика загрузчиков изображений инъецируется в `Catalog`.
