import { SETTINGS } from "../../utils/constants";

export class ContactsUi {
  settings: typeof SETTINGS;
  contactsModal: HTMLTemplateElement;
  emailInput: HTMLInputElement;
  phoneInput: HTMLInputElement;
  paymentButton: HTMLButtonElement;

  constructor(settings: typeof SETTINGS) {
    this.settings = settings;
    this.contactsModal = (document.querySelector(settings.contactsTemplateSelector) as HTMLTemplateElement).content.querySelector(this.settings.formTemplateSelector);
    this.emailInput = this.contactsModal.querySelector(this.settings.contactsEmailSelector) as HTMLInputElement;
    this.phoneInput = this.contactsModal.querySelector(this.settings.contactsPhoneSelector) as HTMLInputElement;
    this.paymentButton = this.contactsModal.querySelector(this.settings.paymentActionSelector).querySelector(this.settings.buttonSelector) as HTMLButtonElement;

    this.emailInput.addEventListener('input', () => { this.checkValidationContacts() });
    this.phoneInput.addEventListener('input', () => { this.checkValidationContacts() });
  };

  createContactsModal() {
    this.emailInput.value = '';
    this.phoneInput.value = '';
    this.checkValidationContacts();
    return this.contactsModal;
  }

  checkValidationContacts() {
    const isValid = !!(this.emailInput?.value.trim() && this.phoneInput?.value.trim());
    this.paymentButton && (this.paymentButton.disabled = !isValid);
  }
}