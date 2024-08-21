/*


视图设置
包含LogType对应的颜色
LogLayer对应的颜色
LogType对应的图标

使用方法如:backgroundColor: ViewSetting.LogTypeSetting[log.Log.Type.Value].BackColor
log是视图模型
Log是业务模型
Type是使用类实现的类似枚举的功能(为了添加更多的属性和易于拓展,易于使用等)
Value是"枚举"的值,也就是0,1,2,3,4,5,6等等
* */
import {LogType} from "./Model/LogType.ts";
export class ViewSetting {
    //日志类型的相关配置,这个配置是用于显示日志的颜色和图标,颜色是指Tag标签的颜色,图标是指Tag标签的图标
    public static readonly LogTypeSetting: { [key: number]: { ForeColor: string, BackColor: string, Icon: string } } = {
        [LogType.Unknown.Value]: {BackColor: 'grey', ForeColor: 'white', Icon: '🤔'},
        [LogType.Info.Value]: {BackColor: 'white', ForeColor: 'black', Icon: 'ℹ️'},
        [LogType.Debug.Value]: {BackColor: 'lightblue', ForeColor: 'black', Icon: '🎯'},
        [LogType.Error.Value]: {BackColor: 'red', ForeColor: 'white', Icon: '❌'},
        [LogType.Success.Value]: {BackColor: 'green', ForeColor: 'white', Icon: '🎉'},
        [LogType.Fail.Value]: {BackColor: 'red', ForeColor: 'white', Icon: '⛔️'},
        [LogType.Warning.Value]: {BackColor: 'orange', ForeColor: 'white', Icon: '⚠️'},
        [LogType.Start.Value]: {BackColor: 'greenyellow', ForeColor: 'black', Icon: '▶️'},
        [LogType.Finish.Value]: {BackColor: 'lightcyan', ForeColor: 'black', Icon: '🔚'},
        [LogType.Bug.Value]: {BackColor: 'darkred', ForeColor: 'white', Icon: '🐞'},
        [LogType.Simulate.Value]: {BackColor: 'cyan', ForeColor: 'white', Icon: '🎮'},
    }
    //日志所在层的颜色,这个颜色是用于显示日志的背景色(日志记录器的名称的背景)
    public static readonly LogLayerSetting: { [key: number]: { Color: string } } = {
        0: {Color: 'grey'},//未知
        1: {Color: 'white'},//系统层
        2: {Color: 'pink'},//业务层
        3: {Color: 'red'},//数据层
        4: {Color: 'green'},//服务层
        5: {Color: 'darkred'},//控制器层
        6: {Color: 'orange'},//外设层
    };
}