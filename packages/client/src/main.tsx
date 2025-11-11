import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '~/App'
import { loadModules } from '~/modules'
import '~/styles.css'

async function init() {
  await loadModules()

  ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  )
}

init()
