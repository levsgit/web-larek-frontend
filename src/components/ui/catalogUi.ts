import { CatalogUi as CatalogUIInterface } from "../../types";
import { CDN_URL, SETTINGS, CATEGORYMAP } from "../../utils/constants";
import { Product } from "../../types";
import { Api } from "../base/api";
import { Category } from "../../types";

export class CatalogUi implements CatalogUIInterface {
  settings: typeof SETTINGS;
  categoryClassMap: typeof CATEGORYMAP;
  api: Api;
  galleryElement: HTMLElement;
  cardTemplate: HTMLTemplateElement;

  constructor(settings: typeof SETTINGS, api: Api, categoryClassMap: typeof CATEGORYMAP) {
    this.api = api;
    this.settings = settings;
    this.categoryClassMap = categoryClassMap;
    this.galleryElement = document.querySelector(settings.gallerySelector);
    this.cardTemplate = document.querySelector(settings.cardTemplateSelector);
  }

  renderCatalog(products: Product[], funcClick: (productId: string) => void) {
    this.galleryElement.append(
      ...products.map(item => this.createCard(item, funcClick))
    );
  }

  createCard(product: Product, funcClick: (productId: string) => void): HTMLElement {
    const cardContent = this.cardTemplate.content;
    const cardButton = cardContent.querySelector(this.settings.cardButtonSelector);
    const cardButtonCopy = cardButton.cloneNode(true) as HTMLElement;
    const category = cardButtonCopy.querySelector(this.settings.categorySelector);
    const title = cardButtonCopy.querySelector(this.settings.titleSelector);
    const price = cardButtonCopy.querySelector(this.settings.priceSelector);
    const image = cardButtonCopy.querySelector(this.settings.imageSelector) as HTMLImageElement;

    category.textContent = product.category
    this.setSrcImage(image, product.image)
    image.alt = product.title;

    category.classList.add(this.getCategoryClass(product.category))
    title.textContent = product.title
    price.textContent = `${product.price ? product.price : 0} синопсов`;

    cardButtonCopy.addEventListener('click', () => {
      funcClick(product.id);
    })

    return cardButtonCopy
  };

  setSrcImage(image: HTMLImageElement, postfix: string) {
    image.src = CDN_URL + `/${postfix}`;
  }

  getCategoryClass(name: string): string {
    return this.categoryClassMap[name as Category] || "card__category_default";
  }
}