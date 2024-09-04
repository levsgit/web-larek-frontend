import { SETTINGS } from "../../utils/constants"

export class Modals {
  settings: typeof SETTINGS;
  modalContainer: HTMLElement;
  modalContent: HTMLElement;
  modalCloseButton: HTMLButtonElement;

  constructor(settings: typeof SETTINGS) {
    this.settings = settings;
    this.modalContainer = document.querySelector(settings.modalSelector);
    this.modalContent = this.modalContainer.querySelector(this.settings.modalContentSelector);
    this.handleEscape = this.handleEscape.bind(this);
    this.modalCloseButton = this.modalContainer.querySelector(this.settings.modalCloseSelector);

    document.addEventListener('click', (event: MouseEvent) => {
      if (this.modalContainer && this.modalContent) {
        const target = event.target as HTMLElement;
        if (this.modalContainer.contains(target) && !this.modalContent.contains(target)) {
          this.closeModal();
        }
      }
    });

    this.modalCloseButton.addEventListener('click', () => {
      this.closeModal();
    });
  };

  openModal(modal: Element) {
    this.modalContent.innerHTML = '';
    this.setHandleEscape();
    this.modalContent.appendChild(modal);
    this.modalContainer.classList.add(this.settings.modalActiveClass);
  }

  closeModal() {
    this.modalContainer.classList.remove(this.settings.modalActiveClass);
    this.removeHandleEscape();
  }

  handleEscape(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.closeModal();
    }
  }

  setHandleEscape() {
    document.addEventListener('keydown', this.handleEscape);
  }

  removeHandleEscape() {
    document.removeEventListener('keydown', this.handleEscape);
  }
}