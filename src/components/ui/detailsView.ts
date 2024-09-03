import { Product } from "../../types";
import { CDN_URL, SETTINGS } from "../../utils/constants";

export class DetailsView {
  settings: typeof SETTINGS;
  modalCardTemplate: HTMLTemplateElement;

  constructor(settings: typeof SETTINGS) {
    this.settings = settings;
    this.modalCardTemplate = document.querySelector(settings.modalCardPreviewTemplateSelector);
  }

  createCardModal(product: Product) {
    const cardContent = this.modalCardTemplate.content;
    const cardTemplate = cardContent.querySelector(this.settings.cardModalSelector)
    const cardTemplateCopy = cardTemplate.cloneNode(true) as HTMLElement;
    const image = cardTemplateCopy.querySelector(this.settings.imageSelector) as HTMLImageElement;
    const category = cardTemplateCopy.querySelector(this.settings.categorySelector);
    const title = cardTemplateCopy.querySelector(this.settings.titleSelector);
    const text = cardTemplateCopy.querySelector(this.settings.textModalSelector);
    const price = cardTemplateCopy.querySelector(this.settings.priceModalSelector);

    this.setSrcImage(image, product.image);
    image.alt = product.title;
    category.textContent = product.category;
    title.textContent = product.title;
    text.textContent = product.description;
    price.textContent = `${product.price ? product.price : 0} синапсов`;

    return cardTemplateCopy;
  }

  setSrcImage(image: HTMLImageElement, postfix: string) {
    image.src = CDN_URL + `/${postfix}`;
  }
}