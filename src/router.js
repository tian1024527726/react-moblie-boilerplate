/* eslint-disable */
import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import renderRoutes from './renderRoutes';
import dynamic from './dynamic';

let routes = [
  {
    "path": "/",
    "component": dynamic({
component: () => import(/* webpackChunkName: "app__index" */'./app/index')
}),
    "routes": [
      {
        "path": "/",
        "redirect": "/home",
        "exact": true
      },
      {
        "path": "/home",
        "name": "home",
        "component": dynamic({
component: () => import(/* webpackChunkName: "p__home" */'./pages/home')
}),
        "exact": true
      }
    ]
  }
];

export default function RouterWrapper({ store, history }) {
	return (
		// 利用Provider可以使我们的 store 能为下面的组件所用
		<Provider store={store}>
			<Router history={history}>
				{renderRoutes(routes, {})}
			</Router>
		</Provider>
	);
}
