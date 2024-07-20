/*


网站的主入口,相当于应用程序的main函数.

TODO,当前已经关闭了严格模式,正式使用时应当打开.
关闭严格模式可保证App组件只被初始化一次,
也就是说初始化WebSocket等内容将会只调用一次.
当打开严格模式时,为了确保组件的正确工作和渲染,App组件会初始化两次,所以在App内部的初始化逻辑需要判断是否已经执行过(比如ws连接客户端是不是已经初始化了)


* */


import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from "./App.tsx";
//region 组件渲染
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <App/>
  // </React.StrictMode>,
)
//endregion