# Паттерны (локально)

В этой папке находятся переиспользуемые реализации паттернов проектирования, используемые в проекте каталога товаров.

Реализованные паттерны:
- Composite (generic) — древовидная структура с хранением элементов в узлах (src/patterns/structural/composite.ts)
- Iterator — итератор для массивов (src/patterns/behavioral/iterator.ts)
- Proxy — ленивый загрузчик изображений (src/patterns/structural/proxy.ts)
- Flyweight — фабрика для общих (intrinsic) данных товаров (src/patterns/structural/flyweight.ts)
- Visitor — generic Visitor/Visitable и пример CountingVisitor (src/patterns/behavioral/visitor.ts)

Все модули написаны на TypeScript, имеют минимальные внешние зависимости и спроектированы так, чтобы их можно было подключать в разных частях приложения.
