import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';
// import logger from 'redux-logger';
import rootReducer from './stores';

const devtoolsCompose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const composeEnhancers: typeof compose = process.env.NODE_ENV !== 'production' && devtoolsCompose || compose;

const enhancer = composeEnhancers(applyMiddleware(ReduxThunk), applyMiddleware(ReduxPromise));

const configureStore = () => {
  const _store = createStore(rootReducer, {}, enhancer);
  if (module.hot) {
    module.hot.accept('./stores', () => _store.replaceReducer(require('./stores').default));
  }
  return _store;
};

export const store = configureStore();

export default store;
