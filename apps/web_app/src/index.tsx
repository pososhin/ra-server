import React from 'react'
import ReactDOM from 'react-dom'
import './css/style.scss'
import App from './app'
import './socket-client'

const rootNode = document.createElement('div')
rootNode.setAttribute('id', 'root')
rootNode.innerText = 'Hello World!'
document.body.appendChild(rootNode)

ReactDOM.render(<App />, rootNode )