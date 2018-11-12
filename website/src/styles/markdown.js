import config from '../config'

const styles = theme => {
  return {
    root: {
      
    },
    content: {
      ...theme.typography.body1,
      fontSize: '12pt',
    },
    pre: {
      border: '1px dotted #999',
      overflow: 'auto',
      padding: '20px',
    },
    copyContainer: {
      textAlign: 'right',
      paddingTop: '20px',
    }
  }
}

export default styles
