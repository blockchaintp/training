import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import styles from '../styles/markdown'

class BlockQuote extends React.Component {
  render() {
    const { classes } = this.props
    
    return (
      <div className={ classes.blockquote }>
        { this.props.children }
      </div>
    )
  }
}

BlockQuote.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(BlockQuote)