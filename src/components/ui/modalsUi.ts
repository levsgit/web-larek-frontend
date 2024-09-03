import { OrderSummary, Product } from "../../types";
import { SETTINGS } from "../../utils/constants"
import { Api } from "../base/api";
import { Basket } from "../base/basket";
import { Order } from "../base/order";
import { CatalogUi } from "./catalogUi";

export class Modals {
  api: Api;
  basket: Basket;
  order: Order;
  catalogUi: CatalogUi;
  settings: typeof SETTINGS;
  modalContainer: HTMLElement;
  modalCardTemplate: HTMLTemplateElement;
  modalBasketTemplate: HTMLTemplateElement;
  modalPaymentTemplate: HTMLTemplateElement;
  contactsTemplate: HTMLTemplateElement;
  successTemplate: HTMLTemplateElement;
  busketCounter: HTMLElement;

  payments = {
    'card': 'online',
    'cash': 'received'
  }

  constructor(settings: typeof SETTINGS, api: Api, basket: Basket, order: Order, catalogUi: CatalogUi) {
    this.api = api;
    this.basket = basket;
    this.catalogUi = catalogUi;
    this.settings = settings;
    this.order = order;
    this.modalContainer = document.querySelector(settings.modalSelector);
    this.modalCardTemplate = document.querySelector(settings.modalCardPreviewTemplateSelector);
    this.modalBasketTemplate = document.querySelector(settings.basketTemplateSelector);
    this.modalPaymentTemplate = document.querySelector(settings.orderTemplateSelector);
    this.contactsTemplate = document.querySelector(settings.contactsTemplateSelector);
    this.successTemplate = document.querySelector(settings.successTemplateSelector);
    this.busketCounter = document.querySelector(settings.basketCounterSelector);

    this.handleEscape = this.handleEscape.bind(this);
    this.checkValidationPayment = this.checkValidationPayment.bind(this);
    this.checkValidationContacts = this.checkValidationContacts.bind(this);

    this.setCloseModal();
  };

