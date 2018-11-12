const nocodeSelectors = require('@nocodesites/utils/lib/selectors')

const selectors = {
  item: nocodeSelectors.item,
  group: nocodeSelectors.group,
  file: nocodeSelectors.file,
  pathname: (state) => state.location.pathname,
  pages: (state) => {
    const pages = Object.values(selectors.group(state, 'page'))

    pages.sort((a, b) => {
      if(a.meta.order > b.meta.order) return 1
      else if(b.meta.order > a.meta.order) return -1
      else return 0
    })

    return pages
  }
}

module.exports = selectors