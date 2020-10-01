import React from 'react'

import {Navbar} from './components'
import Routes from './routes'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
      <canvas width="320" height="240" className="myCanvas">
        <p>POOOp</p>
      </canvas>
    </div>
  )
}

export default App
