import { ICommand, CommandHistory } from '../../patterns/behavioral/command';
import { IMemento, Memento, IOriginator, MementoCaretaker } from '../../patterns/behavioral/memento';
import { Observable } from '../../patterns/behavioral/observer';
import { IState, StateContext } from '../../patterns/behavioral/state';
import { IStrategy, StrategyContext } from '../../patterns/behavioral/strategy';

/**
 * Элемент корзины
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Состояние корзины для сохранения
 */
export interface CartState {
  items: CartItem[];
}

/**
 * Типы состояний корзины
 */
export enum CartStateType {
  Empty = 'EMPTY',
  Active = 'ACTIVE',
  Checkout = 'CHECKOUT',
  Completed = 'COMPLETED'
}

/**
 * События корзины
 */
export interface CartEvent {
  type: 'itemAdded' | 'itemRemoved' | 'quantityChanged' | 'cleared';
  item?: CartItem;
}

/**
 * Контекст для расчета стоимости
 */
export interface PriceCalculationContext {
  items: CartItem[];
  discount?: number;
}

/**
 * Базовый класс состояния корзины
 */
abstract class BaseCartState implements IState<CartStateType> {
  abstract getType(): CartStateType;

  canTransitTo(to: CartStateType): boolean {
    const current = this.getType();
    switch (current) {
      case CartStateType.Empty:
        return to === CartStateType.Active;
      case CartStateType.Active:
        return to === CartStateType.Empty || to === CartStateType.Checkout;
      case CartStateType.Checkout:
        return to === CartStateType.Active || to === CartStateType.Completed;
      case CartStateType.Completed:
        return to === CartStateType.Empty;
      default:
        return false;
    }
  }
}

/**
 * Конкретные реализации состояний
 */
export class EmptyCartState extends BaseCartState {
  getType(): CartStateType {
    return CartStateType.Empty;
  }
}

export class ActiveCartState extends BaseCartState {
  getType(): CartStateType {
    return CartStateType.Active;
  }
}

export class CheckoutCartState extends BaseCartState {
  getType(): CartStateType {
    return CartStateType.Checkout;
  }
}

export class CompletedCartState extends BaseCartState {
  getType(): CartStateType {
    return CartStateType.Completed;
  }
}

/**
 * Команда добавления товара в корзину
 */
export class AddItemCommand implements ICommand {
  constructor(
    private cart: ShoppingCart,
    private item: CartItem
  ) {}

  execute(): void {
    this.cart.addItemDirect(this.item);
  }

  undo(): void {
    this.cart.removeItemDirect(this.item.id);
  }
}

/**
 * Команда изменения количества товара
 */
export class UpdateQuantityCommand implements ICommand {
  private previousQuantity: number;

  constructor(
    private cart: ShoppingCart,
    private itemId: string,
    private newQuantity: number
  ) {
    const item = cart.getItem(itemId);
    this.previousQuantity = item ? item.quantity : 0;
  }

  execute(): void {
    this.cart.updateQuantityDirect(this.itemId, this.newQuantity);
  }

  undo(): void {
    this.cart.updateQuantityDirect(this.itemId, this.previousQuantity);
  }
}

/**
 * Стратегия расчета стоимости без скидки
 */
export class RegularPriceStrategy implements IStrategy<PriceCalculationContext, number> {
  execute(context: PriceCalculationContext): number {
    return context.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}

/**
 * Стратегия расчета стоимости со скидкой
 */
export class DiscountPriceStrategy implements IStrategy<PriceCalculationContext, number> {
  execute(context: PriceCalculationContext): number {
    const total = context.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = context.discount || 0;
    return total * (1 - discount);
  }
}

/**
 * Основной класс корзины покупок
 */
export class ShoppingCart extends Observable<CartEvent> implements IOriginator<CartState> {
  private items = new Map<string, CartItem>();
  private commandHistory = new CommandHistory();
  private mementoCaretaker = new MementoCaretaker<CartState>();
  private stateContext: StateContext<CartStateType>;
  private priceStrategy: StrategyContext<PriceCalculationContext, number>;

  constructor() {
    super();
    this.stateContext = new StateContext<CartStateType>(new EmptyCartState());
    this.priceStrategy = new StrategyContext<PriceCalculationContext, number>(
      new RegularPriceStrategy()
    );
  }

  /**
   * Добавить товар в корзину через паттерн Command
   */
  addItem(item: CartItem): void {
    const command = new AddItemCommand(this, item);
    this.commandHistory.execute(command);
    this.saveState();
  }

