import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import initStore from './store/initStore'
import App from "./App";
import './css/index.scss';

export const { store } = initStore([])
module.hot && module.hot.accept()   // 启用js热更新

ReactDOM.render(
  <Provider store={store}>
    <div className="main-manager">
      <App />
    </div>
  </Provider>,
  document.getElementById('app')
)