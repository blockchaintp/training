import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import styles from '../styles/markdown'

class MarkdownLink extends React.Component {
  render() {
    const { classes } = this.props
    return (
      <a target="_blank" href={ this.props.href }>{ this.props.children }</a>
    )
  }
}

MarkdownLink.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MarkdownLink)