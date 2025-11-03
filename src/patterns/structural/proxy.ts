/**
 * Интерфейс загрузчика изображений.
 * Определяет контракт для реальных и прокси-объектов загрузки изображений.
 */
export interface IImageLoader {
  /**
   * Загружает изображение и возвращает его представление.
   * @returns Promise с URL или данными изображения
   */
  load(): Promise<string>;
}

/**
 * Реальный загрузчик изображений.
 * Представляет тяжелый объект, создание которого мы хотим отложить.
 */
export class RealImage implements IImageLoader {
  constructor(private url: string) {}

  /**
   * Загружает изображение.
   * В текущей реализации просто возвращает URL, но в реальном приложении
   * здесь была бы логика загрузки изображения через DOM API или fetch.
   */
  async load(): Promise<string> {
    // В браузере мы бы создали Image и дождались onload.
    // Чтобы модуль был независим от окружения, мы симулируем fetch или возвращаем URL.
    // В DOM-окружении потребитель может заменить RealImage на реализацию, работающую с DOM.
    return Promise.resolve(this.url);
  }
}

/**
 * Прокси для ленивой загрузки изображений.
 * Реализует тот же интерфейс, что и RealImage, но откладывает создание
 * и загрузку реального объекта до момента первого обращения.
 */
export class ImageProxy implements IImageLoader {
  /** Ссылка на реальный объект, создаётся лениво */
  private realImage: RealImage | null = null;
  /** Promise текущей загрузки, сохраняется для предотвращения повторных загрузок */
  private loadingPromise: Promise<string> | null = null;

  /**
   * @param url URL изображения для загрузки
   * @param placeholder URL или данные заглушки, отображаемой до загрузки
   */
  constructor(private url: string, private placeholder: string = 'placeholder') {}

  /**
   * Ленивая загрузка изображения.
   * При первом вызове создаёт реальный объект и начинает загрузку.
   * Последующие вызовы возвращают результат первой загрузки.
   */
  async load(): Promise<string> {
    if (this.realImage) {
      return this.realImage.load();
    }

    if (!this.loadingPromise) {
      // ленивое создание и имитация задержки загрузки
      this.realImage = new RealImage(this.url);
      this.loadingPromise = new Promise(resolve => {
        // Имитируем асинхронную загрузку
        setTimeout(async () => {
          const r = await this.realImage!.load();
          resolve(r);
        }, 50);
      });
    }

    // Пока идёт загрузка, потребитель может использовать плейсхолдер
    return this.loadingPromise;
  }
}
