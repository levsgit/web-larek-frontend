import { Order as OrderInterface, OrderSummary } from "../../types";
import { Api } from "./api";
import { Basket } from "./basket";

export class Order implements OrderInterface {
  api: Api;
  payment: string;
  address: string;
  email: string;
  phone: string;
  total: number;
  basket: Basket;

  constructor(basket: Basket, api: Api) {
    this.api = api;
    this.basket = basket;
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
    this.total = 0;
  };

  setParam(key: string, value: string) {
    //@ts-ignore
    this[key] = value
  }


  returnOrder(): OrderSummary {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
      items: this.basket.basketItems.map((product) => product.id),
      total: this.total,
    }
  };

  sendOrder(e: Event) {
    e.preventDefault();
    const order = this.returnOrder();

    console.log(order);

    this.api.post('/order', order).then(() => {
      this.basket.cleanBasket();
    }).catch((error) => console.error(error));
  }
}