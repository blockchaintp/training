import config from '../config'

const styles = theme => {
  return {
    link: {
      color: theme.palette.text.primary,
      '& *': {
      	fontSize: ['0.95em', '!important']
      },
    },
  }
}

export default styles
