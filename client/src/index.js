import React from 'react';
import ReactDOM from 'react-dom';

import { Provider as StoreProvider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import appStore from './app/app/index';
import App from './app/App';

import './index.css';

const app = (
  <StoreProvider store={appStore.getStore()}>
    <App />
  </StoreProvider>
);

ReactDOM.render(app, document.getElementById('root'));

serviceWorker.unregister();
