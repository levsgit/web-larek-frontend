import { Order as OrderInterface, OrderSummary } from "../../types";

export class Order implements OrderInterface {
  payment: string;
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[] = [];

  constructor() {
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
      items: this.items,
      total: this.total,
    }
  };
}