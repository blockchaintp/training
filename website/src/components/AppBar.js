import React from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import SideMenu from './SideMenu'

const styles = {
  root: {
    flexGrow: 1,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  logo: {
    height: '50px',
    marginRight: '20px',
    flex: 0,
  }
}

class AppBarComponent extends React.Component {
  render() {
    const { 
      classes,
      pages,
    } = this.props

    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <SideMenu 
              pages={ pages }
            />
            <img src="/images/white-outline-logo.png" className={ classes.logo } />
            <Typography variant="title" color="inherit" className={classes.flex}>
              Resources2
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

AppBarComponent.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(AppBarComponent)