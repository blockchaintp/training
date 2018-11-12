import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { connectStore } from 'redux-box'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import IconDescription from '@material-ui/icons/Description'

import snackbarModule from '@nocodesites/redux-modules/lib/modules/snackbar'

import withRouter from '../utils/withRouter'
import styles from '../styles/document'
import selectors from '../selectors'

@connectStore({
  snackbar: snackbarModule,
})
@connect((state, ownProps) => {
  const pages = selectors.pages(state)
  return {
    pages,
  }
})
@withRouter()
class HomePage extends React.Component {


  openPage = (url) => {
    this.props.routerPush(url, null, this.props.router.routesMap)
  }

  render() {

    const {
      classes,
      pages,
    } = this.props

    return (
      <div className={ classes.root }>
        <Paper className={ classes.paper }>
          <Typography variant="title" className={ classes.pageHeader }>Pages</Typography>
          <List component="nav">
            {
              pages.map((page, i) => {
                return (
                  <ListItem 
                    button 
                    key={ i }
                    onClick={ () => this.openPage(page.url) }
                  >
                    <ListItemIcon>
                      <IconDescription />
                    </ListItemIcon>
                    <ListItemText primary={ `${page.meta.order}. ${page.meta.title}`} />
                  </ListItem>
                )
              })
            }
          </List>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(HomePage)