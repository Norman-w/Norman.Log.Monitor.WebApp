/*

应用的主入口,也是主窗体.
主要业务在这个文件中初始化.

当程序启动(窗体加载)时,创建一个WebSocket连接到服务器
当服务器发送日志过来的时候,显示到滚动日志显示组件上并自动根据过滤器过滤.

* */

import React, {useEffect} from 'react'
import ScrollingLogsViewer from "./Component/ScrollingLogsViewer.tsx";
import ToolBar from "./Component/ToolBar.tsx";
import styled from "styled-components";
import {Log} from "./Model/Log.ts";
import {LogRecord4Net} from "./Model/LogRecord4Net.ts";
import WebSocketClient from "./WebSocketClient.ts";
import {NetSetting} from "./NetSetting.ts";
import useStoreLogPool from "./stores/useStoreLogPool.ts";
import {SearchPage} from "./Component/SearchPage";
import AntdTable from "./Component/Test/AntdTable.tsx";

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


const webSocketClient = new WebSocketClient();


function App() {

    const onWsOpen = () => {
        console.log('WebSocket Opened');
    }
    const onWsClose = () => {
        console.log('WebSocket Closed');
        //自动重连
        setTimeout(() => {
            console.log('正在重连WebSocket')
            webSocketClient.connectSocket({
                url: NetSetting.WebSocketUrl,
                protocol: NetSetting.WebSocketProtocol
            });
        }, NetSetting.ReconnectIntervalMs);
    }
    const onWsError = (event: Event) => {
        console.error('WebSocket Error', event);
    }
    const {addLogs} = useStoreLogPool();
    useEffect(() => {
        const onWsMessage = (event: MessageEvent) => {
            const logRecord4Net: LogRecord4Net = JSON.parse(event.data);
            // scrollingLogsViewerRef.current?.AddLogs([Log.fromRecord(logRecord4Net)]);
            console.log('收到日志:', logRecord4Net)
            addLogs([Log.fromRecord(logRecord4Net)]);
        }
        console.log('正在连接WebSocket')
        webSocketClient.onConnectedEvent.add(onWsOpen);
        webSocketClient.onLostConnectEvent.add(onWsClose);
        webSocketClient.onSocketMessageEvent.add(onWsMessage);
        webSocketClient.onErrorEvent.add(onWsError);
        const options = {
            url: NetSetting.WebSocketUrl,
            protocol: NetSetting.WebSocketProtocol
        };
        webSocketClient.connectSocket(options);
        return () => {
            webSocketClient.onConnectedEvent.remove(onWsOpen);
            webSocketClient.onLostConnectEvent.remove(onWsClose);
            webSocketClient.onSocketMessageEvent.remove(onWsMessage);
            webSocketClient.onErrorEvent.remove(onWsError);
            webSocketClient.dispose();
        }
    }, [addLogs]);//给一个空数组,表示只在第一次渲染时执行

  return (
      <MainContainer>
          {/*<ScrollingLogsViewer AutoScroll={true} />*/}
          {/*<ToolBar />*/}
          <SearchPage></SearchPage>
          {/*<AntdTable></AntdTable>*/}
      </MainContainer>
  )
}

export default App