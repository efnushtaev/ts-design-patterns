/**
 * Интерфейс стратегии.
 * Определяет общий метод для всех конкретных стратегий.
 * 
 * @template Context Тип контекста, передаваемого в стратегию
 * @template Result Тип результата работы стратегии
 */
export interface IStrategy<Context, Result> {
  /**
   * Выполнить алгоритм стратегии
   * @param context Контекст для работы алгоритма
   * @returns Результат работы алгоритма
   */
  execute(context: Context): Result;
}

/**
 * Контекст, использующий стратегию.
 * Делегирует выполнение алгоритма текущей стратегии.
 * 
 * @template Context Тип контекста, передаваемого в стратегию
 * @template Result Тип результата работы стратегии
 */
export class StrategyContext<Context, Result> {
  /**
   * @param strategy Начальная стратегия
   */
  constructor(private strategy: IStrategy<Context, Result>) {}

  /**
   * Установить новую стратегию
   * @param strategy Стратегия для использования
   */
  setStrategy(strategy: IStrategy<Context, Result>): void {
    this.strategy = strategy;
  }

  /**
   * Выполнить текущую стратегию
   * @param context Контекст для работы алгоритма
   * @returns Результат работы стратегии
   */
  execute(context: Context): Result {
    return this.strategy.execute(context);
  }
}