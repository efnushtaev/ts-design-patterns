import { Composite } from '../../patterns/structural/composite';
import { ArrayIterator, IIterator } from '../../patterns/behavioral/iterator';
import { ImageProxy, IImageLoader } from '../../patterns/structural/proxy';
import { ProductFlyweightFactory, ProductIntrinsic } from '../../patterns/structural/flyweight';
import { Visitable, Visitor, CountingVisitor } from '../../patterns/behavioral/visitor';

// Product представляет товар в каталоге. Использует flyweight для intrinsic-данных
export class Product implements Visitable<Product> {
  constructor(
    public readonly id: string,
    private intrinsic: ProductIntrinsic,
    private imageLoaderFactory: (url?: string) => IImageLoader
  ) {}

  // extrinsic-свойства могут задаваться для каждого экземпляра
  public stock: number = 0;

  get name(): string {
    return this.intrinsic.name;
  }

  get price(): number {
    return this.intrinsic.price;
  }

  get description(): string | undefined {
    return this.intrinsic.description;
  }

  async loadImage(): Promise<string> {
    const loader = this.imageLoaderFactory(this.intrinsic.imageUrl);
    return loader.load();
  }

  accept(visitor: Visitor<Product>): void {
    visitor.visit(this);
  }
}

// CatalogCategory использует обобщённый Composite для хранения подкатегорий и товаров
export class CatalogCategory extends Composite<Product> {
  constructor(name: string) {
    super(name);
  }
}

export class Catalog {
  private flyFactory = new ProductFlyweightFactory();
  public root: CatalogCategory;

  // фабрика загрузчиков изображений инъецируется для тестируемости и независимости от окружения
  constructor(private imageLoaderFactory: (url?: string) => IImageLoader) {
    this.root = new CatalogCategory('root');
  }

  // создать или переиспользовать intrinsic (flyweight)
  createProduct(id: string, intrinsic: ProductIntrinsic, stock = 0): Product {
    const shared = this.flyFactory.getFlyweight(intrinsic);
    const p = new Product(id, shared, this.imageLoaderFactory);
    p.stock = stock;
    return p;
  }

  // Вернуть итератор по товарам в категории (поверхностно)
  productsIterator(category: CatalogCategory): IIterator<Product> {
    return new ArrayIterator(category.getItems());
  }

  // Глубокая итерация — генератор, возвращающий все товары в дереве категории
  *deepProducts(category: CatalogCategory): Iterable<Product> {
    for (const item of category.getItems()) {
      yield item;
    }
    for (const child of category.getChildren()) {
      if (child instanceof CatalogCategory) {
        yield* this.deepProducts(child);
      }
    }
  }

  // Простой пример: применить visitor к каждому товару в категории
  applyVisitor(category: CatalogCategory, visitor: Visitor<Product>): void {
    for (const p of this.deepProducts(category)) {
      p.accept(visitor);
    }
  }

  // показать статистику flyweight'а
  flyweightPoolSize(): number {
    return this.flyFactory.getPoolSize();
  }
}

// небольшой демонстрационный помощник (не выполняется автоматически), показывающий как использовать каталог
export function buildSampleCatalog(imagePlaceholder = 'placeholder') {
  const imageFactory = (url?: string) => new ImageProxy(url ?? '', imagePlaceholder);
  const catalog = new Catalog(imageFactory);

  const phones = new CatalogCategory('Phones');
  const laptops = new CatalogCategory('Laptops');

  catalog.root.addChild(phones);
  catalog.root.addChild(laptops);

  const p1 = catalog.createProduct('p1', { name: 'Phone X', price: 799, imageUrl: 'https://img/phone-x' }, 10);
  const p2 = catalog.createProduct('p2', { name: 'Phone Y', price: 599, imageUrl: 'https://img/phone-y' }, 5);
  const l1 = catalog.createProduct('l1', { name: 'Laptop Pro', price: 1299, imageUrl: 'https://img/laptop-pro' }, 3);

  phones.addItem(p1);
  phones.addItem(p2);
  laptops.addItem(l1);

  return { catalog, products: { p1, p2, l1 } };
}

// Пример конкретного visitor для подсчёта просмотров
export class ViewStatsVisitor extends CountingVisitor<Product> {
  constructor() {
    super(p => p.id);
  }
}
