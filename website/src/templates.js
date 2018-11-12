import React from 'react'
import DocumentPage from './pages/Document'
import HomePage from './pages/Home'
import MainLayout from './pages/Layout'

export default {
  config: {
    defaultLayout: 'main'
  },
  pages: {
    home: HomePage,
    document: DocumentPage,
  },
  layouts: {
    main: MainLayout,
  },
}
