import React from 'react'
import { Router } from '@nocodesites/utils'
import Theme from './theme'

class App extends React.Component {
  render() {
    return (
      <Theme
        generateClassName={ this.props.generateClassName }
        sheetsRegistry={ this.props.sheetsRegistry }
        sheetsManager={ this.props.sheetsManager }
      >
        <Router />
      </Theme>
    )
  }
}

export default App