  //Close modal on click to cross or outside of container
  setCloseModal() {
    this.modalContainer.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLDivElement;
      if (target.classList.contains(this.settings.modalsClass) || target.classList.contains(this.settings.modalCloseClass) || target.classList.contains(this.settings.successModalButtonClass)) {
        this.modalContainer.classList.remove(this.settings.modalActiveClass);
        this.removeHandleEscape();
      }
    });
  }

  handleEscape(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.modalContainer.classList.remove(this.settings.modalActiveClass);
    }
  }

  setHandleEscape() {
    document.addEventListener('keydown', this.handleEscape);
  }

  removeHandleEscape() {
    document.removeEventListener('keydown', this.handleEscape);
  }

  openCardModal(id: string) {
    this.api.get(`/product/${id}`).then((product: Product) => {
      const cardContent = this.modalCardTemplate.content;
      const cardTemplate = cardContent.querySelector(this.settings.cardModalSelector)
      const cardTemplateCopy = cardTemplate.cloneNode(true) as HTMLElement;
      const image = cardTemplateCopy.querySelector(this.settings.imageSelector) as HTMLImageElement;
      const category = cardTemplateCopy.querySelector(this.settings.categorySelector);
      const title = cardTemplateCopy.querySelector(this.settings.titleSelector);
      const text = cardTemplateCopy.querySelector(this.settings.textModalSelector);
      const price = cardTemplateCopy.querySelector(this.settings.priceModalSelector);

      this.catalogUi.setSrcImage(image, product.image)
      image.alt = product.title;
      category.textContent = product.category;
      title.textContent = product.title;
      text.textContent = product.description;
      price.textContent = `${product.price ? product.price : 0} синапсов`;

      cardTemplateCopy.querySelector(this.settings.buttonModalSelector).addEventListener('click', () => {
        const result = this.basket.addToBasket(product);
        if (result === false) {
          console.error('Предмет уже добавлен');
        }
        this.changeBasketCounter();
      });

      const modalContent = this.modalContainer.querySelector(this.settings.modalContentSelector);
      modalContent.innerHTML = '';

      this.setHandleEscape();
      modalContent.appendChild(cardTemplateCopy);
      this.modalContainer.classList.add(this.settings.modalActiveClass);
    }).catch((console.error))
  }

  changeBasketCounter() {
    this.busketCounter.textContent = `${this.basket.showBasketCounter()}`;
  };

  openBasketModal(items: HTMLElement[]) {
    const basketContent = this.modalBasketTemplate.content;
    const basketTemplate = basketContent.querySelector(this.settings.basketModalSelector);
    const basketTemplateCopy = basketTemplate.cloneNode(true) as HTMLElement;
    const modalContent = this.modalContainer.querySelector(this.settings.modalContentSelector);
    const basketOrderButton = basketTemplateCopy.querySelector(this.settings.orderButtonSelector) as HTMLButtonElement;
    const basketList = basketTemplateCopy.querySelector(this.settings.basketListSelector);

    items.forEach(item => {
      basketList.appendChild(item);
    });

    // Disable button if no items
    if (this.basket.basketItems.length === 0) {
      basketOrderButton.disabled = true;
    } else {
      basketOrderButton.addEventListener('click', () => {
        this.openPaymentModal();
      });
    }

    modalContent.innerHTML = '';
    this.setHandleEscape();
    modalContent.appendChild(basketTemplateCopy);
    this.modalContainer.classList.add(this.settings.modalActiveClass);
  }

  openPaymentModal() {
    const paymentContent = this.modalPaymentTemplate.content;
    const paymentTemplate = paymentContent.querySelector(this.settings.formTemplateSelector);
    const paymentTemplateCopy = paymentTemplate.cloneNode(true) as HTMLElement;
    const modalContent = this.modalContainer.querySelector(this.settings.modalContentSelector);
    const paymentOptions = paymentTemplateCopy.querySelectorAll(this.settings.orderButtonsSelector);
    const addressInput = paymentTemplateCopy.querySelector(this.settings.inputAdressSelector) as HTMLInputElement;
    const nextButton = paymentTemplateCopy.querySelector(this.settings.orderNextButtonSelector);

    paymentOptions.forEach((item) => {
      item.addEventListener('click', () => {
        this.choosePaymentOption(item as HTMLButtonElement);
        this.checkValidationPayment();
      });
    });

    addressInput.addEventListener('input', this.checkValidationPayment);

    nextButton.addEventListener('click', () => {
      this.order.setParam('address', addressInput.value);
      this.openContactsModal();
    });

    modalContent.innerHTML = '';
    modalContent.appendChild(paymentTemplateCopy);
  }

  choosePaymentOption(selectedButton: HTMLButtonElement) {
    const paymentOptions = this.modalContainer.querySelectorAll(this.settings.orderButtonsSelector);

    paymentOptions.forEach(button => {
      button.classList.toggle(this.settings.activeButtonClass, button === selectedButton);
    });

    const paymentType = selectedButton.name === 'card' ? 'card' : 'cash';
    this.order.setParam('payment', this.payments[paymentType]);
  }

  checkValidationPayment() {
    const inputAddress = this.modalContainer.querySelector(this.settings.inputAdressSelector) as HTMLInputElement;
    const nextButton = this.modalContainer.querySelector(this.settings.orderNextButtonSelector) as HTMLButtonElement;
    const isAnyOptionSelected = this.order.payment !== '';

    nextButton.disabled = inputAddress.value.trim() === '' || !isAnyOptionSelected;
  }

  openContactsModal() {
    const contactsContent = this.contactsTemplate.content;
    const contactsTemplate = contactsContent.querySelector(this.settings.formTemplateSelector);
    const contactsTemplateCopy = contactsTemplate.cloneNode(true) as HTMLElement;
    const modalContent = this.modalContainer.querySelector(this.settings.modalContentSelector);
    const emailInput = contactsTemplateCopy.querySelector(this.settings.contactsEmailSelector) as HTMLInputElement;
    const phoneInput = contactsTemplateCopy.querySelector(this.settings.contactsPhoneSelector) as HTMLInputElement;
    const paymentButton = contactsTemplateCopy.querySelector(this.settings.paymentActionSelector).querySelector(this.settings.buttonSelector) as HTMLButtonElement;

    emailInput.addEventListener('input', this.checkValidationContacts);
    phoneInput.addEventListener('input', this.checkValidationContacts);
    paymentButton.addEventListener('click', (e: Event) => {
      this.order.setParam('email', emailInput.value.trim());
      this.order.setParam('phone', phoneInput.value.trim());
      const price = this.basket.calculateTotalPrice();
      this.order.total = price;
      this.order.sendOrder(e);

      this.changeBasketCounter();
      this.openSucessModal(price);
    });

    modalContent.innerHTML = '';
    modalContent.appendChild(contactsTemplateCopy);
  }

  checkValidationContacts() {
    const emailInput = this.modalContainer.querySelector(this.settings.contactsEmailSelector) as HTMLInputElement;
    const phoneInput = this.modalContainer.querySelector(this.settings.contactsPhoneSelector) as HTMLInputElement;
    const paymentButton = this.modalContainer.querySelector(this.settings.paymentActionSelector).querySelector(this.settings.buttonSelector) as HTMLButtonElement;
    const isValid = emailInput?.value.trim() !== '' && phoneInput?.value.trim() !== '';

    if (paymentButton) {
      paymentButton.disabled = !isValid;
    }
  }

  openSucessModal(price: number) {
    const successContent = this.successTemplate.content;
    const successTemplate = successContent.querySelector(this.settings.successContentSelector);
    const successTemplateCopy = successTemplate.cloneNode(true) as HTMLElement;
    const modalContent = this.modalContainer.querySelector(this.settings.modalContentSelector);
    const description = successTemplateCopy.querySelector(this.settings.successDiscriptionSelector);

    description.textContent = `Списано ${price} синапсов`;

    modalContent.innerHTML = '';
    modalContent.appendChild(successTemplateCopy);
  }

}