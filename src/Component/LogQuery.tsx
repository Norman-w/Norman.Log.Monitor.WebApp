/*


2024年08月21日04:47:07,ProTable太重了而且搜索功能不好用,使用antd的Table组件自己实现查询功能.
类似之前在amdm-web-server项目中的实现


* */

//region 导入React相关
import React, {useState} from "react";
//endregion
//region 导入antd组件
import Search from "antd/es/input/Search";
import {Button, Select, Space, Spin, Table, TableProps, Tag} from "antd";

//复制图标
import {CopyOutlined} from "@ant-design/icons";
//清空图标
import {ClearOutlined} from "@ant-design/icons";
//放大镜图标
import {SearchOutlined} from "@ant-design/icons";
//消息提示
import {message} from "antd";
//endregion
//region 导入自定义组件
import TimeRangeDropdown from "./TimeRangeDropdown.tsx";
//endregion
//region 导入模型
import {LogRecord4Net} from "../Model/LogRecord4Net.ts";
import {LogType} from "../Model/LogType";
import {ViewSetting} from "../ViewSetting.ts";
import {LogLayer} from "../Model/LogLayer";
//endregion

//region 构建日志类型和日志层级的Map
const logTypeMap = new Map<number, string>();
const types = LogType.GetKnownLogTypes();
for (let i = 0; i < types.length; i++) {
    logTypeMap.set(types[i].Value, types[i].Name);
}
const typeOptions: { label: string, value: number }[] = [];
for (let i = 0; i < types.length; i++) {
    typeOptions.push({label: types[i].Name, value: types[i].Value});
}

const logLayerMap = new Map<number, string>();
const layers = LogLayer.GetKnownLogLayers();
for (let i = 0; i < layers.length; i++) {
    logLayerMap.set(layers[i].Value, layers[i].Name);
}
//endregion

//region 复制文本到剪贴板方法
const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        console.log('复制到剪贴板成功:', text);
    }, (e) => {
        console.error('复制到剪贴板失败:', e);
    });
}
//endregion

//region 表格列定义
const columns: TableProps<LogRecord4Net>['columns'] = [
    {
        title: '记录器',
        dataIndex: 'LoggerName',
        key: 'LoggerName',
        width: '100px',
        ellipsis: true,
    },
    {
        title: '日志类型',
        dataIndex: 'Type',
        key: 'Type',
        width: '100px',
        ellipsis: true,
        render: (text, record) => {
            return (
                <Tag color={ViewSetting.LogTypeSetting[record.Type].BackColor}
                     icon={ViewSetting.LogTypeSetting[record.Type].Icon}>
                    <span
                        style={{color: ViewSetting.LogTypeSetting[record.Type].ForeColor}}>{logTypeMap.get(record.Type)}</span>
                </Tag>
            )
        }
    },
    {
        title: '日志层级',
        dataIndex: 'Layer',
        key: 'Layer',
        width: '100px',
        ellipsis: true,
        render: (text, record) => {
            return (
                <span style={{
                    color: ViewSetting.LogLayerSetting[record.Layer].Color,
                    fontWeight: "bold"
                }}>{logLayerMap.get(record.Layer)}</span>
            )
        }
    },
    {
        title: '模块',
        dataIndex: 'Module',
        key: 'Module',
        width: '100px',
        ellipsis: true,
    },
    {
        title: '摘要',
        dataIndex: 'Summary',
        key: 'Summary',
        //最大宽度200px,超出部分省略号显示
        width: '200px',
        ellipsis: true,
    },
    {
        title: '详情',
        dataIndex: 'Detail',
        key: 'Detail',
        // width: 'auto',
        // ellipsis: true,
        //带上一个复制按钮,点击后可以复制到剪贴板
        render: (text, record) => {
            return (
                <>
                    <span>{record.Detail}</span>
                    <CopyOutlined
                        style={{marginLeft: '10px', color: 'greenyellow'}}
                        onClick={() => {
                            copyToClipboard(record.Detail);
                            message.info('已复制到剪贴板').then(r => {
                                    console.log('消息提示已关闭:', r)
                                }
                            );
                        }}/>
                </>
            )
        },
    },
    {
        title: '时间',
        dataIndex: 'CreateTime',
        key: 'CreateTime',
        width: '200px',
        ellipsis: true,
    },
];
//endregion

