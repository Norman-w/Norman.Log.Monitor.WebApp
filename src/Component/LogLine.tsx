/*


每个该组件显示一行日志
显示的样式参考ViewSetting中的配置
每一个的宽度都是100%,高度自动
外围是一个很细的边框,在边框线上左上角小字显示日志记录器的名字,名字的背景色就是层级的颜色
使用类似书籍中文字的排版方式,左侧以一个antd的Tag标签开头,tab标签的图标为配置中指定的
tag标签的颜色也是按照配置中的type来设置
后面跟随的就是Summary,显示到头,如果有没显示全的,则后面用...补全
换行后显示Detail,如果有没显示全的,则后面用...补全
但光标悬浮到Summary或Detail上时,显示完整的内容
点击这条日志时,会弹出一个对话框,显示完整的日志内容,日志对话框尚未实现

* */

import React from 'react';
import { LogRecord4View } from '../Model/LogRecord4View.ts';
import { ViewSetting } from '../ViewSetting.ts';
import { Tag } from 'antd';
import styled from "styled-components";

const DetailMessage = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: auto;
   /*超出后显示...*/
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.4s;
  /*平常是灰色显示,字体小一点*/
  font-size: 12px;
    color: grey;
    /*光标悬浮时显示完整内容,高亮*/
    &:hover {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
       transition: all 0.4s;
        font-size: 16px;
        color: white;
    }
   /*过长的自动换行*/
    word-wrap: break-word;
    word-break: break-all;
    `;

const LogLine = (props: { log: LogRecord4View }) => {
    const log = props.log;
    return (
        <div style={{ width: '100%',border: '0.1px dashed lightgrey', padding: 3}}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: 'auto' }}>
                <Tag color={ViewSetting.LogTypeSetting[log.Log.Type.Value].BackColor}
                     icon={ViewSetting.LogTypeSetting[log.Log.Type.Value].Icon}>
                    <span style={ {color: ViewSetting.LogTypeSetting[log.Log.Type.Value].ForeColor}}>{log.Log.Type.Name}</span>
                </Tag>
                <div style={{ color: ViewSetting.LogLayerSetting[log.Log.Layer.Value].Color,fontWeight:"bold" }}>{log.Log.LoggerName}</div>
                <div style={{ height: 'auto',marginLeft:5 }}>{log.Log.Summary}</div>
            </div>
            {/*<div style={{ width: '100%', height: 'auto' }}>{log.Log.Detail}</div>*/}
            <DetailMessage>
                {log.Log.Detail}
            </DetailMessage>
        </div>
    );
}
export { LogLine };