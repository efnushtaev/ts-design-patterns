/**
 * Тип, представляющий внутреннее (intrinsic) состояние продукта.
 * Это общие данные, которые могут быть разделены между несколькими экземплярами.
 */
export type ProductIntrinsic = {
  /** Название продукта */
  name: string;
  /** Описание продукта (опционально) */
  description?: string;
  /** Цена продукта */
  price: number;
  /** URL изображения продукта (опционально) */
  imageUrl?: string;
};

/**
 * Фабрика легковесов (Flyweight Factory) для продуктов.
 * Обеспечивает переиспользование одинаковых intrinsic-состояний продуктов
 * для экономии памяти.
 */
export class ProductFlyweightFactory {
  /** Пул уже созданных легковесов */
  private pool: Map<string, ProductIntrinsic> = new Map();

  /**
   * Создаёт уникальный ключ для intrinsic-состояния продукта.
   * @param p Intrinsic-состояние продукта
   * @returns Строковый ключ, уникально идентифицирующий состояние
   */
  private makeKey(p: ProductIntrinsic): string {
    return `${p.name}::${p.description ?? ''}::${p.price}::${p.imageUrl ?? ''}`;
  }

  /**
   * Получает или создаёт легковес для заданного intrinsic-состояния.
   * Если состояние с такими параметрами уже существует, возвращает существующий объект.
   * 
   * @param p Intrinsic-состояние продукта
   * @returns Существующий или новый объект состояния
   */
  getFlyweight(p: ProductIntrinsic): ProductIntrinsic {
    const key = this.makeKey(p);
    const existing = this.pool.get(key);
    if (existing) return existing;

    this.pool.set(key, p);
    return p;
  }

  /**
   * Возвращает текущий размер пула легковесов.
   * Используется для мониторинга и отладки.
   * 
   * @returns Количество уникальных легковесов в пуле
   */
  getPoolSize(): number {
    return this.pool.size;
  }
}
