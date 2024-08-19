/*


该文件在创建时(2024年08月10日20:15:01)是
Test/Protable.tsx(在尝试使用ant design的pro table控件时的一些测试记录在此)
文件的副本.


* */
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import {useRef, useState} from 'react';
import { LogRecord4Net } from "../Model/LogRecord4Net.ts";
import {TablePaginationConfig} from "antd/lib";
import {Button, Form, Input} from "antd";

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

const queryLogApi = async (params) => {
    console.log('正在调用日志查询,params:', params);
    const queryParams = {
        ...params,
    };
    return await fetch(requestUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryParams),
    }).then(
        rsp => rsp.json()
    ).then(
        json => {
            console.log('请求成功,json:', json);
            return json;
        }
    );
}

const columns: ProColumns<LogRecord4Net>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: '类型',
        dataIndex: 'type',
        valueType: 'checkbox',
    },
    {
        title: '层级',
        dataIndex: 'layer',
        valueType: 'checkbox',
    },
    {
        title: '记录器名',
        dataIndex: 'loggerName',
        valueType: 'text',
        copyable: true,
    },
    {
        title: '模块名',
        dataIndex: 'module',
        valueType: 'text',
        copyable: true,
    },
    {
        // title: '产生时间',
        // dataIndex: 'createTime',
        // valueType: 'date',
        // sorter: true,
        //查询的时候要使用时间范围查询
        title: '产生时间',
        dataIndex: 'createTime',
        valueType: 'dateTime',
        sorter: true,
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
        title: '详情',
        dataIndex: 'detail',
        valueType: 'textarea',
        hideInSearch: true,
        ellipsis: true,
        tooltip: '详情内容过长自动收缩',
    },
    {
        title: '上下文',
        dataIndex: 'context',
        valueType: 'jsonCode',
        hideInSearch: true,
    },
];



const CustomSearchForm = ({ form, onSearch }) => {
    const handleSearch = () => {
        form.validateFields().then(values => {
            onSearch(values);
        });
    };

    return (
        <Form form={form} layout="inline" onFinish={handleSearch}>
            <Form.Item name="loggerName" label="记录器名">
                <Input placeholder="请输入记录器名" />
            </Form.Item>
            <Form.Item name="module" label="模块名">
                <Input placeholder="请输入模块名" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">查询</Button>
            </Form.Item>
        </Form>
    );
};

export const LogQuery = () => {
    const actionRef = useRef<ActionType>();
    const [form] = Form.useForm();

    const handleSearch = (values) => {
        console.log('search values:', values);
        // actionRef.current?.reload();
        // const params = proTableParams2GetLogApiQuery(values);
        queryLogApi(values).then(
            (data) => {
                console.log('查询结果:', data);
                setDataSource(data);
            }
        );
    };
    const [dataSource, setDataSource] = useState<LogRecord4Net[]>([]);

    return (
        <div style={{ backgroundColor: 'hsl(218,22%,7%)' }}>
            <CustomSearchForm form={form} onSearch={handleSearch} />
            <ProTable<LogRecord4Net>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                dataSource={dataSource}
                editable={{ type: 'multiple' }}
                columnsState={{
                    persistenceKey: 'norman.log.monitor.web',
                    persistenceType: 'localStorage',
                    onChange(value) {
                        console.log('column state changed , new value: ', value);
                    },
                }}
                rowKey="id"
                search={false} // 禁用默认搜索
                pagination={tablePagination}
                dateFormatter="string"
                headerTitle="查询结果"
                toolBarRender={() => []}
            />
        </div>
    );
};