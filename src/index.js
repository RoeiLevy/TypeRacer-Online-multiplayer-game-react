import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals'; 
import { initializeApp } from "firebase/app";
import { Provider } from 'react-redux'
import { store } from './store/store';

const firebaseConfig = {
  apiKey: "AIzaSyA3XfGNlsdNRL6AiixlurrR8M21_PapfLU",
  authDomain: "type-racer-c1f03.firebaseapp.com",
  projectId: "type-racer-c1f03",
  storageBucket: "type-racer-c1f03.appspot.com",
  messagingSenderId: "704184793714",
  appId: "1:704184793714:web:e97017ac25986bf5b6e0eb"
};

initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
