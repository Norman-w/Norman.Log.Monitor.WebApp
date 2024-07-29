import styled from "styled-components";
import {Space, Table, TablePaginationConfig, Tag} from "antd";

//导入search-result-list-table样式
import './SearchResultListTable.scss'
import React, {useState} from "react";
import {ViewSetting} from "../../ViewSetting.ts";
import {LogRecord4View} from "../../Model/LogRecord4View.ts";

//制造列类型,元组信息就是列名
// interface DateType {
//     key:string,
//     id:string,
//     type:number,
//     layer:number,
//     loggerName:string,
//     module:string,
//     summary:string,
//     detail:string
// }
//定义数据类型为继承LogRecord4View,在此基础上增加key关键字
interface LogRecord4ViewType extends LogRecord4View{
    key:string
}

const columns = [
    {
        title: '日志类型',
        dataIndex: 'Log',
        key: 'key',
        /*使用标签显示*/
        render: (log) =>
            <Tag color={ViewSetting.LogTypeSetting[log.Type.Value].BackColor}
                               icon={ViewSetting.LogTypeSetting[log.Type.Value].Icon}>
            <span style={ {color: ViewSetting.LogTypeSetting[log.Type.Value].ForeColor}}>{log.Type.Name}</span>
        </Tag>
    },
    {
        title: '层级/报送者',//层级和名称一起显示
        dataIndex: 'Log',
        key: 'key',
        render: (log) =>
            <div style={{ color: ViewSetting.LogLayerSetting[log.Layer.Value].Color,fontWeight:"bold" }}>{log.LoggerName}</div>
    },
    {
        title: '模块',
        dataIndex: 'Log',
        key: 'key',
        render: (log) => log.Module
    },
    {
        title: '概要',
        dataIndex: 'Log',
        key: 'key',
        render: (log) => log.Summary
    },
    {
        title: '详情',
        dataIndex: 'Log',
        key: 'key',
        render: (log) => log.Detail
    },
    {
        title: '创建时间',
        dataIndex: 'Log',
        key: 'key',
        render: (log) => log.CreateTime
    },
];

export const SearchResultList = (props: { logs: LogRecord4View[] }) => {
    return (
        // <div className="search-result-list-table">
            <Table
                style={{width:'100%'}}
                columns={columns}
                dataSource={props.logs.map((log) => {
                    return {
                        key: log.Log.Id,
                        ...log,
                    }
                })}
            />
        // </div>
    )
}

/*







* */
