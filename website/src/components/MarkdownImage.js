import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import styles from '../styles/markdown'

class Image extends React.Component {
  render() {
    const { classes } = this.props
    return (
      <img className={ classes.image } src={ this.props.src } alt={ this.props.alt } />
    )
  }
}

Image.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Image)