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
      '& > code': {
        padding: '20px',
      }
    }
  }
}

export default styles
