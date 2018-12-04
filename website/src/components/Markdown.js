import React from 'react'

import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import ReactMarkdown from 'react-markdown'

import MarkdownCodeBlock from './MarkdownCodeBlock'
import MarkdownBlockQuote from './MarkdownBlockQuote'
import MarkdownLink from './MarkdownLink'
import MarkdownImage from './MarkdownImage'
import MarkdownInlineCode from './MarkdownInlineCode'
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
          renderers={{
            code: MarkdownCodeBlock,
            link: MarkdownLink,
            blockquote: MarkdownBlockQuote,
            inlineCode: MarkdownInlineCode,
            image: MarkdownImage,
          }}
        />
      </div>
    )
  }
}

Markdown.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Markdown)