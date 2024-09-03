import { Basket as BasketInterface, Product } from "../../types"

export class Basket implements BasketInterface {
  basketItems: Product[] = [];

  constructor() { };

  addToBasket(product: Product) {
    this.basketItems.push(product);
  }

  removeFromBasket(productID: string): void {
    const index = this.basketItems.findIndex(item => item.id === productID);

    if (index !== -1) {
      this.basketItems.splice(index, 1);
    }
  }

  showBasketCounter(): number { return this.basketItems.length };

  calculateTotalPrice(): number {
    return this.basketItems.reduce((total, product) => total + product.price, 0);
  }

  cleanBasket(): void {
    this.basketItems = [];
  }

}