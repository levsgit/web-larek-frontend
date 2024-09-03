import './scss/styles.scss';

import { App } from './components/base/app';
import { API_URL, SETTINGS } from './utils/constants';
import { CATEGORYMAP } from './utils/constants';
import { Api } from './components/base/api';
import { DetailsView } from './components/ui/detailsView';
import { Basket } from './components/base/basket';
import { Modals } from './components/ui/modalsUi';
import { BasketUi } from './components/ui/basketUi';
import { CatalogUi } from './components/ui/catalogUi';
import { Order } from './components/base/order';
import { PaymentUi } from './components/ui/paymentUi';
import { ContactsUi } from './components/ui/ContactsUi';
import { SuccessUi } from './components/ui/successView';

const api = new Api(API_URL);
const detailsView = new DetailsView(SETTINGS);
const basket = new Basket();
const basketUi = new BasketUi(SETTINGS);
const paymentUi = new PaymentUi(SETTINGS);
const catalog = new CatalogUi(SETTINGS, CATEGORYMAP);
const order = new Order();
const modals = new Modals(SETTINGS);
const contactsUi = new ContactsUi(SETTINGS);
const successUi = new SuccessUi(SETTINGS);

const app = new App(SETTINGS, api, detailsView, basket, modals, basketUi, catalog, paymentUi, order, contactsUi, successUi);
app.initApp();