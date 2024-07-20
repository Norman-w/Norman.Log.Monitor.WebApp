/*

滚动显示日志的组件.
组件中同时显示的日志数量当前在useStoreLogPool中设置.
TODO,这项设置具体应该放在哪里需要仔细斟酌,后续可能会开发配置单页可显式日志条数的功能.

每当在网络(ws)收到日志的网络载体格式数据,
在设置store的时候,由于本组件绑定(watch)了store中的值,所以当logs变化时,组件将会触发更新.
得到新的log业务模型的数组后,将数据转换为视图模型以进行显示.


* */


import React, {useRef, useEffect, useMemo} from 'react';
import {Log} from "../Model/Log.ts";
import styled from 'styled-components';
import {LogRecord4View} from "../Model/LogRecord4View.ts";
import {LogLine} from "./LogLine.tsx";
import {LogType} from "../Model/LogType.ts";
import {LogLayer} from "../Model/LogLayer.ts";
import useStoreLogsFilterState from "../stores/useStoreLogsFilterState.ts";
import useStoreLogPool from "../stores/useStoreLogPool.ts";

// 定义日志容器的样式
const LogsContainer = styled.div`
  width: 100%;
  flex: 1;
  overflow: auto;
  box-sizing: border-box;
  padding: 8px 14px 8px 8px;
  margin-bottom: 8px;
  border: 1px solid lightgrey;
`;

// 滚动日志查看器组件的属性类型定义
interface ScrollingLogsViewerProps {
    AutoScroll: boolean; // 是否自动滚动到底部
}

// 判断日志是否匹配过滤条件的函数
const isMatched = (log: Log,
                   filterText: string | null | undefined,
                   filterLogTypes: LogType[] | undefined | null,
                   filterLogLayers: LogLayer[] | undefined | null) => {
    // 根据文本、日志类型、日志层级进行过滤
    let isMatchedByFilterText: boolean;
    let isMatchedByLogType: boolean;
    let isMatchedByLogLayer: boolean;

    // 文本过滤逻辑
    if (!filterText) {
        isMatchedByFilterText = true;
    } else {
        const filterByTextSplitTagArray = filterText.split(/[ ,]/);
        isMatchedByFilterText = filterByTextSplitTagArray.some(tag => {
            return log.Summary.includes(tag) || log.Detail.includes(tag) || log.Module.includes(tag);
        });
    }

    // 日志类型过滤逻辑
    if (!filterLogTypes || filterLogTypes.length === 0) {
        isMatchedByLogType = true;
    } else {
        isMatchedByLogType = filterLogTypes.some(logType => log.Type === logType);
    }

    // 日志层级过滤逻辑
    if (!filterLogLayers || filterLogLayers.length === 0) {
        isMatchedByLogLayer = true;
    } else {
        isMatchedByLogLayer = filterLogLayers.some(logLayer => log.Layer === logLayer);
    }

    return isMatchedByFilterText && isMatchedByLogType && isMatchedByLogLayer;
}

// 将日志列表转换为视图模型列表的函数
const logList2LogViewList = (logList: Log[]): LogRecord4View[] => {
    return logList.map(log => new LogRecord4View(log));
}

// 滚动日志查看器组件
const ScrollingLogsViewer = (props: ScrollingLogsViewerProps) => {
    const {logs} = useStoreLogPool(); // 从状态管理中获取日志列表
    // const [logsViewList, setLogs] = useState<LogRecord4View[]>([]); // 组件状态：用于存储转换后的日志视图模型列表
    const logsEndRef: React.RefObject<HTMLDivElement> = useRef(null); // 用于滚动到底部的ref
    const {filterText, filterLogTypes, filterLogLayers} = useStoreLogsFilterState(); // 从状态管理中获取过滤条件

    // 直接使用 useMemo 来计算并返回过滤后的日志列表
    const logsViewList = useMemo(() => {
        const filteredLogs = logs.filter(log => isMatched(log, filterText, filterLogTypes, filterLogLayers));
        return logList2LogViewList(filteredLogs);
    }, [logs, filterText, filterLogTypes, filterLogLayers]);

    // 如果启用了自动滚动，当日志列表更新时滚动到底部
    useEffect(() => {
        if (props.AutoScroll) {
            scrollToBottom();
        }
    }, [logsViewList, props.AutoScroll]);

    // 滚动到日志列表底部的函数
    const scrollToBottom = () => {
        const options: ScrollIntoViewOptions = {behavior: 'smooth', block: 'end', inline: 'nearest'};
        logsEndRef.current?.scrollIntoView(options);
    };

    // 组件渲染逻辑
    return (
        <LogsContainer>
            {logsViewList.map((log, index) => (
                <div key={index}>
                    {log.Display ? <LogLine log={log}></LogLine> : null}
                </div>
            ))}
            <div ref={logsEndRef} style={{borderBottom: '1px solid lightgrey', textAlign: "center"}}>
                -----End-----
            </div>
        </LogsContainer>
    );
};

export default ScrollingLogsViewer;