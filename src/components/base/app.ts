import { App as AppInterface, Product as ProductInterface } from "../../types";
import { Api } from "./api";
import { ApiListResponse as ApiListResponseInterface } from "./api";
import { CatalogUi } from "../ui/catalogUi";
import { Modals } from "../ui/modalsUi";
import { API_URL, CATEGORYMAP, CDN_URL, SETTINGS } from "../../utils/constants";
import { BasketUi } from "../ui/basketUi";
import { Order } from "./order";
import { Basket } from "./basket";

export class App {

  constructor() { }

  initApp(settings: typeof SETTINGS, categoryMap: typeof CATEGORYMAP) {
    const api = new Api(API_URL);
    const imgApi = new Api(CDN_URL);
    const catalog = new CatalogUi(settings, imgApi, categoryMap);
    const basket = new Basket();
    const order = new Order(basket, api);
    const allModals = new Modals(settings, api, basket, order, catalog);
    const basketUi = new BasketUi(settings, basket, allModals);

    this.getProducts(api, catalog, allModals);
  }

  getProducts(api: Api, catalog: CatalogUi, allModals: Modals) {
    api.get('/product').then((response: ApiListResponseInterface<ProductInterface>) => {
      console.log(response);
      catalog.renderCatalog(response.items, (id: string) => allModals.openCardModal(id));
    });
  }
}