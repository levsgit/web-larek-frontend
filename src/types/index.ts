import { Api } from "../components/base/api"
import { SETTINGS } from "../utils/constants"

export type Category = "софт-скил" | "другое" | "дополнительное" | "хард-скил" | "кнопка";

export interface Product {
  id: string
  description: string
  image: string
  title: string
  category: string
  price: number | null
}

export interface ProductList {
  products: Product[];
}

export interface Catalog {
  renderCatalog(products: Product[], onClick: (id: string) => void): void;
}

export interface Basket {
  basketItems: Product[];
  addToBasket(product: Product): void;
  removeFromBasket(productID: string): void;
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

  renderBasket(): void;
  createBasketItem(product: Product, index: number): HTMLElement;
  changeBasketCounter(): void;
  showCalculateTotalPrice(): void;
}

export interface OrderUI {
  settings: typeof SETTINGS;

  selectButton(button: HTMLButtonElement): void;
}

export interface CatalogUi {
  settings: typeof SETTINGS;

  renderCatalog(products: Product[], funcClick: (productId: string) => void): void;
  createCard(product: Product, funcClick: (productId: string) => void): HTMLElement;
}

export interface Modals {
  //TODO
}

export interface App {
  initApp(settings: typeof SETTINGS,): void;
  getProducts(api: Api, catalog: CatalogUi, modals: Modals): void;
}



