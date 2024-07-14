import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from "./App.tsx";
//region 组件渲染
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
)
//endregion