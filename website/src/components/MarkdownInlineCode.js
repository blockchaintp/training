import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import styles from '../styles/markdown'

class InlineCode extends React.Component {
  render() {
    const { classes } = this.props
    
    return (
      <span className={ classes.inlineCode }>
        { this.props.children }
      </span>
    )
  }
}

InlineCode.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(InlineCode)