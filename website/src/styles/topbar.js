import config from '../config'

const styles = theme => {
  return {
    root: {
      padding: theme.spacing.unit * 2,
    },
    title: {
      flex: '0 0 auto',
    },
    largeNav: {
      display: 'none',
      [theme.breakpoints.up(config.LARGE_SCREEN_BREAKPOINT)]: {
        display: 'block',
      },
      [theme.breakpoints.down(config.SMALL_SCREEN_BREAKPOINT)]: {
        display: 'none',
      },
    },
    smallNav: {
      display: 'none',
      [theme.breakpoints.up(config.LARGE_SCREEN_BREAKPOINT)]: {
        display: 'none',
      },
      [theme.breakpoints.down(config.SMALL_SCREEN_BREAKPOINT)]: {
        display: 'block',
      },
    },
    navUl: {
      listStyleType: 'none',
      margin: '0',
      padding: '0',
      overflow: 'hidden',
      fontSize: '1em',
    },
    navLi: {
      float: 'left',
    },
    navLiA: {
      ...theme.typography.button,
      fontSize: '0.8em',
      display: 'block',
      color: '#333333',
      textAlign: 'center',
      padding: '12px',
      textDecoration: 'none',
      '&:hover': {
        color: 'white',
        backgroundColor: '#333',
      },
    },
    smallNavA: {
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
  }
}

export default styles
