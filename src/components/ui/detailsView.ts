import { Product } from "../../types";
import { CDN_URL, SETTINGS } from "../../utils/constants";

export class DetailsView {
  settings: typeof SETTINGS;
  modalCard: Element;
  modalCardImage: HTMLImageElement;
  modalCardCategory: Element;
  modalCardTitle: Element;
  modalCardText: Element;
  modalCardPrice: Element;
  modalCardButton: HTMLButtonElement;
  openedProduct: Product;

  constructor(settings: typeof SETTINGS) {
    this.settings = settings;
    this.modalCard = (document.querySelector(settings.modalCardPreviewTemplateSelector) as HTMLTemplateElement).content.querySelector(this.settings.cardModalSelector);
    this.modalCardImage = this.modalCard.querySelector(this.settings.imageSelector) as HTMLImageElement;
    this.modalCardCategory = this.modalCard.querySelector(this.settings.categorySelector);
    this.modalCardTitle = this.modalCard.querySelector(this.settings.titleSelector);
    this.modalCardText = this.modalCard.querySelector(this.settings.textModalSelector);
    this.modalCardPrice = this.modalCard.querySelector(this.settings.priceModalSelector);
    this.modalCardButton = this.modalCard.querySelector(this.settings.addProductButtonSelector) as HTMLButtonElement

    this.modalCardButton.addEventListener('click', () => {
      this.disableModalCardButton();
    });
  }

  createCardModal(product: Product) {
    this.setSrcImage(this.modalCardImage, product.image);
    this.modalCardImage.alt = product.title;
    this.modalCardCategory.textContent = product.category;
    this.modalCardTitle.textContent = product.title;
    this.modalCardText.textContent = product.description;
    this.modalCardPrice.textContent = `${product.price ? product.price : 0} синапсов`;

    return this.modalCard;
  }

  setSrcImage(image: HTMLImageElement, postfix: string) {
    image.src = CDN_URL + `/${postfix}`;
  }

  disableModalCardButton() {
    this.modalCardButton.disabled = true;
  }

  enableModalCardButton() {
    this.modalCardButton.disabled = false;
  }

  setOpenedProduct(product: Product) {
    this.openedProduct = product;
  }

  setPreviewButtonListeners(callback: (product: Product) => void, callback2: Function) {
    this.modalCardButton.addEventListener('click', () => callback(this.openedProduct));
    this.modalCardButton.addEventListener('click', () => callback2());
  }
}