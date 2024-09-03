import { BasketUi as BasketUiInterface, Product } from "../../types";
import { SETTINGS } from "../../utils/constants";

export class BasketUi /*implements BasketUiInterface*/ {
  settings: typeof SETTINGS;
  cardBasketTemplate: HTMLTemplateElement;
  modalBasketTemplate: HTMLTemplateElement;
  basketCounter: HTMLElement;

  constructor(settings: typeof SETTINGS) {
    this.settings = settings;
    this.cardBasketTemplate = document.querySelector(settings.BasketItemTamplateSelector);
    this.basketCounter = document.querySelector(settings.basketCounterSelector);
    this.modalBasketTemplate = document.querySelector(settings.basketTemplateSelector);
  };

  createBasketModal() {
    const basketContent = this.modalBasketTemplate.content;
    const basketTemplate = basketContent.querySelector(this.settings.basketModalSelector);
    const basketTemplateCopy = basketTemplate.cloneNode(true) as HTMLElement;

    return basketTemplateCopy;
  }

  createBasketItem(product: Product, index: number): HTMLElement {
    const contentBasketItems = this.cardBasketTemplate.content as DocumentFragment;
    const basketItem = contentBasketItems.querySelector(this.settings.basketItemSelector);
    const basketItemCopy = basketItem.cloneNode(true) as HTMLElement;
    const basketIndex = basketItemCopy.querySelector(this.settings.basketIndexSelector);
    const basketCardTitle = basketItemCopy.querySelector(this.settings.basketCardTitleSelector);
    const basketCardPrice = basketItemCopy.querySelector(this.settings.basketCardPriceSelector);

    basketIndex.textContent = `${index}`;
    basketCardTitle.textContent = product.title;
    basketCardPrice.textContent = `${product.price ? product.price : 0} синопсов`;

    return basketItemCopy
  };

  updateBasketCounter(total: string) {
    this.basketCounter.textContent = total;
  };

  updateCalculateTotalPrice(total: string) {
    const totalPriceElement = document.querySelector(this.settings.basketModalSelector)
      ?.querySelector(this.settings.totalPriceSelector);
    totalPriceElement.textContent = total + ' синапсов';
  }

  updateBasket() {

  };
}