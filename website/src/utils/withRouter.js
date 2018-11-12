import { connect } from 'react-redux'
import utils from './routerUtils'

const withRouter = () => {
  return connect(
    state => {
      const routerProps = state.location
      const currentRoute = routerProps.routesMap[routerProps.type]
      return {
        router: routerProps,
        currentRoute,
      }
    },
    dispatch => ({
      routerPush: (url, payload, routesMap) => {
        const urlRoute = Object.keys(routesMap).filter(key => {
          const route = routesMap[key]
          return route.path == url          
        })[0]
        if(!urlRoute) return
        dispatch({
          type: urlRoute
        })
      },
      routerExternal: url => document.location = url,
    })
  )
}

export default withRouter