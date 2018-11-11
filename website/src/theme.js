import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import { convertHexToRGB, lighten, darken } from '@material-ui/core/styles/colorManipulator'
import NocodeTheme from '@nocodesites/material-ui-components/lib/Theme'
const primary = convertHexToRGB('#3D4797')
const secondary = convertHexToRGB('#D81C38')

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: lighten(primary, 0.2),
      main: primary,
      dark: darken(primary, 0.2),
    },
    secondary: {
      light: lighten(secondary, 0.2),
      main: secondary,
      dark: darken(secondary, 0.2),
    },
  },
})

class Theme extends React.Component {

  render() {
    return (
      <NocodeTheme
        theme={ theme }
        { ...this.props }
      />
    )
  }
}

export default Theme