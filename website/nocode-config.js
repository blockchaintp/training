const routes = require('./src/routes')
const selectors = require('./src/selectors')

const getPlugins = (opts) => [{
  // extract the markdown files
  build: (context, options, next) => {

    context.addItem('document', {
      id: 'test',
      html: '<div>hello world</div>'
    })
    context.addRoute('/', {
      page: 'document',
      documentId: 'test',
    })
    next()
  }
}]

module.exports = {
  routes,
  getPlugins,
}