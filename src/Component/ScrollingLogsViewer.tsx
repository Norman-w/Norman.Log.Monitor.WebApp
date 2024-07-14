import React, {useRef, useState, useImperativeHandle, forwardRef, useEffect} from 'react';
import {Log} from "../Model/Log.ts";
import styled from 'styled-components';
import {LogRecord4View} from "../Model/LogRecord4View.ts";
import {LogLine} from "./LogLine.tsx";
import {LogType} from "../Model/LogType.ts";
import {LogLayer} from "../Model/LogLayer.ts";
import useStoreLogsFilterState from "../stores/useStoreLogsFilterState.ts";

//region 子组件及样式定义

const LogsContainer = styled.div`
  width: 100%;
  flex: 1;
  overflow: auto;
  box-sizing: border-box;
  padding-left: 8px;
  padding-right: 8px;
  margin-bottom: 8px;
  border: 1px solid lightgrey;
`;
//endregion

//region 类型定义
/**
 * 滚动日志查看器属性
 */
interface ScrollingLogsViewerProps {
    /**
     * 是否自动滚动到底部
     */
    AutoScroll: boolean;
}
//endregion

//region 全局函数
/**
 * 判断日志是否匹配过滤条件
 * @param log
 * @param filterText
 * @param filterLogTypes
 * @param filterLogLayers
 */
const isMatched = (log: Log,
                   filterText: string | null | undefined,
                   filterLogTypes: LogType[] | undefined | null,
                   filterLogLayers: LogLayer[] | undefined | null) => {
    let isMatchedByFilterText: boolean;
    let isMatchedByLogType: boolean;
    let isMatchedByLogLayer: boolean;
    //region 输入字符串过滤
    //如果是空字符串,则不过滤
    if (!filterText) {
        isMatchedByFilterText = true;
    } else {
        //将过滤的用户输入的关键字分割成字符串数组.
        const filterByTextSplitTagArray = filterText.split(/[ ,]/);
        //分别用Summary,Detail,Module进行匹配
        isMatchedByFilterText = filterByTextSplitTagArray.some(tag => {
            return log.Summary.includes(tag) || log.Detail.includes(tag) || log.Module.includes(tag);
        });
    }
    //endregion
    //region 日志类型过滤
    //如果没有选择过滤条件,则不过滤
    if (!filterLogTypes || filterLogTypes.length === 0) {
        isMatchedByLogType = true;
    } else {
        isMatchedByLogType = filterLogTypes.some(logType => log.Type === logType);
    }
    //endregion
    //region 日志所在层过滤
    //如果没有选择过滤条件,则不过滤
    if (!filterLogLayers || filterLogLayers.length === 0) {
        isMatchedByLogLayer = true;
    } else {
        isMatchedByLogLayer = filterLogLayers.some(logLayer => log.Layer === logLayer);
    }
    //endregion
    return isMatchedByFilterText && isMatchedByLogType && isMatchedByLogLayer;
}
//endregion

//region 组件定义及导出
/**
 * 滚动日志查看器
 */
const ScrollingLogsViewer
    = forwardRef((props: ScrollingLogsViewerProps, ref) => {

    //region 组件状态
    const [logsViewList, setLogs] = useState<LogRecord4View[]>([]);
    const logsEndRef: React.RefObject<HTMLDivElement> = useRef(null);
    const {
        filterText,
        filterLogTypes,
        filterLogLayers,
    } = useStoreLogsFilterState();
    //endregion

    //region 向外暴露方法
    useImperativeHandle(ref, () => ({
        AddLogs(newLogs: Log[]) {
            const newLogsViewList = newLogs.map(log => {
                const log4View = new LogRecord4View(log);
                log4View.Display = isMatched(log, filterText, filterLogTypes, filterLogLayers);
                return log4View;
            });
            const newArray = logsViewList.concat(newLogsViewList);
            setLogs(newArray);
            if (props.AutoScroll) {
                //在nextTick中滚动到底部
                setTimeout(scrollToBottom, 0);
            }
        }
    }));
    //endregion

    //region useEffect,在useStoreLogsFilterState状态变化时,重新过滤日志
    useEffect(() => {
        const newLogsViewList = logsViewList.map(log => {
            log.Display = isMatched(log.Log, filterText, filterLogTypes, filterLogLayers);
            return log;
        });
        setLogs(newLogsViewList);
    }, [filterText, filterLogTypes, filterLogLayers]);


    //region 组件方法
    /**
     * 滚动到底部
     */
    const scrollToBottom = () => {
        const options: ScrollIntoViewOptions = {behavior: 'smooth', block: 'end', inline: 'nearest'};
        logsEndRef.current?.scrollIntoView(options);
    };
    //endregion

    //region 渲染/模板定义
    return (
            <LogsContainer>
                {logsViewList.map((log, index) => (
                    <div key={index}>
                        {/*{JSON.stringify(log)}*/}
                        {log.Display ? (
                            <LogLine log={log}>
                            </LogLine>
                        ) : null}
                    </div>
                ))}
                <div ref={logsEndRef} style={{borderBottom: '1px solid lightgrey', textAlign: "center"}}>
                    -----End-----
                </div>
            </LogsContainer>
    );
    //endregion
});

export default ScrollingLogsViewer;
//endregion