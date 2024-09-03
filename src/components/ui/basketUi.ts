import { BasketUi as BasketUiInterface, Product } from "../../types";
import { SETTINGS } from "../../utils/constants";
import { Basket } from "../base/basket";
import { Modals } from "./modalsUi";

export class BasketUi implements BasketUiInterface {
  settings: typeof SETTINGS;
  basket: Basket;
  modals: Modals;
  cardBasketTemplate: HTMLTemplateElement;
  basketCounter: HTMLElement;

  constructor(settings: typeof SETTINGS, basket: Basket, modals: Modals) {
    this.settings = settings;
    this.basket = basket;
    this.modals = modals;
    this.cardBasketTemplate = document.querySelector(settings.BasketItemTamplateSelector);
    this.basketCounter = document.querySelector(settings.basketCounterSelector);

    this.setBasketIconClick();
  };

  setBasketIconClick() {
    document.querySelector(this.settings.basketButtonSelector).addEventListener('click', () => {
      this.renderBasket();
    })
  };

  renderBasket() {
    const basketItems = this.basket.basketItems.map((item, index) => {
      return this.createBasketItem(item, index + 1);
    });

    this.modals.openBasketModal(basketItems);
    this.showCalculateTotalPrice();
  };

  createBasketItem(product: Product, index: number): HTMLElement {
    const contentBasketItems = this.cardBasketTemplate.content as DocumentFragment;
    const basketItem = contentBasketItems.querySelector(this.settings.basketItemSelector);
    const basketItemCopy = basketItem.cloneNode(true) as HTMLElement;
    const basketIndex = basketItemCopy.querySelector(this.settings.basketIndexSelector);
    const basketCardTitle = basketItemCopy.querySelector(this.settings.basketCardTitleSelector);
    const basketCardPrice = basketItemCopy.querySelector(this.settings.basketCardPriceSelector);
    const basketItemDelete = basketItemCopy.querySelector(this.settings.basketItemDeleteSelector);

    basketIndex.textContent = `${index}`;
    basketCardTitle.textContent = product.title;
    basketCardPrice.textContent = `${product.price ? product.price : 0} синопсов`;
    basketItemDelete.addEventListener('click', () => {
      this.basket.removeFromBasket(product.id);
      this.updateBasket();
    })

    return basketItemCopy
  };

  changeBasketCounter() {
    this.basketCounter.textContent = `${this.basket.showBasketCounter()}`;
  };

  showCalculateTotalPrice() {
    const totalPriceElement = document.querySelector(this.settings.basketModalSelector)
      ?.querySelector(this.settings.totalPriceSelector);
    if (totalPriceElement) {
      totalPriceElement.textContent = `${this.basket.calculateTotalPrice()} синапсов`;
    }
  }

  updateBasket() {
    this.renderBasket();
    this.modals.changeBasketCounter();
  }
}