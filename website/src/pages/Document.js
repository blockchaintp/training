import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { connectStore } from 'redux-box'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import snackbarModule from '@nocodesites/redux-modules/lib/modules/snackbar'

import styles from '../styles/document'
import selectors from '../selectors'

import BottomNav from '../components/BottomNav'

@connectStore({
  snackbar: snackbarModule,
})
@connect((state, ownProps) => {
  const route = ownProps.route
  const page = selectors.item(state, 'page', route.pageId)
  const pages = selectors.pages(state)
  return {
    page,
    pages,
  }
})
class DocumentPage extends React.Component {

  render() {

    const {
      classes,
      page,
      pages,
    } = this.props

    return (
      <div className={ classes.root }>
        <Paper className={ classes.paper }>
          <Typography variant="title" className={ classes.pageHeader }>{ page.meta.title }</Typography>
          <div className={ classes.content } dangerouslySetInnerHTML={{__html: page.body}}>
          </div>
          <BottomNav
            page={ page }
            pages={ pages }
          />
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(DocumentPage)