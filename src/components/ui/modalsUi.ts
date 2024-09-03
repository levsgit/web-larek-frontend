import { SETTINGS } from "../../utils/constants"

export class Modals {
  settings: typeof SETTINGS;
  modalContainer: HTMLElement;
  modalBasketTemplate: HTMLTemplateElement;

  constructor(settings: typeof SETTINGS) {
    this.settings = settings;
    this.modalContainer = document.querySelector(settings.modalSelector);

    this.handleEscape = this.handleEscape.bind(this);

    this.setCloseModal();
  };

  openModal(modal: HTMLElement) {
    const modalContent = this.modalContainer.querySelector(this.settings.modalContentSelector);
    modalContent.innerHTML = '';
    this.setHandleEscape();
    modalContent.appendChild(modal);
    this.modalContainer.classList.add(this.settings.modalActiveClass);
  }

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
}