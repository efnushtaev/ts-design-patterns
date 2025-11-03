/**
 * Интерфейс контекста, управляемого состояниями.
 * Определяет методы для изменения текущего состояния.
 * 
 * @template S Тип состояния
 */
export interface IContext<S> {
  /**
   * Установить новое состояние
   * @param state Новое состояние
   */
  setState(state: IState<S>): void;

  /**
   * Получить текущее состояние
   */
  getState(): IState<S>;
}

/**
 * Интерфейс состояния.
 * Определяет поведение объекта в конкретном состоянии.
 * 
 * @template S Тип состояния (обычно enum)
 */
export interface IState<S> {
  /**
   * Получить тип текущего состояния
   */
  getType(): S;

  /**
   * Может ли состояние перейти в указанное
   * @param to Целевое состояние для проверки
   */
  canTransitTo(to: S): boolean;
}

/**
 * Базовая реализация контекста с состояниями.
 * 
 * @template S Тип состояния
 */
export class StateContext<S> implements IContext<S> {
  /**
   * @param currentState Начальное состояние
   */
  constructor(private currentState: IState<S>) {}

  setState(state: IState<S>): void {
    if (this.currentState.canTransitTo(state.getType())) {
      this.currentState = state;
    } else {
      throw new Error(
        `Недопустимый переход состояния из ${this.currentState.getType()} в ${state.getType()}`
      );
    }
  }

  getState(): IState<S> {
    return this.currentState;
  }
}