import { SETTINGS } from "../../utils/constants";

export class PaymentUi {

  settings: typeof SETTINGS;
  modalPaymentTemplate: HTMLTemplateElement;

  constructor(settings: typeof SETTINGS) {
    this.settings = settings;
    this.modalPaymentTemplate = document.querySelector(settings.orderTemplateSelector);
  };

  createPaymentModal() {
    const paymentContent = this.modalPaymentTemplate.content;
    const paymentTemplate = paymentContent.querySelector(this.settings.formTemplateSelector);
    const paymentTemplateCopy = paymentTemplate.cloneNode(true) as HTMLElement;

    return paymentTemplateCopy;
  }

  choosePaymentOption(modal: HTMLElement, selectedButton: HTMLButtonElement) {
    const paymentOptions = modal.querySelectorAll(this.settings.orderButtonsSelector);

    paymentOptions.forEach(button => {
      button.classList.toggle(this.settings.activeButtonClass, button === selectedButton);
    });

    const paymentType = selectedButton.name === 'card' ? 'card' : 'cash';

    return paymentType;
  }

  checkValidationPayment(paymentTemplateCopy: HTMLElement) {
    const paymentOptions = paymentTemplateCopy.querySelectorAll(this.settings.orderButtonsSelector);
    const inputAddress = paymentTemplateCopy.querySelector(this.settings.inputAdressSelector) as HTMLInputElement;
    const nextButton = paymentTemplateCopy.querySelector(this.settings.orderNextButtonSelector) as HTMLButtonElement;

    const isAnyOptionSelected = Array.from(paymentOptions).some(option =>
      option.classList.contains(this.settings.activeButtonClass)
    );

    nextButton.disabled = inputAddress.value.trim() === '' || !isAnyOptionSelected;
  }


}