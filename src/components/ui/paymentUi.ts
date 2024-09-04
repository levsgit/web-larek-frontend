import { SETTINGS } from "../../utils/constants";

export class PaymentUi {
  settings: typeof SETTINGS;
  modalPayment: HTMLElement;
  paymentOptions: NodeListOf<HTMLButtonElement>;
  addressInput: HTMLInputElement;
  nextButton: HTMLButtonElement;

  constructor(settings: typeof SETTINGS) {
    this.settings = settings;
    this.modalPayment = (document.querySelector(settings.orderTemplateSelector) as HTMLTemplateElement).content.querySelector(this.settings.formTemplateSelector);

    this.paymentOptions = this.modalPayment.querySelectorAll(this.settings.orderButtonsSelector);
    this.addressInput = this.modalPayment.querySelector(this.settings.inputAdressSelector) as HTMLInputElement;
    this.nextButton = this.modalPayment.querySelector(this.settings.orderNextButtonSelector);

    this.paymentOptions.forEach((item) => {
      item.addEventListener('click', () => {
        this.choosePaymentOption(item);
        this.checkValidationPayment();
      });
    });

    this.addressInput.addEventListener('input', () => {
      this.checkValidationPayment();
    });

  };

  createPaymentModal() {
    this.paymentOptions.forEach((item) => {
      item.classList.remove(this.settings.activeButtonClass);
    });
    this.addressInput.value = '';
    this.checkValidationPayment();

    return this.modalPayment
  }

  choosePaymentOption(selectedButton: HTMLButtonElement) {
    this.paymentOptions.forEach((item) =>
      item.classList.toggle(this.settings.activeButtonClass, item == selectedButton)
    );
  }

  selectedOption() {
    const selectedButton = Array.from(this.paymentOptions).find((item) =>
      item.classList.contains(this.settings.activeButtonClass)
    );

    return selectedButton.name === 'card' ? 'card' : 'cash';
  }

  checkValidationPayment() {
    const isAnyOptionSelected = Array.from(this.paymentOptions).some(option =>
      option.classList.contains(this.settings.activeButtonClass)
    );

    this.nextButton.disabled = this.addressInput.value.trim() === '' || !isAnyOptionSelected;
  }


}