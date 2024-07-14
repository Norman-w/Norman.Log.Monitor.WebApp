import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import ScrollingLogsViewer from './Component/ScrollingLogsViewer.tsx'
import './index.css'
import {LogRecord4Net} from "./Model/LogRecord4Net.ts";
import {Log} from "./Model/Log.ts";
import ToolBar from "./Component/ToolBar.tsx";
import styled from "styled-components";

const scrollingLogsViewerRef: React.RefObject<ScrollingLogsViewer> = React.createRef();
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
`;

//region 组件渲染
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/*<App />*/}
      <MainContainer>
          <ScrollingLogsViewer AutoScroll={true} ref={scrollingLogsViewerRef} />
          <ToolBar />
      </MainContainer>
  </React.StrictMode>,
)
//endregion

//region 模拟产生日志

/**
 * 生成随机的Detail字符串
 * @constructor
 */
const DetailStringMaker = (): string => {
    //随机生成10到300个字符的字符串
    const length = Math.floor(Math.random() * 290) + 10;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
//当前已经产生的日志数量
let currentTotalLogsCount: number = 0;
//设置一个定时器,每秒产生随机的1~5条日志,产生的日志为LogRecord4Net类型
//然后转换成Log类型,并调用ScrollingLogsViewer的AddLogs方法
const mockupLogsGeneratorInterval = setInterval(() => {
    const logs: Log[] = [];
    const logCount = Math.floor(Math.random() * 20) + 1;
    for (let i = 0; i < logCount; i++) {
        const logRecord4Net: LogRecord4Net = new LogRecord4Net();
        logRecord4Net.Type = Math.floor(Math.random() * 10) + 1;
        logRecord4Net.Layer = Math.floor(Math.random() * 6) + 1;
        logRecord4Net.Module = `Module ${i}`;
        logRecord4Net.Summary = `Summary ${currentTotalLogsCount + i}`;
        logRecord4Net.Detail = `Detail ${i} ${DetailStringMaker()}`;
        currentTotalLogsCount++;
        logs.push(Log.fromRecord(logRecord4Net));
        //够200条日志就停止
        if (currentTotalLogsCount >= 200) {
            clearInterval(mockupLogsGeneratorInterval);
            break;
        }
    }
    scrollingLogsViewerRef.current?.AddLogs(logs);
}, 200);
//endregion
