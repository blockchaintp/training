import React from 'react'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-redux'

import Store from './store'
import App from './app'

const { store } = Store()

class Root extends React.Component {
  render() {
    return (
      <Provider store={ store }>
        <App />
      </Provider>
    );
  }
}

export default hot(module)(Root)