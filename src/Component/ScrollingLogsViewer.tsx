import React, {useRef, useState, useImperativeHandle, forwardRef} from 'react';
import {Log} from "../Model/Log.ts";
import styled from 'styled-components';
import {LogRecord4View} from "../Model/LogRecord4View.ts";
import {LogLine} from "./LogLine.tsx";
import {Select, Tooltip} from 'antd';
import {LogType} from "../Model/LogType.ts";
import {LogLayer} from "../Model/LogLayer.ts";

//region 子组件及样式定义
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
const ToolBar = styled.div`
  display: flex;
  column-gap: 8px;
  justify-content: center;
  margin-bottom: 8px;
  background-color: #f0f0f0;
  width: 100%;
  height: 30px;
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
    //日志包含关键字过滤条件,只要日志的Summary,Detail,Module中包含关键字,则显示,空格和逗号都视为分隔符
    const [filterText, setFilterText] = useState<string>("");
    //日志类型过滤条件
    const [filterLogTypes, setFilterLogTypes] = useState<LogType[]>([]);
    //日志所在层过滤条件
    const [filterLogLayers, setFilterLogLayers] = useState<LogLayer[]>([]);
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

    //region 组件事件处理
    /**
     * 处理过滤文本变化事件
     * @param e
     */
    const onFilterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFilter = e.target.value;
        setFilterText(newFilter);
        const newLogsViewList = logsViewList.map(log => {
            log.Display = isMatched(log.Log, newFilter, filterLogTypes, filterLogLayers);
            return log;
        });
        setLogs(newLogsViewList);
    }
    /**
     * 处理过滤日志类型变化事件
     * @param value
     */
    const onFilterLogTypeChange = (value: string[]) => {
        //从LogType.GetLogTypeByName中获取LogType对象
        const selectedLogTypes: LogType[] = [];
        for (let i = 0; i < value.length; i++) {
            const parsedLogType = LogType.GetLogTypeByName(value[i]);
            if (parsedLogType) {
                selectedLogTypes.push(parsedLogType);
            }
        }
        setFilterLogTypes(selectedLogTypes);
        const newLogsViewList = logsViewList.map(log => {
            log.Display = isMatched(log.Log, filterText, selectedLogTypes, filterLogLayers);
            return log;
        });
        setLogs(newLogsViewList);
    }
    /**
     * 处理过滤日志层级变化事件
     * @param value
     */
    const onFilterLogLayerChange = (value: string[]) => {
        //从LogLayer.GetLogLayerByName中获取LogLayer对象
        const selectedLogLayers: LogLayer[] = [];
        for (let i = 0; i < value.length; i++) {
            const parsedLogLayer = LogLayer.GetLogLayerByName(value[i]);
            if (parsedLogLayer) {
                selectedLogLayers.push(parsedLogLayer);
            }
        }
        setFilterLogLayers(selectedLogLayers);
        const newLogsViewList = logsViewList.map(log => {
            log.Display = isMatched(log.Log, filterText, filterLogTypes, selectedLogLayers);
            return log;
        });
        setLogs(newLogsViewList);
    }
    //endregion

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
        <MainContainer>
            {/*日志列表*/}
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
            {/*工具栏*/}
            <ToolBar>
                {/*日志类型过滤器*/}
                <Select
                    mode="tags"
                    style={{width: 100}}
                    placeholder="类型过滤"
                    onChange={onFilterLogTypeChange}
                    maxTagCount={"responsive"}
                    maxTagPlaceholder={(omittedValues) => (
                        <Tooltip
                            overlayStyle={{pointerEvents: 'none'}}
                            title={omittedValues.map(({label}) => label).join(', ')}
                        >
                            <span>{omittedValues.length}种类型</span>
                        </Tooltip>
                    )}
                >
                    {LogType.GetKnownLogTypes().map(logType => (
                        <Select.Option key={logType.Name} value={logType.Name}>
                            {logType.Name}
                        </Select.Option>
                    ))}
                </Select>
                {/*日志层级过滤器*/}
                <Select
                    mode="tags"
                    style={{width: 120}}
                    placeholder="层级过滤"
                    onChange={onFilterLogLayerChange}
                    maxTagCount={"responsive"}
                    maxTagPlaceholder={(omittedValues) => (
                        <Tooltip
                            overlayStyle={{pointerEvents: 'none'}}
                            title={omittedValues.map(({label}) => label).join(', ')}
                        >
                            <span>{omittedValues.length}个层级</span>
                        </Tooltip>
                    )}
                >
                    {LogLayer.GetKnownLogLayers().map(logLayer => (
                        <Select.Option key={logLayer.Name} value={logLayer.Name}>
                            {logLayer.Name}
                        </Select.Option>
                    ))}
                </Select>
                {/*日志关键字过滤器*/}
                <input type="text" value={filterText} onChange={onFilterTextChange} placeholder="Filter text"/>
            </ToolBar>
        </MainContainer>
    );
    //endregion
});

export default ScrollingLogsViewer;
//endregion