import { SETTINGS } from "../../utils/constants";

export class SuccessUi {
  settings: typeof SETTINGS;
  successModal: HTMLElement;
  description: HTMLElement;
  successButton: HTMLButtonElement;

  constructor(settings: typeof SETTINGS) {
    this.settings = settings;
    this.successModal = (document.querySelector(settings.successTemplateSelector) as HTMLTemplateElement).content.querySelector(this.settings.successContentSelector);
    this.description = this.successModal.querySelector(this.settings.successDiscriptionSelector);
    this.successButton = this.successModal.querySelector(this.settings.successModalButtonSelector);
  }

  createSucessTemplate(price: number) {
    this.description.textContent = `Списано ${price} синапсов`;
    return this.successModal;
  }
}