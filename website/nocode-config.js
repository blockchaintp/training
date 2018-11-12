const fs = require('fs')
const frontMatter = require('front-matter')
const async = require('async')
const path = require('path')
const routes = require('./src/routes')
const selectors = require('./src/selectors')

const CONTENT_DIR = path.join(__dirname, 'content')

const getPages = (done) => {
  async.waterfall([

    // load the filenames
    (next) => fs.readdir(CONTENT_DIR, next),

    // turn each filename into an object with
    // * filename
    // * data
    // by loading the file contents
    (filenames, next) => async.map(filenames, (filename, nextFile) => {
      const filepath = path.join(CONTENT_DIR, filename)
      fs.readFile(filepath, 'utf8', (err, data) => {
        if(err) return nextFile(err)
        nextFile(null, {
          filename,
          data,
        })
      })
    }, next),

    // process the frontmatter in the file and return an object with
    // * filename
    // * body
    // * meta
    // * url
    (pages, next) => {
      pages = pages.map(page => {
        const content = frontMatter(page.data)
        const id = page.filename.replace(/\.md$/, '')
        const url = `/${id}`
        return {
          id,
          url,
          filename: page.filename,
          body: content.body,
          meta: content.attributes,
        }
      })
      next(null, pages)
    }
  ], done)
}

const getPlugins = (opts) => [{
  // load the files in 'content' and process the frontmatter
  // for each file - add a 'page' item with raw body and frontmatter as metadata
  build: (context, options, next) => {

    getPages((err, pages) => {
      if(err) {
        console.error(err)
        process.exit()
      }
      pages.forEach(page => {
        context.addItem('page', page)
        context.addRoute(page.url, {
          page: 'document',
          pageId: page.id,
        })
      })

      next()
    })

  }
}]

module.exports = {
  routes,
  getPlugins,
}