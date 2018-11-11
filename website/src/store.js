import { reducer as formReducer }  from 'redux-form'
import { createStore } from '@nocodesites/utils'

import snackbar from '@nocodesites/redux-modules/lib/modules/snackbar'

import routes from './routes'
import templates from './templates'

const Store = (opts) => {
  opts = opts || {}
  return createStore({
    templates,
    routes,
    initialRoute: opts.initialRoute,
    reducers: {
      form: formReducer
    },
    modules: [
      snackbar,
    ],
  })
}

export default Store