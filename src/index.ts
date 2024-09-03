import './scss/styles.scss';

import { App } from './components/base/app';
import { SETTINGS } from './utils/constants';
import { CATEGORYMAP } from './utils/constants';

const app = new App();
app.initApp(SETTINGS, CATEGORYMAP);