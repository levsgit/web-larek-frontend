import { Product, Product as ProductInterface } from "../../types";
import { Api } from "./api";
import { ApiListResponse as ApiListResponseInterface } from "./api";
import { CatalogUi } from "../ui/catalogUi";
import { Modals } from "../ui/modalsUi";
import { API_URL, SETTINGS } from "../../utils/constants";
import { BasketUi } from "../ui/basketUi";
import { Order } from "./order";
import { Basket } from "./basket";
import { DetailsView } from "../ui/detailsView";
import { PaymentUi } from "../ui/paymentUi";
import { ContactsUi } from "../ui/ContactsUi";
import { SuccessUi } from "../ui/successView";
import { BasketItemUi } from "../ui/basketItemUi";

export class App {
  settings: typeof SETTINGS;
  api: Api;
  detailsView: DetailsView;
  basket: Basket;
  modals: Modals;
  basketUi: BasketUi;
  basketItemUi: BasketItemUi;
  paymentUi: PaymentUi;
  contactsUi: ContactsUi;
  successUi: SuccessUi;
  catalog: CatalogUi;
  order: Order;


  constructor(settings: typeof SETTINGS, api: Api, detailsView: DetailsView, basket: Basket, modals: Modals, basketUi: BasketUi, basketItemUi: BasketItemUi, catalog: CatalogUi, paymentUi: PaymentUi, order: Order, contactsUi: ContactsUi, successUi: SuccessUi) {
    this.settings = settings;
    this.api = new Api(API_URL);
    this.detailsView = detailsView;
    this.basket = basket;
    this.basketUi = basketUi;
    this.basketItemUi = basketItemUi;
    this.paymentUi = paymentUi;
    this.successUi = successUi;
    this.modals = modals;
    this.catalog = catalog;
    this.order = order;
    this.contactsUi = contactsUi;
  }

  initApp() {
    this.getProducts(this.api, this.catalog, this.modals);
    this.setBasketIconClick();
    this.setPreviewButtonListeners();

    this.basketUi.basketOrderButton.addEventListener('click', () => {
      const basketItemsIds = this.basket.basketItems.map((product) => product.id);
      this.order.items = basketItemsIds;

      const price = this.basket.calculateTotalPrice();
      this.order.total = price;

      this.openPaymentModal();
    });

    this.paymentUi.nextButton.addEventListener('click', () => {
      this.order.setParam('payment', this.paymentUi.selectedOption());
      this.order.setParam('address', this.paymentUi.addressInput.value);
      this.openContactsModal();
    });

    this.contactsUi.paymentButton.addEventListener('click', (e: Event) => {
      this.order.setParam('email', this.contactsUi.emailInput.value.trim());
      this.order.setParam('phone', this.contactsUi.phoneInput.value.trim());
      this.sendOrder(e);
      this.changeBasketCounter();
      this.openSucessModal(this.order.total);
    });

    this.successUi.successButton.addEventListener('click', () => {
      this.modals.closeModal();
    });
  }

  getProducts(api: Api, catalog: CatalogUi, allModals: Modals) {
    api.get('/product').then((response: ApiListResponseInterface<ProductInterface>) => {
      console.log(response);
      catalog.renderCatalog(response.items, (id: string) => this.openCardPreview(id));
    }).catch((console.error));
  };

  setBasketIconClick() {
    document.querySelector(this.settings.basketButtonSelector).addEventListener('click', () => {
      this.openBasketModal();
    })
  };

  changeBasketCounter() {
    this.basketUi.updateBasketCounter(`${this.basket.showBasketCounter()}`);
  }

  updateTotalPriceBasket() {
    this.basketUi.updateCalculateTotalPrice(`${this.basket.calculateTotalPrice()}`)
  }

  updateBasketNextButton() {
    if (this.basket.basketItems.length === 0) {
      this.basketUi.basketOrderButton.disabled = true;
    } else {
      this.basketUi.basketOrderButton.disabled = false;
    }
  }

  setPreviewButtonListeners() {
    this.detailsView.setPreviewButtonListeners(
      (product: Product) => this.basket.addToBasket(product),
      () => this.changeBasketCounter()
    );
  }

  openCardPreview(id: string) {
    this.api.get(`/product/${id}`).then((product: Product) => {
      this.detailsView.setOpenedProduct(product);
      const cardModal = this.detailsView.createCardModal(product);
      const isProductAlreadyAdded = this.basket.basketItems.some(item => item.id === product.id) //true если есть

      if (isProductAlreadyAdded) {
        this.detailsView.disableModalCardButton();
      } else {
        this.detailsView.enableModalCardButton();
      }
      this.modals.openModal(cardModal);
    }).catch((console.error))
  }

  openBasketModal() {
    const basketElement = this.renderBasketList();
    this.modals.openModal(basketElement);
  }

  renderBasketList() {
    const basketItems = this.basket.basketItems.map((product, index) => {
      const basketItemTemplate = this.basketItemUi.createBasketItem(
        product,
        index + 1,
        (productId: string) => this.basket.removeFromBasket(productId),
        () => this.renderBasketList()
      );

      return basketItemTemplate;
    });

    const basketElement = this.basketUi.createBasketModal(basketItems);

    this.changeBasketCounter();
    this.updateTotalPriceBasket();
    this.updateBasketNextButton();

    return basketElement
  }

  openPaymentModal() {
    const paymentModal = this.paymentUi.createPaymentModal();
    this.modals.openModal(paymentModal);
  }

  openContactsModal() {
    const contactsModal = this.contactsUi.createContactsModal();
    this.modals.openModal(contactsModal);
  }

  openSucessModal(price: number) {
    const successModal = this.successUi.createSucessTemplate(price);
    this.modals.openModal(successModal);
  }

  sendOrder(e: Event) {
    e.preventDefault();
    const order = this.order.returnOrder();

    console.log(order);

    this.api.post('/order', order).then(() => {
      this.basket.cleanBasket();
      this.changeBasketCounter();
    }).catch((console.error));
  }
}