export default function LogQuery() {
    //region 状态管理
    const [pagination, setPagination] = useState({current: 1, pageSize: 20, total: 0});
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<LogRecord4Net[]>([]);
    const [searchingLoggerName, setSearchingLoggerName] = useState('');
    const [searchingLogSummaryKeyword, setSearchingLogSummaryKeyword] = useState('');
    const [searchingLogDetailKeyword, setSearchingLogDetailKeyword] = useState('');
    const [searchingLogType, setSearchingLogType] = useState<number[]>([]);
    const [clearSearchingLogTypeDisabled, setClearSearchingLogTypeDisabled] = useState(true);
    const [searchingLogLayer, setSearchingLogLayer] = useState<number[]>([]);
    const [clearSearchingLogLayerDisabled, setClearSearchingLogLayerDisabled] = useState(true);
    const [searchingLogModule, setSearchingLogModule] = useState('');
    const [searchingLogCreateTimeStart, setSearchingLogCreateTimeStart] = useState<Date | null>(null);
    const [searchingLogCreateTimeEnd, setSearchingLogCreateTimeEnd] = useState<Date | null>(null);
    //endregion
    //region 页面组件事件响应
    const onClickClearAllSearchOptions = () => {
        setSearchingLoggerName('');
        setSearchingLogSummaryKeyword('');
        setSearchingLogDetailKeyword('');
        setSearchingLogType([]);
        setClearSearchingLogTypeDisabled(true);
        setSearchingLogLayer([]);
        setClearSearchingLogLayerDisabled(true);
        setSearchingLogModule('');
        setSearchingLogCreateTimeStart(null);
        setSearchingLogCreateTimeEnd(null);
        onSearchLog(pagination)
    }
    //endregion
    //region 搜索日志记录方法,网络请求和页面状态更新一体,TODO 待优化
    const onSearchLog = (pagination) => {
        if (loading) {
            console.log('正在加载中,请稍后再试')
        } else {
            setLoading(true);
            let pageNum = 0;
            if (pagination && pagination.current > 0) {
                pageNum = pagination.current - 1;
            }
            const pageSize = pagination.pageSize;
            const searchParam = {
                StartTime: searchingLogCreateTimeStart,
                EndTime: searchingLogCreateTimeEnd,
                LoggerNameList: searchingLoggerName,
                //数组是[1,2,3]这样的,转换成字符串"1,2,3"
                TypeList: searchingLogType.join(','),
                LayerList: searchingLogLayer.join(','),
                ModuleList: searchingLogModule,
                PageNumber: pageNum,
                PageSize: pageSize,
                SummaryAndDetailTags: searchingLogSummaryKeyword + ' ' + searchingLogDetailKeyword,
            };
            console.log('搜索参数:', searchParam)
            fetch('http://localhost:5012/Log', {
                method: 'POST',
                body: JSON.stringify(searchParam),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then(res => {
                    console.log('获取日志记录表:', res);
                    if (res && res.logs && res.logs.length > 0) {
                        for (let i = 0; i < res.logs.length; i++) {
                            res.logs[i].key = '' + res.logs[i].id;
                            //字段json首字母是小写的,这里转换为大写
                            res.logs[i].Type = res.logs[i].type;
                            res.logs[i].Layer = res.logs[i].layer;
                            res.logs[i].Module = res.logs[i].module;
                            res.logs[i].Summary = res.logs[i].summary;
                            res.logs[i].Detail = res.logs[i].detail;
                            res.logs[i].CreateTime = res.logs[i].createTime;
                            res.logs[i].LoggerName = res.logs[i].loggerName;
                        }
                    }
                    console.log('添加了key的日志记录结果列表:', res);
                    setLogs(res.logs);
                    setPagination({...pagination});
                    if (pageNum === 0) {
                        setPagination({...pagination, total: res.totalResultCount});
                    }
                    setLoading(false);
                })
                .catch(e => {
                    console.error('获取日志记录发生错误,请重试', e);
                    setLoading(false);
                });
        }
    }
    //endregion
    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            {/*搜索栏*/}
            <Spin spinning={loading}>{/*加载中的提示*/}
                <Space style={{width: '100%', justifyContent: 'center', flexWrap: 'wrap', gap: '30px'}}>
                    {/*日志记录器名称*/}
                    <Space>
                        <Search
                            placeholder="请输入日志记录器名称"
                            enterButton
                            value={searchingLoggerName}
                            onSearch={onSearchLog}
                            onChange={(v) => {
                                setSearchingLoggerName(v.target.value)
                            }}
                        />
                    </Space>
                    {/*日志类型*/}
                    <Space>
                        {/*类型,可多选,后面一个清空按钮,再后面跟一个放大镜图标的搜索框*/}
                        <Select mode="multiple"
                                placeholder="请选择日志类型"
                                style={{width: 180}}
                                options={typeOptions}
                                maxTagCount={2}
                                value={searchingLogType}
                                onChange={(v) => {
                                    setSearchingLogType(v);
                                    setClearSearchingLogTypeDisabled(false)
                                }}
                        />
                        {/*清空类型按钮,清空时触发一次搜索,设置清空图标为灰色*/}
                        <Button onClick={() => {
                            setSearchingLogType([]);
                            setClearSearchingLogTypeDisabled(true);
                            onSearchLog(pagination)
                        }}
                                disabled={clearSearchingLogTypeDisabled}>
                            <ClearOutlined/>
                        </Button>
                        {/*搜索按钮*/}
                        <Button type="primary" onClick={onSearchLog}><SearchOutlined/></Button>
                    </Space>
                    {/*所在层级*/}
                    <Space>
                        <Select mode="multiple"
                                placeholder="请选择日志层级"
                                style={{width: 200}}
                                options={layers.map(l => {
                                    return {label: l.Name, value: l.Value}
                                })}
                                maxTagCount={2}
                                value={searchingLogLayer}
                                onChange={(v) => {
                                    setSearchingLogLayer(v);
                                    setClearSearchingLogLayerDisabled(false)
                                }}
                        />
                        <Button onClick={() => {
                            setSearchingLogLayer([]);
                            setClearSearchingLogLayerDisabled(true);
                            onSearchLog(pagination)
                        }}
                                disabled={clearSearchingLogLayerDisabled}>
                            <ClearOutlined/>
                        </Button>
                        <Button type="primary" onClick={onSearchLog}><SearchOutlined/></Button>
                    </Space>
                    {/*模块*/}
                    <Space>
                        <Search
                            placeholder="请输入模块关键字"
                            enterButton
                            value={searchingLogModule}
                            onSearch={onSearchLog}
                            onChange={(v) => {
                                setSearchingLogModule(v.target.value)
                            }}
                        />
                    </Space>
                    {/*创建时间区间*/}
                    <Space>
                        {/*自定义的组件*/}
                        <TimeRangeDropdown onChange={(v) => {
                            setSearchingLogCreateTimeStart(v[0]);
                            setSearchingLogCreateTimeEnd(v[1]);
                            onSearchLog(pagination);
                        }}/>
                    </Space>
                    {/*摘要关键字和详情关键字*/}
                    <Search
                        placeholder="请输入概要关键字"
                        enterButton
                        value={searchingLogSummaryKeyword}
                        onSearch={onSearchLog}
                        onChange={(v) => {
                            setSearchingLogSummaryKeyword(v.target.value)
                        }}
                    />
                    <Search
                        placeholder="请输入详情关键字"
                        enterButton
                        value={searchingLogDetailKeyword}
                        onSearch={onSearchLog}
                        onChange={(v) => {
                            setSearchingLogDetailKeyword(v.target.value)
                        }}
                    />
                    {/*清空搜索选项*/}
                    <Button
                        type="primary"
                        onClick={onClickClearAllSearchOptions}>
                        清空搜索选项
                    </Button>
                </Space>
            </Spin>
            {/*日志记录表格*/}
            <Table
                columns={columns}
                dataSource={logs}
                loading={loading}
                onChange={onSearchLog}
                pagination={{position: ['topRight', 'bottomRight'], ...pagination}}
                scroll={{y: `calc(100vh - 250px)`, x: '100%'}}
            />
        </div>
    )
}