import { SETTINGS } from "../../utils/constants";

export class SuccessUi {
  settings: typeof SETTINGS;
  successTemplate: HTMLTemplateElement;

  constructor(settings: typeof SETTINGS) {
    this.settings = settings;
    this.successTemplate = document.querySelector(settings.successTemplateSelector);
  }

  createSucessTemplate(price: number) {
    const successContent = this.successTemplate.content;
    const successTemplate = successContent.querySelector(this.settings.successContentSelector);
    const successTemplateCopy = successTemplate.cloneNode(true) as HTMLElement;
    const description = successTemplateCopy.querySelector(this.settings.successDiscriptionSelector);

    description.textContent = `Списано ${price} синапсов`;

    return successTemplateCopy;
  }
}