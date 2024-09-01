import { Api } from "../components/base/api"
import { SETTINGS } from "../utils/constants"

export interface Product {
  id: string
  description: string
  image: string
  title: string
  category:string
  price: number | null
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



