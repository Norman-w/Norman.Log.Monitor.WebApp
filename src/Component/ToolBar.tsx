import styled from "styled-components";
import {Select, Tooltip} from "antd";
import {LogType} from "../Model/LogType.ts";
import {LogLayer} from "../Model/LogLayer.ts";
import React from "react";
import useStoreLogsFilterState from "../stores/useStoreLogsFilterState.ts";

const ToolBarDiv = styled.div`
  display: flex;
  column-gap: 8px;
  justify-content: center;
  margin-bottom: 8px;
  background-color: #f0f0f0;
  width: 100%;
  height: 30px;
`;

//REACT.FC (TS)
const ToolBar: React.FC = () => {
    const {
        filterText,
        setFilterText,
        setFilterLogTypes,
        setFilterLogLayers,
    } = useStoreLogsFilterState();

    const onSelectedLogTypesChange = (selectedLogTypes: string[]) => {
        setFilterLogTypes(selectedLogTypes.map(name => LogType.GetLogTypeByName(name)));
    }
    const onSelectedLogLayersChange = (selectedLogLayers: string[]) => {
        setFilterLogLayers(selectedLogLayers.map(name => LogLayer.GetLogLayerByName(name)));
    }
    return <ToolBarDiv>
        {/*日志类型过滤器*/}
        <Select
            mode="tags"
            style={{width: 100}}
            placeholder="类型过滤"
            onChange={onSelectedLogTypesChange}
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
            onChange={onSelectedLogLayersChange}
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
        <input type="text" value={filterText} onChange={(e) => setFilterText(e.target.value)}
               placeholder="Filter text"/>
    </ToolBarDiv>
}

export default ToolBar;