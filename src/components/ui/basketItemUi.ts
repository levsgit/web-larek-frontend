import { Product } from "../../types";
import { SETTINGS } from "../../utils/constants";

export class BasketItemUi {
  settings: typeof SETTINGS;
  cardBasketItemTemplate: HTMLElement;

  constructor(settings: typeof SETTINGS) {
    this.settings = settings;
    this.cardBasketItemTemplate = (document.querySelector(settings.BasketItemTamplateSelector) as HTMLTemplateElement).content.querySelector(this.settings.basketItemSelector);
  }

  createBasketItem(product: Product, index: number, deleteItemFunc: (productId: string) => void, renderBasketFunc: Function): HTMLElement {
    const cardBasketItemTemplateCopy = this.cardBasketItemTemplate.cloneNode(true) as HTMLElement;;
    const basketIndex = cardBasketItemTemplateCopy.querySelector(this.settings.basketIndexSelector);
    const basketCardTitle = cardBasketItemTemplateCopy.querySelector(this.settings.basketCardTitleSelector);
    const basketCardPrice = cardBasketItemTemplateCopy.querySelector(this.settings.basketCardPriceSelector);
    const basketItemDeleteButton = cardBasketItemTemplateCopy.querySelector(this.settings.basketItemDeleteSelector);

    basketIndex.textContent = `${index}`;
    basketCardTitle.textContent = product.title;
    basketCardPrice.textContent = `${product.price ? product.price : 0} синопсов`;

    basketItemDeleteButton.addEventListener('click', () => {
      deleteItemFunc(product.id);
      renderBasketFunc();
    });


    return cardBasketItemTemplateCopy
  };
}