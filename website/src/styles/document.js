import config from '../config'

const styles = theme => {
  return {
    root: {
      marginTop: '70px',
      padding: theme.spacing.unit * 2,
    },
    paper: {
      padding: theme.spacing.unit * 2,
    },
    content: {
      ...theme.typography.body1,
      fontSize: '12pt',
    },
    pageHeader: {
      fontWeight: 'bold',
      color: theme.palette.primary.main,
      padding: '12px',
      paddingLeft: '0px',
    },
    button: {
      margin: '10px',
    }
  }
}

export default styles
