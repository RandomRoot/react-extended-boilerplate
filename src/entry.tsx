import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { Router, Route } from 'react-router-dom';
import store from './configureStore';
import Application from '.';
import history from '@utils/history';

function renderMain(App: React.ReactType) {
  return (
    <AppContainer>
      <Provider store={ store }>
        <Router history={ history }>
          <Application />
        </Router>
      </Provider>
    </AppContainer>
  );
}

render(renderMain(Application), document.getElementById('root'));

if (module.hot) {
  module.hot.accept('.', () => {
    render(renderMain(require('.').default), document.getElementById('root'));
  });
}
