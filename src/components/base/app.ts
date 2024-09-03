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

export class App {
  settings: typeof SETTINGS;
  api: Api;
  detailsView: DetailsView;
  basket: Basket;
  modals: Modals;
  basketUi: BasketUi;
  paymentUi: PaymentUi;
  contactsUi: ContactsUi;
  successUi: SuccessUi;
  catalog: CatalogUi;
  order: Order;


  constructor(settings: typeof SETTINGS, api: Api, detailsView: DetailsView, basket: Basket, modals: Modals, basketUi: BasketUi, catalog: CatalogUi, paymentUi: PaymentUi, order: Order, contactsUi: ContactsUi, successUi: SuccessUi) {
    this.settings = settings;
    this.api = new Api(API_URL);
    this.detailsView = detailsView;
    this.basket = basket;
    this.basketUi = basketUi;
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

  openCardPreview(id: string) {
    this.api.get(`/product/${id}`).then((product: Product) => {
      const cardTemplateCopy = this.detailsView.createCardModal(product);

      const isProductAlreadyAdded = this.basket.basketItems.some(item => item.id === product.id) //true если есть
      if (isProductAlreadyAdded) {
        (cardTemplateCopy.querySelector(this.settings.addProductButtonSelector) as HTMLButtonElement).disabled = true;
      }

      cardTemplateCopy.querySelector(this.settings.buttonModalSelector).addEventListener('click', () => {
        this.basket.addToBasket(product);
        (cardTemplateCopy.querySelector(this.settings.addProductButtonSelector) as HTMLButtonElement).disabled = true
        this.changeBasketCounter();
      });

      this.modals.openModal(cardTemplateCopy);
    }).catch((console.error))
  }

  openBasketModal() {
    const basketItems = this.basket.basketItems.map((product, index) => {
      const basketItemTemplate = this.basketUi.createBasketItem(product, index + 1);
      const basketItemDelete = basketItemTemplate.querySelector(this.settings.basketItemDeleteSelector);

      basketItemDelete.addEventListener('click', () => {
        this.basket.removeFromBasket(product.id);
        this.openBasketModal();
        this.changeBasketCounter();
        this.updateTotalPriceBasket();
      })

      return basketItemTemplate;
    });

    const basketTemplateCopy = this.basketUi.createBasketModal();
    const basketOrderButton = basketTemplateCopy.querySelector(this.settings.orderButtonSelector) as HTMLButtonElement;
    const basketList = basketTemplateCopy.querySelector(this.settings.basketListSelector);
    basketItems.forEach((item) => {
      basketList.appendChild(item);
    });

    if (this.basket.basketItems.length === 0) {
      basketOrderButton.disabled = true;
    } else {
      basketOrderButton.addEventListener('click', () => {
        const basketItemsIds = this.basket.basketItems.map((product) => product.id);
        this.order.items = basketItemsIds;
        this.openPaymentModal();
      });
    }

    this.modals.openModal(basketTemplateCopy);
    this.updateTotalPriceBasket();
  }

  openPaymentModal() {
    const paymentTemplateCopy = this.paymentUi.createPaymentModal();

    const paymentOptions = paymentTemplateCopy.querySelectorAll(this.settings.orderButtonsSelector);
    const addressInput = paymentTemplateCopy.querySelector(this.settings.inputAdressSelector) as HTMLInputElement;
    const nextButton = paymentTemplateCopy.querySelector(this.settings.orderNextButtonSelector);

    paymentOptions.forEach((item) => {
      item.addEventListener('click', () => {
        const paymentOption = this.paymentUi.choosePaymentOption(paymentTemplateCopy, item as HTMLButtonElement);
        this.order.setParam('payment', paymentOption);
        this.paymentUi.checkValidationPayment(paymentTemplateCopy);
      });
    });

    addressInput.addEventListener('input', () => {
      this.paymentUi.checkValidationPayment(paymentTemplateCopy);
    });

    nextButton.addEventListener('click', () => {
      this.order.setParam('address', addressInput.value);
      this.openContactsModal();
    });

    this.modals.openModal(paymentTemplateCopy);
  }

  openContactsModal() {
    const contactsTemplateCopy = this.contactsUi.createContactsTemplate()

    const emailInput = contactsTemplateCopy.querySelector(this.settings.contactsEmailSelector) as HTMLInputElement;
    const phoneInput = contactsTemplateCopy.querySelector(this.settings.contactsPhoneSelector) as HTMLInputElement;
    const paymentButton = contactsTemplateCopy.querySelector(this.settings.paymentActionSelector).querySelector(this.settings.buttonSelector) as HTMLButtonElement;

    emailInput.addEventListener('input', () => { this.contactsUi.checkValidationContacts(contactsTemplateCopy) });
    phoneInput.addEventListener('input', () => { this.contactsUi.checkValidationContacts(contactsTemplateCopy) });
    paymentButton.addEventListener('click', (e: Event) => {
      this.order.setParam('email', emailInput.value.trim());
      this.order.setParam('phone', phoneInput.value.trim());
      const price = this.basket.calculateTotalPrice();
      this.order.total = price;
      this.sendOrder(e);

      this.changeBasketCounter();
      this.openSucessModal(price);
    });

    this.modals.openModal(contactsTemplateCopy);
  }

  sendOrder(e: Event) {
    e.preventDefault();
    const order = this.order.returnOrder();

    console.log(order);

    this.api.post('/order', order).then(() => {
      this.basket.cleanBasket();
    }).catch((console.error));
  }

  openSucessModal(price: number) {
    const successTemplate = this.successUi.createSucessTemplate(price);
    this.modals.openModal(successTemplate);
  }
}