import React from 'react'

import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import IconForward from '@material-ui/icons/ArrowForward'
import IconBack from '@material-ui/icons/ArrowBack'

import withRouter from '../utils/withRouter'

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing.unit * 2,
  }, 
  divider: {
    marginBottom: theme.spacing.unit * 2,
  },
  alignRight: {
    textAlign: 'right',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
})

@withRouter()
class BottomNav extends React.Component {

  openPage = (url) => {
    this.props.routerPush(url, null, this.props.router.routesMap)
  }

  getPage(offset) {
    const {
      page,
      pages,
    } = this.props
    return pages.filter(p => p.meta.order == page.meta.order + offset)[0]
  }

  getPreviousPageButton() {
    const { classes } = this.props
    const previousPage = this.getPage(-1)
    if(!previousPage) return null

    return (
      <Button
        onClick={ () => this.openPage(previousPage.url) }
      >
        <IconBack className={ classes.leftIcon } />
        Prev : { previousPage.meta.order }. { previousPage.meta.title }
      </Button>
    )
  }

  getNextPageButton() {
    const { classes } = this.props
    const nextPage = this.getPage(1)
    if(!nextPage) return null

    return (
      <Button
        onClick={ () => this.openPage(nextPage.url) }
      >
        Next : { nextPage.meta.order }. { nextPage.meta.title }
        <IconForward className={ classes.rightIcon } />
      </Button>
    )
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Divider className={classes.divider} /> 

        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
            { this.getPreviousPageButton() }
          </Grid>
          <Grid item xs={12} sm={6} className={ classes.alignRight }>
            { this.getNextPageButton() }
          </Grid>
        </Grid>
        
      </div>
    )
  }
}

BottomNav.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(BottomNav)