/*

应用的主入口,也是主窗体.
主要业务在这个文件中初始化.

当程序启动(窗体加载)时,创建一个WebSocket连接到服务器
当服务器发送日志过来的时候,显示到滚动日志显示组件上并自动根据过滤器过滤.

Tabs中包含两个TabPane:
1. 日志查询
2. 实时日志

重载样式时使用styled-components的createGlobalStyle方法创建全局样式并在Dom树上添加.

* */

import React, {useEffect} from 'react'
import styled, {createGlobalStyle} from "styled-components";
import {Log} from "./Model/Log.ts";
import {LogRecord4Net} from "./Model/LogRecord4Net.ts";
import WebSocketClient from "./WebSocketClient.ts";
import {NetSetting} from "./NetSetting.ts";
import useStoreLogPool from "./stores/useStoreLogPool.ts";
import LogQuery from "./Component/LogQuery.tsx";
import {ConfigProvider, Tabs, theme} from "antd";
import ScrollingLogsViewer from "./Component/ScrollingLogsViewer.tsx";

const IsDebugging = false;

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

// 重写Antd的样式,使得Tabs的内容区域高度100%
const OverrideAntdStyle = createGlobalStyle`
  .ant-tabs-content.ant-tabs-content-top {
    height: 100%;
  }
`;


const webSocketClient = new WebSocketClient();


function App() {
    const themeConfig = {
        token: {
            colorPrimary: 'yellowgreen',
            borderRadius: 4,
        },
        algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
    };

    const onWsOpen = () => {
        IsDebugging && console.log('WebSocket Opened');
    }
    const onWsClose = () => {
        IsDebugging && console.log('WebSocket Closed');
        //自动重连
        setTimeout(() => {
            IsDebugging && console.log('正在重连WebSocket')
            webSocketClient.connectSocket({
                url: NetSetting.WebSocketUrl,
                protocol: NetSetting.WebSocketProtocol
            });
        }, NetSetting.ReconnectIntervalMs);
    }
    const onWsError = (event: Event) => {
        IsDebugging && console.error('WebSocket Error', event);
    }
    const {addLogs} = useStoreLogPool();
    useEffect(() => {
        const onWsMessage = (event: MessageEvent) => {
            const logRecord4Net: LogRecord4Net = JSON.parse(event.data);
            // scrollingLogsViewerRef.current?.AddLogs([Log.fromRecord(logRecord4Net)]);
            IsDebugging && console.log('收到日志:', logRecord4Net)
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
        <ConfigProvider theme={themeConfig}>
            <OverrideAntdStyle/>
            <MainContainer>
                <Tabs
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    defaultActiveKey="1"
                    centered
                    type="line"
                >
                    <Tabs.TabPane tab="日志查询" key="1" style={{height: '100%'}}>
                        <LogQuery/>
                    </Tabs.TabPane>
                    <Tabs.TabPane className={'table-content'} tab="实时日志" key="2" style={{height: '100%'}}>
                        <ScrollingLogsViewer AutoScroll={true}/>
                    </Tabs.TabPane>
                </Tabs>
            </MainContainer>
        </ConfigProvider>
    )
}

export default App

/*

Tabs也可以使用items=[]的方式来渲染,但是这样会导致TabPane的高度不对,所以不推荐使用,如下  :

                    // items={[
                    //     {
                    //         label: '日志查询',
                    //         key: '1',
                    //         children: <LogQuery/>,
                    //     },
                    //     {
                    //         label: '实时日志',
                    //         key: '2',
                    //         children: <ScrollingLogsViewer AutoScroll={true}/>
                    //     },
                    // ]}

* */