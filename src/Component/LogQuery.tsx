/*


该文件在创建时(2024年08月10日20:15:01)是
Test/Protable.tsx(在尝试使用ant design的pro table控件时的一些测试记录在此)
文件的副本.


* */
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { LogRecord4Net } from "../Model/LogRecord4Net.ts";
import {TablePaginationConfig} from "antd/lib";

const requestUrl = 'http://localhost:5012/log';
const tablePagination: TablePaginationConfig = {
    pageSize:100
};
const proTableParams2GetLogApiQuery = (params: Record<string,unknown>) =>{
    return {
        pageSize:params.pageSize,
        pageNumber:params.current,
        summaryTags:params.summary,
    }
}

const columns: ProColumns<LogRecord4Net>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: '概要',
        dataIndex: 'summary',
        copyable: true,
        ellipsis: true,
        tooltip: '概要内容过长自动收缩',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },
    },
    {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        valueType: 'date',
        sorter: true,
        hideInSearch: true,
    },
];

export const LogQuery = () => {
    const actionRef = useRef<ActionType>();
    return (
        <div
            style={{
                backgroundColor: 'hsl(218,22%,7%)',
            }}
        >

                <ProTable<LogRecord4Net>
                    columns={columns}
                    actionRef={actionRef}
                    cardBordered
                    request={async (params, sort, filter) => {
                        console.log('正在调用日志查询api,sort:', sort,',filter:', filter, ',params:', params);
                        return await fetch(requestUrl).then(
                            rsp=>rsp.json()
                        ).then(
                            json=>{
                                console.log('请求成功,json:', json)
                                return json;
                            }
                        );
                    }}
                    editable={{
                        type: 'multiple',
                    }}
                    columnsState={{
                        persistenceKey: 'norman.log.monitor.web',
                        persistenceType: 'localStorage',
                        onChange(value) {
                            console.log('column state changed , new value: ', value);
                        },
                    }}
                    rowKey="id"
                    search={{
                        labelWidth: 'auto',
                    }}
                    options={{
                        setting: {
                            listsHeight: 400,
                        },
                    }}
                    form={{
                        // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
                        syncToUrl: (values, type) => {
                            if (type === 'get') {
                                const queryLogArgs = proTableParams2GetLogApiQuery(values);
                                console.log('在form syncToUrl中,values的值为:', values, '转换后的查询参数:', queryLogArgs);
                                return queryLogArgs
                            }
                            return values;
                        },
                    }}
                    pagination={tablePagination}
                    dateFormatter="string"
                    headerTitle="查询结果"
                    toolBarRender={() => [
                    ]}
                />
        </div>
    );
};