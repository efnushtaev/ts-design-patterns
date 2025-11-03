/**
 * Базовый интерфейс команды в паттерне Command.
 * Определяет контракт для выполнения и отмены операций.
 */
export interface ICommand {
  /** Выполнить команду */
  execute(): void;
  /** Отменить команду */
  undo(): void;
}

/**
 * Интерфейс для объекта, хранящего историю команд.
 * Позволяет выполнять отмену и повтор действий.
 */
export interface ICommandHistory {
  /** 
   * Добавить команду в историю и выполнить её
   * @param command Команда для выполнения
   */
  execute(command: ICommand): void;

  /** 
   * Отменить последнюю команду
   * @returns true если команда была отменена, false если история пуста
   */
  undo(): boolean;

  /** 
   * Повторить последнюю отмененную команду
   * @returns true если команда была повторена, false если нет отмененных команд
   */
  redo(): boolean;
}

/**
 * Реализация хранилища истории команд с возможностью отмены/повтора.
 */
export class CommandHistory implements ICommandHistory {
  /** Стек выполненных команд */
  private done: ICommand[] = [];
  /** Стек отмененных команд */
  private undone: ICommand[] = [];

  execute(command: ICommand): void {
    command.execute();
    this.done.push(command);
    // При выполнении новой команды очищаем стек отмены
    this.undone = [];
  }

  undo(): boolean {
    const command = this.done.pop();
    if (!command) return false;

    command.undo();
    this.undone.push(command);
    return true;
  }

  redo(): boolean {
    const command = this.undone.pop();
    if (!command) return false;

    command.execute();
    this.done.push(command);
    return true;
  }
}