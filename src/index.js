import promise from 'es6-promise'
import Fastclick from "fastclick";
import React from 'react';
import ReactDOM from 'react-dom';
import history from '@history';
import configureStore from './redux/store';
import './mock';

promise.polyfill();
Fastclick.attach(document.body);

const store = configureStore(history);
const rootElement = document.getElementById('app');

const render = () => {
  const App = require('./app');
  ReactDOM.render(
    // 利用Provider可以使我们的 store 能为下面的组件所用
    <App store={store} history={history} />,
    rootElement
  );
}

if (process.env.NODE_ENV === 'development') {
  import('vconsole')
    .then(VConsole => {
      const vConsole = new VConsole.default(); // eslint-disable-line
    })
}

render();

if (module.hot) {
  module.hot.accept('./app', () => {
    ReactDOM.unmountComponentAtNode(rootElement);
    render();
  })
}
