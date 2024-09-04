import { SETTINGS } from "../../utils/constants";

export class BasketUi {
  settings: typeof SETTINGS;
  basketCounter: HTMLElement;
  modalBasket: HTMLElement;
  basketList: HTMLElement;
  basketOrderButton: HTMLButtonElement;
  totalPriceElement: HTMLElement;

  constructor(settings: typeof SETTINGS) {
    this.settings = settings;

    this.basketCounter = document.querySelector(settings.basketCounterSelector);
    this.modalBasket = (document.querySelector(settings.basketTemplateSelector) as HTMLTemplateElement).content.querySelector(this.settings.basketModalSelector);
    this.basketOrderButton = this.modalBasket.querySelector(this.settings.orderButtonSelector) as HTMLButtonElement;
    this.basketList = this.modalBasket.querySelector(this.settings.basketListSelector);
    this.totalPriceElement = this.modalBasket.querySelector(this.settings.totalPriceSelector);
  };

  createBasketModal(products: HTMLElement[]) {
    this.basketList.innerHTML = '';

    products.forEach((item) => {
      this.basketList.appendChild(item);
    });

    return this.modalBasket;
  }

  updateBasketCounter(total: string) {
    this.basketCounter.textContent = total;
  };

  updateCalculateTotalPrice(total: string) {
    this.totalPriceElement.textContent = total + ' синапсов';
  }
}