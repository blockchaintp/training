import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import styles from '../styles/markdown'
import ClipboardIcon from '@material-ui/icons/FileCopy'
import Tooltip from '@material-ui/core/Tooltip'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import snackbarModule from '@nocodesites/redux-modules/lib/modules/snackbar'

@connectStore({
  snackbar: snackbarModule,
})
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
    const { classes, snackbar } = this.props
    
    return (
      <Grid container spacing={0}>
        <Grid item xs={12} sm={10}>
          <pre className={ classes.pre }>
            <code ref={this.setRef} className={`language-${this.props.language}`}>
              {this.props.value}
            </code>
          </pre>
        </Grid>
        <Grid item xs={12} sm={2}>
          <div className={ classes.copyContainer }>
            <Tooltip title="Copy to clipboard" placement="top">
              <CopyToClipboard
                text={this.props.value}
                onCopy={() => {
                  snackbar.setMessage('Copied to clipboard')
                }}
              >
                
                <Button variant="fab" mini color="secondary" className={classes.button}>
                  <ClipboardIcon />
                </Button>
                
              </CopyToClipboard>
            </Tooltip>
          </div>
        </Grid>
      </Grid>
    )
  }
}

CodeBlock.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CodeBlock)