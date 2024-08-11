// // import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
// import type {ActionType, ProColumns} from '@ant-design/pro-components';
// import { ProTable } from '@ant-design/pro-components';
// // import {Button, ConfigProvider, Dropdown, theme} from 'antd';
// import { ConfigProvider, theme} from 'antd';
// import { useRef } from 'react';
// import { LogRecord4Net } from "../Model/LogRecord4Net.ts";
// // import request from 'umi-request';
//
// // type GithubIssueItem = {
// //     url: string;
// //     id: number;
// //     number: number;
// //     title: string;
// //     labels: {
// //         name: string;
// //         color: string;
// //     }[];
// //     state: string;
// //     comments: number;
// //     created_at: string;
// //     updated_at: string;
// //     closed_at?: string;
// // };
//
// // type LogRecord4Table = {
// //     type: number,
// //     layer: number,
// //     id: string,
// //     summary: string,
// //     detail: string,
// //     module: string,
// //     createTime: string,
// //
// //
// //     // url: string;
// //     // number: number;
// //     // title: string;
// //     // labels: {
// //     //     name: string;
// //     //     color: string;
// //     // }[];
// //     // state: string;
// //     // comments: number;
// //     // created_at: string;
// //     // updated_at: string;
// //     // closed_at?: string;
// // }
//
// const requestUrl = 'http://localhost:5012/log';
// const proTableParams2GetLogApiQuery = (params: Record<string,unknown>) =>{
//     return {
//         pageSize:params.pageSize,
//         pageNumber:params.current,
//         summaryTags:params.summary,
//     }
// }
//
// const columns: ProColumns<LogRecord4Net>[] = [
//     {
//         dataIndex: 'index',
//         valueType: 'indexBorder',
//         width: 48,
//     },
//     // {
//     //     disable: true,
//     //     title: '类型',
//     //     dataIndex: 'labels',
//     //     search: false,
//     //     renderFormItem: (_, { defaultRender }) => {
//     //         return defaultRender(_);
//     //     },
//     //     render: (_, record) => (
//     //         <Space>
//     //             {record.labels.map(({ name, color }) => (
//     //                 <Tag color={color} key={name}>
//     //                     {name}
//     //                 </Tag>
//     //             ))}
//     //         </Space>
//     //     ),
//     // },
//     {
//         title: '概要',
//         dataIndex: 'summary',
//         copyable: true,
//         ellipsis: true,
//         tooltip: '概要内容过长自动收缩',
//         formItemProps: {
//             rules: [
//                 {
//                     required: true,
//                     message: '此项为必填项',
//                 },
//             ],
//         },
//     },
//     // {
//     //     disable: true,
//     //     title: '状态',
//     //     dataIndex: 'state',
//     //     filters: true,
//     //     onFilter: true,
//     //     ellipsis: true,
//     //     valueType: 'select',
//     //     valueEnum: {
//     //         all: { text: '超长'.repeat(50) },
//     //         open: {
//     //             text: '未解决',
//     //             status: 'Error',
//     //         },
//     //         closed: {
//     //             text: '已解决',
//     //             status: 'Success',
//     //             disabled: true,
//     //         },
//     //         processing: {
//     //             text: '解决中',
//     //             status: 'Processing',
//     //         },
//     //     },
//     // },
//     {
//         title: '创建时间',
//         key: 'createTime',
//         dataIndex: 'createTime',
//         valueType: 'date',
//         sorter: true,
//         hideInSearch: true,
//     },
//     // {
//     //     title: '创建时间',
//     //     dataIndex: 'created_at',
//     //     valueType: 'dateRange',
//     //     hideInTable: true,
//     //     search: {
//     //         transform: (value) => {
//     //             return {
//     //                 startTime: value[0],
//     //                 endTime: value[1],
//     //             };
//     //         },
//     //     },
//     // },
//     // {
//     //     title: '操作',
//     //     valueType: 'option',
//     //     key: 'option',
//     //     render: (text, record, _, action) => [
//     //         <a
//     //             key="editable"
//     //             onClick={() => {
//     //                 action?.startEditable?.(record.id);
//     //             }}
//     //         >
//     //             编辑
//     //         </a>,
//     //         <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
//     //             查看
//     //         </a>,
//     //         <TableDropdown
//     //             key="actionGroup"
//     //             onSelect={() => action?.reload()}
//     //             menus={[
//     //                 { key: 'copy', name: '复制' },
//     //                 { key: 'delete', name: '删除' },
//     //             ]}
//     //         />,
//     //     ],
//     // },
// ];
//
// export default () => {
//     const actionRef = useRef<ActionType>();
//     const themeConfig = {
//         token: {
//             colorPrimary: 'red',
//             borderRadius: 4,
//         },
//         algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
//     };
//     return (
//         <div
//             style={{
//                 backgroundColor: 'hsl(218,22%,7%)',
//                 height:'100%',
//                 // border:'1px solid green'
//             }}
//         >
//             <ConfigProvider theme={themeConfig}>
//                 <ProTable<LogRecord4Net>
//                     columns={columns}
//                     actionRef={actionRef}
//                     cardBordered
//                     request={async (params, sort, filter) => {
//                         console.log('正在调用日志查询api,sort:', sort,',filter:', filter, ',params:', params);
//                         return await fetch(requestUrl).then(
//                             rsp=>rsp.json()
//                         ).then(
//                             json=>{
//                                 console.log('请求成功,json:', json)
//                                 return json;
//                             }
//                         );
//                         // return request<{
//                         //     data: LogRecord4Restful[];
//                         // }>(requestUrl, {
//                         //     params,
//                         // });
//                     }}
//                     editable={{
//                         type: 'multiple',
//                     }}
//                     columnsState={{
//                         // persistenceKey: 'pro-table-singe-demos',
//                         // persistenceType: 'localStorage',
//                         persistenceKey: 'norman.log.monitor.web',
//                         persistenceType: 'localStorage',
//                         onChange(value) {
//                             console.log('column state changed , new value: ', value);
//                         },
//                     }}
//                     rowKey="id"
//                     search={{
//                         labelWidth: 'auto',
//                     }}
//                     options={{
//                         setting: {
//                             listsHeight: 400,
//                         },
//                     }}
//                     form={{
//                         // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
//                         syncToUrl: (values, type) => {
//                             if (type === 'get') {
//                                 const queryLogArgs = proTableParams2GetLogApiQuery(values);
//                                 console.log('在form syncToUrl中,values的值为:', values, '转换后的查询参数:', queryLogArgs);
//                                 // return {
//                                 //     ...values,
//                                 //     created_at: [values.startTime, values.endTime],
//                                 // };
//                                 return queryLogArgs
//                             }
//                             return values;
//                         },
//                     }}
//                     pagination={{
//                         pageSize:100
//                     }}
//                     // pagination={{
//                     //     pageSize: 10,
//                     //     onChange: (page) => console.log(page),
//                     // }}
//                     dateFormatter="string"
//                     headerTitle="查询结果"
//                     toolBarRender={() => [
//                         // <Button key="button" icon={<PlusOutlined />} type="primary">
//                         //     新建
//                         // </Button>,
//                         // <Dropdown
//                         //     key="menu"
//                         //     menu={{
//                         //         items: [
//                         //             {
//                         //                 label: '1st item',
//                         //                 key: '1',
//                         //             },
//                         //             {
//                         //                 label: '2nd item',
//                         //                 key: '2',
//                         //             },
//                         //             {
//                         //                 label: '3rd item',
//                         //                 key: '3',
//                         //             },
//                         //         ],
//                         //     }}
//                         // >
//                         //     <Button>
//                         //         <EllipsisOutlined />
//                         //     </Button>
//                         // </Dropdown>,
//                     ]}
//                 />
//             </ConfigProvider>
//         </div>
//     );
// };