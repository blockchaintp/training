import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { connectStore } from 'redux-box'

import { withStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import MenuIcon from '@material-ui/icons/Menu'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Snackbar from '@material-ui/core/Snackbar'

import { Helmet } from 'react-helmet'

import styles from '../styles/layout'
import config from '../config'

import Link from '@nocodesites/utils/lib/Link'
import snackbarModule from '@nocodesites/redux-modules/lib/modules/snackbar'

import selectors from '../selectors'

import AppBar from '../components/AppBar'

@connectStore({
  snackbar: snackbarModule,
})
@connect((state, ownProps) => {
  const pages = selectors.pages(state)
  return {
    pages,
  }
})
class Layout extends React.Component {

  state = {
    drawerOpen: false,
  }

  constructor(props) {
    super(props);
    this.contentRef = React.createRef()
  }

  toggleDrawer = (open) => {
    this.setState({
      drawerOpen: open,
    })
  }

  componentDidUpdate(oldProps) {
    if(oldProps.pathname != this.props.pathname) {
      this.contentRef.current.scrollTop = 0
    }
  }

  render() {
    const { 
      classes,
      children,
      snackbar,
      pages,
    } = this.props

    return (
      <div className={classes.root}>
        <Helmet
          title={config.title} 
          meta={[
            { name: "description", content: config.description },
          ]}
        >    
          <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        </Helmet>
        <AppBar 
          pages={ pages }
        />
        <div className={ classes.main }>
          <main className={ classes.content } ref={ this.contentRef }>
            { children }
          </main>
        </div>
        <div>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={ snackbar.isOpen }
            autoHideDuration={3000}
            onClose={ snackbar.close }
            message={ <span id="message-id">{ snackbar.message }</span> }
          />
        </div>
      </div>
    )
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Layout)