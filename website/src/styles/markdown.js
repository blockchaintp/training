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
      '& > code': {
        padding: '20px',  
      },
    },
    copyContainer: {
      textAlign: 'right',
      paddingTop: '20px',
    },
    blockquote: {
      backgroundColor: '#f5f5f5',
      marginLeft: '50px',
      border: '1px dotted #999',
      borderLeft: '5px solid #3D4797',
      padding: '20px',
    },
    inlineCode: {
      color: '#D81C38',
    }
  }
}

export default styles
