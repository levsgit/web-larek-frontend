import { Api } from "../components/base/api"

const SETTINGS = {
  basketListSelector: ".basket__list",
  addProductButtonSelector: ".card__button",
  basketCounterSelector: ".header__basket-counter",
  totalPriceSelector: ".basket__price",
  orderButtonSelector: ".basket__button",
  basketButtonSelector: ".header__basket",
  basketItemSelector: ".basket__item",
  BasketItemTamplateSelector: "#card-basket",
  basketIndexSelector: ".basket__item-index",
  basketCardTitleSelector: ".card__title",
  basketCardPriceSelector: ".card__price",
  basketItemDeleteSelector: ".basket__item-delete",
  orderButtonsSelector: ".button_alt",
  inputAdressSelector: ".form__input",
  successDiscriptionSelector: ".order-success__description",
  activeButtonClass: "button_alt-active",
  gallerySelector: ".gallery",
  cardTemplateSelector: "#card-catalog",
  cardButtonSelector: ".gallery__item",
  categorySelector: ".card__category",
  titleSelector: ".card__title",
  priceSelector: ".card__price",
  imageSelector: ".card__image",
  modalSelector: "#modal-container",
  modalsSelector: ".modal",
  cardModalSelector: ".card_full",
  basketModalSelector: ".basket",
  successModalSelector: ".order-success",
  modalContentSelector: ".modal__content",
  successModalButtonSelector: ".order-success__close",
  categoryModalSelector: ".card__category",
  titleModalSelector: ".card__title",
  textModalSelector: ".card__text",
  priceModalSelector: ".card__price",
  buttonModalSelector: ".card__button",
} as const;

export interface Product {
  id: string
  description: string
  image: string
  title: string
  category:string
  price: number
}

export interface ApiListResponse<T> {
  items: T[];
  totalCount: number;
}

export interface ProductList {
  products: Product[];
}

export interface Catalog {
  renderCatalog(products: Product[], onClick: (id: string) => void): void;
}

export interface Basket {
  basketItems: Product[];
  selectedProduct: Product;
  addBasket(): Product | false;
  removeBasket(productID: string): void;
  showBasketCounter(): number;
  calculateTotalPrice(): number;
  cleanBasket(): void;
}

export interface Order {
  payment: string;
  address: string;
  email: string;
  phone: string;
  setParam(key: string, value: string): void;
  returnOrder(): OrderSummary;
}

export interface OrderSummary {
  payment: string;
  address: string;
  email: string;
  phone: string;
  items: string[];
  total: number;
}

export interface BasketUi {
  settings: typeof SETTINGS;

  renderBasketItems(): void;
  createBasketItems(product: Product, index: number): HTMLElement;
  changeBasketCounter(): void;
  showCalculateTotalPrice(): void;
  resetBasket(): void;
  toggleDisableButton(): void;
  initBasket(): void;
}

interface OrderUI {
  settings: typeof SETTINGS;

  selectButton(button: HTMLButtonElement): void;
}

interface CatalogUI {
  settings: typeof SETTINGS;

  renderCatalog(products: Product[], funcClick: (productId: string) => void): void;
  addCardClick(card: HTMLButtonElement, product: Product, callback: (id: string) => void): void;
  createCard(product: Product): HTMLElement;
}


interface App {
  settings: typeof SETTINGS;
  basketUi: BasketUi;
  productList: ProductList;
  catalog: CatalogUI;
  api: Api;
  basket: Basket;
  orderUI: OrderUI;
  order: Order;

  initApp(): void;
  getProducts(): void;
  openCardModal(id: string): void;
  createOrder(): void;
}