  /**
   * Прямое добавление товара (используется в Command)
   */
  addItemDirect(item: CartItem): void {
    this.items.set(item.id, { ...item });
    if (this.stateContext.getState().getType() === CartStateType.Empty) {
      this.stateContext.setState(new ActiveCartState());
    }
    this.notify({ type: 'itemAdded', item });
  }

  /**
   * Обновить количество товара через паттерн Command
   */
  updateQuantity(itemId: string, quantity: number): void {
    const command = new UpdateQuantityCommand(this, itemId, quantity);
    this.commandHistory.execute(command);
    this.saveState();
  }

  /**
   * Прямое обновление количества (используется в Command)
   */
  updateQuantityDirect(itemId: string, quantity: number): void {
    const item = this.items.get(itemId);
    if (item) {
      item.quantity = quantity;
      this.notify({ type: 'quantityChanged', item });
    }
  }

  /**
   * Удалить товар напрямую (используется в Command)
   */
  removeItemDirect(itemId: string): void {
    const item = this.items.get(itemId);
    if (item) {
      this.items.delete(itemId);
      this.notify({ type: 'itemRemoved', item });
      if (this.items.size === 0) {
        this.stateContext.setState(new EmptyCartState());
      }
    }
  }

  /**
   * Получить товар по ID
   */
  getItem(id: string): CartItem | undefined {
    return this.items.get(id);
  }

  /**
   * Получить все товары
   */
  getItems(): CartItem[] {
    return Array.from(this.items.values());
  }

  /**
   * Отменить последнее действие
   */
  undo(): boolean {
    const result = this.commandHistory.undo();
    if (result) {
      this.saveState();
    }
    return result;
  }

  /**
   * Повторить отмененное действие
   */
  redo(): boolean {
    const result = this.commandHistory.redo();
    if (result) {
      this.saveState();
    }
    return result;
  }

  /**
   * Создать снимок состояния
   */
  createMemento(): IMemento<CartState> {
    return new Memento<CartState>({
      items: this.getItems()
    });
  }

  /**
   * Восстановить состояние из снимка
   */
  restoreFromMemento(memento: IMemento<CartState>): void {
    const state = memento.getState();
    this.items.clear();
    state.items.forEach(item => this.items.set(item.id, { ...item }));
    this.notify({ type: 'cleared' });
    if (this.items.size > 0) {
      this.stateContext.setState(new ActiveCartState());
    } else {
      this.stateContext.setState(new EmptyCartState());
    }
  }

  /**
   * Сохранить текущее состояние
   */
  private saveState(): void {
    this.mementoCaretaker.save(this.createMemento());
  }

  /**
   * Получить текущее состояние корзины
   */
  getCartState(): CartStateType {
    return this.stateContext.getState().getType();
  }

  /**
   * Перейти к оформлению заказа
   */
  proceedToCheckout(): void {
    this.stateContext.setState(new CheckoutCartState());
  }

  /**
   * Завершить заказ
   */
  complete(): void {
    this.stateContext.setState(new CompletedCartState());
  }

  /**
   * Установить стратегию расчета цены
   */
  setPriceStrategy(strategy: IStrategy<PriceCalculationContext, number>): void {
    this.priceStrategy.setStrategy(strategy);
  }

  /**
   * Рассчитать общую стоимость корзины
   */
  calculateTotal(discount?: number): number {
    return this.priceStrategy.execute({
      items: this.getItems(),
      discount
    });
  }
}

/**
 * Демонстрационная функция для примера использования ShoppingCart
 * @returns объект с корзиной и добавленными товарами
 */
export function buildSampleCart() {
  const cart = new ShoppingCart();

  // Добавление товаров
  cart.addItem({ id: '1', name: 'Телефон', price: 1000, quantity: 1 });
  cart.addItem({ id: '2', name: 'Наушники', price: 200, quantity: 2 });

  // Подписка на события корзины
  cart.subscribe({
    update: (event) => {
      console.log('Корзина изменена:', event);
    }
  });

  // Изменение количества товара
  cart.updateQuantity('1', 2);

  // Отмена и повтор действия
  cart.undo();
  cart.redo();

  // Смена стратегии расчета
  cart.setPriceStrategy(new DiscountPriceStrategy());
  const total = cart.calculateTotal(0.1); // скидка 10%

  // Оформление и завершение заказа
  cart.proceedToCheckout();
  cart.complete();

  return { cart, total };
}