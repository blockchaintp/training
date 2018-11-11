import React from 'react'
import DocumentPage from './pages/Document'
import MainLayout from './pages/Layout'

export default {
  config: {
    defaultLayout: 'main'
  },
  pages: {
    document: DocumentPage,
  },
  layouts: {
    main: MainLayout,
  },
}
