import React from 'react'

import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import ReactMarkdown from 'react-markdown'

import CodeBlock from './CodeBlock'
import styles from '../styles/markdown'

class Markdown extends React.Component {

  render() {
    const {
      classes,
      content,
    } = this.props

    return (
      <div className={ classes.content }>
        <ReactMarkdown
          source={content}
          escapeHtml={false}
          renderers={{code: CodeBlock}}
        />
      </div>
    )
  }
}

Markdown.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Markdown)