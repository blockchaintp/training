import React from 'react'

import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import styles from '../styles/markdown'

class CodeBlock extends React.Component {
  constructor(props) {
    super(props)
    this.setRef = this.setRef.bind(this)
  }

  setRef(el) {
    this.codeEl = el
  }

  componentDidMount() {
    this.highlightCode()
  }

  componentDidUpdate() {
    this.highlightCode()
  }

  highlightCode() {
    window.hljs && window.hljs.highlightBlock(this.codeEl)
  }

  render() {
    const { classes } = this.props
    
    return (
      <pre className={ classes.pre }>
        <code ref={this.setRef} className={`language-${this.props.language}`}>
          {this.props.value}
        </code>
      </pre>
    )
  }
}

CodeBlock.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CodeBlock)