import React from 'react'
import Server from '@nocodesites/material-ui-components/lib/Server'
import Store from './store'
import App from './app'

const handler = Server({
  App,
  Store,
})

export default handler