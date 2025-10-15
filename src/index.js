import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { rootReducer } from './redux/reducer/rootReducer';
import { createStore, applyMiddleware, compose } from 'redux'
import { thunk } from 'redux-thunk'
import { CartProvider } from './Page/CartPage/CartContext';



const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <CartProvider>
      <App />
    </CartProvider>
  </Provider>
);

reportWebVitals();
