/* eslint-disable */
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routes from './route/index';

const AppContainer = (props) => {
  const { store, history } = props
  return (
    <Provider store={store}>
      <Router routes={routes} history={history} />
    </Provider>
  )
}

export default AppContainer
