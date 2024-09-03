import { SETTINGS } from "../../utils/constants";

export class ContactsUi {
  settings: typeof SETTINGS;
  contactsTemplate: HTMLTemplateElement;

  constructor(settings: typeof SETTINGS) {
    this.settings = settings;
    this.contactsTemplate = document.querySelector(settings.contactsTemplateSelector);
  };

  createContactsTemplate() {
    const contactsContent = this.contactsTemplate.content;
    const contactsTemplate = contactsContent.querySelector(this.settings.formTemplateSelector);
    const contactsTemplateCopy = contactsTemplate.cloneNode(true) as HTMLElement;

    return contactsTemplateCopy;
  }

  checkValidationContacts(contactsTemplateCopy: HTMLElement) {
    const emailInput = contactsTemplateCopy.querySelector(this.settings.contactsEmailSelector) as HTMLInputElement;
    const phoneInput = contactsTemplateCopy.querySelector(this.settings.contactsPhoneSelector) as HTMLInputElement;
    const paymentButton = contactsTemplateCopy.querySelector(this.settings.paymentActionSelector).querySelector(this.settings.buttonSelector) as HTMLButtonElement;
    const isValid = emailInput?.value.trim() !== '' && phoneInput?.value.trim() !== '';

    if (paymentButton) {
      paymentButton.disabled = !isValid;
    }
  }

}